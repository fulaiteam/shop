// pages/user_info/user_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({phone: options.phone})
  },

  getUserInfo(e) {
    console.log(e)
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: res => {
          console.log("code转换", res.code); //用code传给服务器调换session_key
          wx.request({
            // url:getApp().globalData.baseUrl + '/wxlogin',
            // url:'http://192.168.3.70:10010/jgl/user/jglUser/wxlogin',
            url: getApp().globalData.baseUrl + 'user/jglUser/wxlogin',
            method: 'post',
            data: {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              phone: this.data.phone,
              openid: '',
              pcode: '',
              sessionKey: ''
            },
            success: res => {
              if (res.data.flag) {
                getApp().globalData.openid = res.data.data.openid;
                getApp().globalData.code = res.data.data.code;
                console.log(getApp().globalData.openid, getApp().globalData.code, 2222)
                wx.setStorageSync("code", res.data.data.code);
                wx.setStorageSync("openid", res.data.data.openid);
                wx.setStorageSync("session_key", res.data.data.sessionKey);
                wx.switchTab({
                  url: '/pages/personal/personal'
                })
              }
            }
          });
        }
      });
    } else {
      console.log('用户拒绝授权')
    }
  }
})