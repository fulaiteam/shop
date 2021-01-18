// pages/All_auction/All_auction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
name:'1234444',
day:'55',
show:true,
isshow:false,
array:[  //拍卖宝贝的数组
{
  img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/chanpin.png',
  title:'AGV k1摩特车头盔',
  price:'¥620.80',
  time:'00:20:10'
},
{
  img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/chanpin.png',
  title:'AGV k1摩特车头盔',
  price:'¥620.80',
  time:'00:20:10'
},
{
  img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/chanpin.png',
  title:'AGV k1摩特车头盔',
  price:'¥620.80',
  time:'00:20:10'
},
{
  img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/chanpin.png',
  title:'AGV k1摩特车头盔',
  price:'¥620.80',
  time:'00:20:10'
},
{
  img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/chanpin.png',
  title:'AGV k1摩特车头盔',
  price:'¥620.80',
  time:'00:20:10'
},
{
  img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/chanpin.png',
  title:'AGV k1摩特车头盔',
  price:'¥620.80',
  time:'00:20:10'
},

]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
show:function() {
  this.setData({
    show : true,
    isshow:false,
    
  })
},
isshow:function() {
  this.setData({
    isshow : true,
    show:false
  })
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