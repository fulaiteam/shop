// pages/auctionApply/auctionApply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入信息
    applyMessage: [
      {
        table: '竞买人',
        placeholder: '请输入姓名'
      },
      {
        table: '手机号',
        placeholder: '请输入手机号'
      },
      {
        table: '地址选填',
        placeholder: '请输入地址'
      },
      {
        table: '需缴纳保证金',
        placeholder: '请输入金额'
      }
    ],
    // 模式 
    //  1 正在进行未填写
    //  2 即将进行未填写
    isApply: 2
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

  }
})