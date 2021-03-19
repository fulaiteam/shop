// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput: '',  // 输入框输入内容
    isFoucs: false,  // 是否获取焦点
    history_tag: [],  // 搜索历史
    hotGoodsInfo: [],  // 搜索数据
    infoTotal: '',  // 搜索结果条数
    ifSearch: 0,   // 0 是未搜索， 1 是搜索结果
    recommend_tag: ['头盔123','摩托车312','摩托车0','头盔6','头盔7','头盔8'],
    searchResult: 1,  // 0 是没有搜索结果， 1 是有搜索结果
    haveFont: false,   // 输入框是否有文字
    pagenum: 1,  // 当前页面
    isLoading: false,  // 判断是否正在加载
    hasMore: false,  // 是否到了最后一页


    listarr: [],//创建数组
    input_value: "",//value值
  },

  onLoad() {
    //读取缓存历史搜索记录
    wx.getStorage({
      key: 'list_arr',
      success: (res)=> {
        this.setData({
          listarr: res.data
        })
      }
    })
  },

  // 输入框输入文字时触发
  handleInput(e) {
    // console.log(e)
    this.setData({searchInput: e.detail.value})
    if (this.data.searchInput.trim() == '') {
      this.setData({
        haveFont: false,
        ifSearch: 0,
        pagenum: 1
      })
    } else {
      this.setData({haveFont: true})
    }
  },

  // 点击删除按钮删除输入的文字
  handleCancel() {
    this.setData({
      searchInput: '',
      haveFont: false,
      isFoucs: true,
      ifSearch: 0,
      hasMore: false,
      pagenum: 1
    })
  },

  // 存储搜索记录
  getStorages() {
    if (this.data.haveFont) {
      let This = this;
      //把获取的input值插入数组里面
      let arr = this.data.listarr;
      console.log(this.data.searchInput)
      console.log(this.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (this.data.input_value == ""){
        console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(this.data.searchInput);
        console.log(arr.indexOf(this.data.searchInput));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum,1)
          arr.unshift(this.data.searchInput);
 
        }else{
          arr.unshift(this.data.searchInput);
        }
      
      } else  {
        console.log('进来第一个')
        let arr_num = arr.indexOf(this.data.input_value);
        console.log(arr.indexOf(this.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.input_value);
        } else {
          arr.unshift(this.data.input_value);
        }
 
      }
      console.log(arr)
 
      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })
 
    
      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          This.setData({
            listarr: res.data
          })
        }
      })
      this.setData({
        input_value: '',
      })
    } else {
      console.log("取消")
    }
  },

  // 点击搜索
  handleSearch() {

    if(this.data.searchInput.trim() == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.getStorages()

      this.setData({
        ifSearch: 1,
        searchResult: 1,
        hasMore: false,
        pagenum: 1,
        hotGoodsInfo: [],
      })
      // console.log(this.data.isLoading, this.data.hasMore)
      this.getSearchList()
    }
    
  },

  // 获取搜索结果数据
  getSearchList() {
    //如果开关时正在加载状态，直接返回
    if (this.data.isLoading || this.data.hasMore) return ;
    // 否则打开开关
    this.data.isLoading = true;

    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl+ 'product/jglSell/selectHomeSell',
          method: 'POST',
          data: {
            "currentPage": this.data.pagenum,
            "pageSize": 10,
            "query": {
              "title": this.data.searchInput
            }
          },
          success: (res)=> {
            console.log(res)
            const {rows, total} = res.data.data
            if (total == 0) {
              this.setData({
                searchResult: 0,
                isLoading: false
              })
            } else {
              this.setData({
                hotGoodsInfo: [...this.data.hotGoodsInfo, ...rows],
                infoTotal: total
              })
  
              // 页数加一，解决了不会同时存在多个请求，避免服务器的奔溃
              this.data.pagenum ++;
              // 关灯 表示加载完毕
              this.data.isLoading = false;
              
              // 是否加载完毕
              if(this.data.hotGoodsInfo.length >= total){
                // 已经到了最后一页
                this.setData({hasMore: true});
              }
            }

            wx.hideLoading()
          }
        })
      }
    })
  },

  // 删除历史搜索
  handleremove() {
    wx.showModal({
      title: '确定删除记录吗',
      showCancel: true,
      success: (res)=> {
        if (res.confirm) {
          //清除当前数据
          this.setData({
            listarr: []
          });
          //清除缓存数据
          wx.removeStorage({
            key: 'list_arr'
          })
        }
      }
    })
  },

  // 点击搜索记录赋值到input框
  this_value(e) {
    // console.log(e.currentTarget.dataset.text)
    let value = e.currentTarget.dataset.text
    this.setData({
      haveFont: true,
      pagenum: 1,
      hasMore: false,
      searchInput: value
    })
    this.handleSearch()
  },

  // 跳转到售卖详情页
  handleToSellDetails(e) {
    const {openid, productid} = e.currentTarget.dataset
    // console.log(openid, productid)
    if (getApp().globalData.openid) {
      wx.navigateTo({
        url: "/pages/auctionDetails/auctionDetails?auctionOrSale=1&productId=" + productid + "&openid=" + openid
      })
    } else {
      wx.showToast({
        title: '请授权登录！',
        icon: 'none',
        duration: 1500,
        success: ()=> {
     //定时器，未授权1.5秒后跳转授权页面
        setTimeout(()=> {
          wx.navigateTo({
            url: '/pages/login_phone/login_phone'
          })
         }, 1500);
        }
      })
    }
  },

  // 触底事件
  handleBottom() {
    this.getSearchList()
  },

})