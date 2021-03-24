// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],  // 数据集合暂存
    dataList: [],
    isMore: false,  // 是否显示加载更多
  },

  onShow() {
    this.getByCountDetail()
  },

  // 获取消息中心消息请求
  getByCountDetail() {
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl + 'product/jglQiugou/selectByCountDetail',
          method: 'POST',
          data: {
            'openid': getApp().globalData.openid,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' //query
          },
          success: (res)=> {
            console.log(res)
            let list = res.data.data
            let arr = []  // 去重后的数组对象集合
            let hash = {}  // 记录该数组对象中的openid是否已经存在
            // let total = ''  // 记录存储进arr的对象的索引值
            for (var i = 0; i < list.length; i++) {
              let elem = list[i].qiugouid;
              if (!hash[elem]) {
                arr.push(list[i]);
                hash[elem] = true;
              } else {
                for (var j = 0; j < arr.length; j++) {
                  if (arr[j].qiugouid == elem) {
                    arr[j].xinzengshu+= list[i].xinzengshu
                  }
                }
              }
            }
    
            if (arr.length > 10) {
              this.setData({
                isMore: true
              })
            }
    
            let arrTheTen = []  // 去重后的数组对象前10条集合
            arr.forEach((item, index)=> {
              // console.log(item, index)
              if (index <= 9) {
                arrTheTen.push(item)
              }
            })
            
            // console.log(arr)
            this.setData({
              dataList: arrTheTen,
              list: arr
            })

            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
    })
  },

  // 点击进入求购信息页
  handleList(e) {
    let qiugouid = e.currentTarget.dataset.qiugouid
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglQiugou/deleteByHuancun',
      method: 'POST',
      data: {
        openid: getApp().globalData.openid,
        qiugouid: qiugouid,
      },
      success: (res)=> {
        console.log(res)
        wx.navigateTo({
          url: '/pages/buy_info/buy_info?id=' + qiugouid
        })
      }
    })
  },

  handleMore() {
    console.log(this.data.list)
    console.log(this.data.dataList)
    let more = this.data.list
    this.setData({
      dataList: more,
      isMore: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})