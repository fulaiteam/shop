// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
  },

  onShow() {
    this.getByCountDetail()
  },

  // 消息中心列表
  getByCountDetail() {
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
        // console.log(arr)
        this.setData({dataList: arr})
      }
    })
  },

  // 点击进入求购信息页
  handleList(e) {
    let qiugouid = e.currentTarget.dataset.qiugouid
    wx.navigateTo({
      url: '/pages/buy_info/buy_info?id=' + qiugouid
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})