// pages/auctionDetails/auctionDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {
      title: "铃木gsx250sr高配100多公里",
      apply_num: 22,
      circusee_time: 10000,
      price: "2,222",
      auction_info: {
        auction_type: "增加拍",
        auction_starting_price: 100,
        auction_earnest_money: 50,
        auction_amount: 300,
        auction_start: "2020-12-11 13:17",
        auction_over: "2020-12-12 13:17",
        auction_reserve_price: "无",
        auction_delayed: 5
      },
    },
    // table栏选中
    isTable: 0,
    // 情况
    // 1 拍卖
    // 2 售卖
    auction_case: 1
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

  handleClick(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({isTable: e.currentTarget.dataset.index})
  }
})