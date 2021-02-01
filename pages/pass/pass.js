// pages/pass/pass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    // 用户验证码
    userpass: '',
     // 用户验证码数组格式
    veCode: new Array(),
    time: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({phone: options.userphone})
    this.getPass()
    this.againTime()
  },

  // 获取验证码
  getPass() {
    wx.request({
      url: getApp().globalData.baseUrl + 'user/jglUser/sendforLogin',
      data: {
        phone: this.data.phone
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res)=> {
        console.log(res)
      }
    })
  },

  // 实时获取验证码输入框数据
  inputValue(e) {
    let value = e.detail.value;
    let arr = [...value];
    this.setData({
      veCode: arr,
      userpass: e.detail.value
    })
    console.log(this.data.userpass)
  },

  // 倒计时
  againTime() {
    let time = this.data.time;
    clearInterval(timing);
    let timing = setInterval(() => {
      if (time <= 0) {
        clearInterval(timing)
      } else {
        time--;
        this.setData({
          time: time
        })
      }
    }, 1000)
  },

  // 点击重新获取
  againTimeBtn() {
    this.setData({ time: 60 });
    this.getPass()
    this.againTime()
  },

  // 点击登录
  handleLogin() {
    if (this.data.time <= 0) {
      wx.showToast({
        title: '请获取验证码',
        duration: 2000,
        icon:'none'
      });
    } else {
      if (this.data.userpass.length < 6) {
        wx.showToast({
          title: '验证码格式有误',
          duration: 2000,
          icon:'none'
        });
      } else {
        wx.request({
          url: getApp().globalData.baseUrl + 'user/jglUser/phonelogin',
          method: 'POST',
          data: {
            phone: this.data.phone,
            pcode: this.data.userpass
          },
          success: (res)=> {
            console.log(res)
            if (res.data.data) {
              getApp().globalData.openid = res.data.data;
              wx.setStorageSync("openid", res.data.data);
              wx.switchTab({
                url:'/pages/personal/personal'
              })
            } else {
              wx.navigateTo({
                url:'/pages/user_info/user_info?phone=' + this.data.phone
              })
            }
          }
        })
      }
    }
  }
  
})