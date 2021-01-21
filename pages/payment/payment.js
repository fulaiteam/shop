// pages/payment/payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:'',  //标题
      addPrice:'',   //价格浮动
      category:'',  //商品类型
      commodityReadme:'',  //商品描述
      descriptionPictureDTOS:[], // 商品描述图
      detailPictureDTOS:[],   //主图
      earnestMoney:'',   //保证金
      endTime:'',   //结束时间
      reservePrice:'',   //保留价格
      startPrice:'', //起拍价
      startTime:'', //开始时间
      taktTime:'',  //演示周期

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.data.fudong= JSON.parse(options.addPrice);//解析得到对象
    // this.title=options.title
    console.log(options,111)
    this.setData({
      earnestMoney:options.earnestMoney,
      title:options.title,
      addPrice :options.addPrice,
      commodityReadme :options.commodityReadme,
      descriptionPictureDTOS :options.descriptionPictureDTOS,
      detailPictureDTOS :options.detailPictureDTOS,
      endTime :options.endTime,
      reservePrice :options.reservePrice,
      startPrice :options.startPrice,
      startTime :options.startTime,
      taktTime :options.taktTime,

    })
    console.log(this.data.earnestMoney,2222)

 
// var addPrice =options.addPrice;
// var category =options.typeid;
// var commodityReadme =options.info;
// var descriptionPictureDTOS =options.adds;
// var detailPictureDTOS =options.imgadds;
// var earnestMoney =options.baozhengjin;
// var endTime =options.timestamp2;
// var reservePrice =options.baoliu;
// var startPrice =options.qipai;
// var startTime =options.timestamp1;
// var taktTime =options.taktTime;
// var title =options.title;
// this.data.title=title
// this.data.taktTime=taktTime
// this.data.startTime=startTime
// this.data.startPrice=startPrice
// this.data.reservePrice=reservePrice
// this.data.endTime=endTime
// this.data.earnestMoney=earnestMoney
// this.data.detailPictureDTOS=detailPictureDTOS
// this.data.descriptionPictureDTOS=descriptionPictureDTOS
// this.data.commodityReadme=commodityReadme
// this.data.category=category
// this.data.addPrice=addPrice
// console.log(this.data.addPrice);
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
