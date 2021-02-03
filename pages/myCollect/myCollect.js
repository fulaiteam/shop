// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收藏商品数据
    list: [],
    // 是否点击选择器
    ifCheckAll: false,
    // 是否全选
    allSelect: false,
  },

  onLoad() {
    this.collectList()
  },

  //获去收藏列表信息
  collectList() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglCollection/selectCollectionPage',
      data: {
        "currentPage": '',
        "pageSize": '',
        "query": getApp().globalData.openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //query
      },
      success: (res) => {
        console.log(res);
        const {rows} = res.data.data
        this.setData({list: rows})

        // 状态初始化
        this.selectedInit()
      }
    })
  },

  // 选中状态初始化
  selectedInit() {
    let arr = this.data.list
    arr.forEach((item, index) => {
      let pitchOn = "list[" + index + "].selected"
      let collectBorder = "list[" + index + "].selectedBorder"
      let collectOpacity = "list[" + index + "].selectedOpacity"
      this.setData({
        [pitchOn]: false,
        [collectBorder]: '1px solid #000',
        [collectOpacity]: '0'
      })
    })
  },

  // 选中状态
  changeStatus(e) {
    const {index} = e.currentTarget.dataset
    let collectState = "list[" + index + "].selected"
    let collectBorder = "list[" + index + "].selectedBorder"
    let collectOpacity = "list[" + index + "].selectedOpacity"
    this.setData({
      [collectState]: !this.data.list[index].selected,
    })
    if (this.data.list[index].selected) {
      this.setData({
        [collectBorder]: 'none',
        [collectOpacity]: '1'
      })
    } else {
      this.setData({
        [collectBorder]: '1px solid #000',
        [collectOpacity]: '0'
      })
    }
    this.getAllselect()
    // console.log(this.data.list)
  },

  // 点击全选按钮
  changeAll() {
    // 保存当前的allSelect状态 取反 否则 因为你改变了this.goods[id].selected的状态 会触发计算属性重新计算
    // allSelect状态  就会变成动态值了
    const selected = !this.data.allSelect;
    
    // 循环商品列表
    this.data.list.forEach((item, index) => {
      let collectState = "list[" + index + "].selected"
      let collectBorder = "list[" + index + "].selectedBorder"
      let collectOpacity = "list[" + index + "].selectedOpacity"
      this.setData({
        [collectState]: selected,
      })
      if (this.data.list[index].selected) {
        this.setData({
          [collectBorder]: 'none',
          [collectOpacity]: '1'
        })
      } else {
        this.setData({
          [collectBorder]: '1px solid #000',
          [collectOpacity]: '0'
        })
      }
    });
    this.setData({
      allSelect: selected,
    });
  },

  // 计算全选状态
  getAllselect() {
    let selected = true
    this.data.list.forEach(v => {
      if (v.selected == false) {
        selected = false
      }
    });
    this.setData({
      allSelect: selected
    });

  },

  // 点击选择器
  handleCheckAll() {
    this.setData({ifCheckAll: !this.data.ifCheckAll})
    if (this.data.ifCheckAll == false) {
      // 状态初始化
      this.selectedInit()
      this.setData({allSelect: false})
    }
  },

  // 删除
  handleremove() {
    let arr = []
    this.data.list.forEach((item, index)=>{
      if (item.selected) {
        arr.push(item.collectionId)
      }
    })
    wx.showModal({
      title: '确认取消收藏商品',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + 'product/jglCollection/deleteCollectByIds',
            data: {
              ids: arr
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: (res)=> {
              // console.log(res)
              this.setData({ifCheckAll: false})
              this.collectList()
            }
          })
        }
      }
    })
  },

  // 点击商品
  handleNavigateTo(e) {
    const {productid, openid} = e.currentTarget.dataset
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglProduct/selectstatusByProductId',
      data: {
        productId: productid
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res)=> {
        console.log(res)
        if (res.data.message == "商品已经下架") {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.message == "还在上架"){
          wx.navigateTo({
            url: '/pages/auctionDetails/auctionDetails?auctionOrSale=1&productId=' + productid + '&openid=' + openid
          })
        }
      }
    })
  }
  
})