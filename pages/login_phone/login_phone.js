// pages/login_phone/login_phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户手机号
    userphone: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 实时获取手机号输入框数据
  useridInput(e) {
    this.setData({
      userphone: e.detail.value
    })
    console.log(this.data.userphone)
  },

  // 跳转验证码页面
  handlePass() {
    console.log(this.data.userphone.length)
    if (!(/^1[34578]\d{9}$/.test(this.data.userphone))) {
      wx.showToast({
        title: '手机号码格式有误',
        duration: 2000,
        icon:'none'
      });
    } else {
      wx.navigateTo({
        url: '/pages/pass/pass?userphone=' + this.data.userphone
      })
    }
  },


  toLoginWx: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail)
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
              openid: '',
              pcode: '',
              phone: '',
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
                wx.navigateTo({
                  url: '/pages/login/login'
                })
              }
            }
          });
        }
      });
    } else {
      console.log('用户拒绝授权')
    }
  },

})