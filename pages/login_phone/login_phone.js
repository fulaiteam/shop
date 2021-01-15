// pages/login_phone/login_phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toLoginWx:function(){
    wx.navigateTo({
        url: '/pages/login/login'
    })
},
bindGetUserInfo (e) {
  console.log(e.detail)
  if(e.detail.errMsg  == 'getUserInfo:ok'){
    wx.login({
      success: res => {
        console.log("code转换", res.code);//用code传给服务器调换session_key
        wx.request({
          url:getApp().globalData.baseUrl + '/wxlogin',
          method: 'post',
          data: {
            code: res.code,
            encryptedData:e.detail.encryptedData,
            iv:e.detail.iv,
            openid:'',
            pcode:'',
            phone:'',
            sessionKey:''
          },
          success: res => {
           if(res.data.flag){
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
  }else{
    console.log('用户拒绝授权')
  }
}
})