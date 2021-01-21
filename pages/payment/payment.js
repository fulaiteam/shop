// pages/payment/payment.js
const app = getApp();

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
      auctionOrSale:'0',   //拍卖
      openid:'oS5bk5DPJKHDc6UwrR8xcUb3Ri8w',
      commodityid:'',   //商品id
      // 调起官方微信支付接口需要的返回数据接收
      appId:'',
      nonceStr:'',
      package:'',
      paySign:'',
      signType:'',
      timeStamp:'',
      prepay_id:''

  },
  Jump:function() {
    let that =this;
    wx.request({
      url:getApp().globalData.baseUrl+ '/product/jglProduct/releaseProduct', 
      data: {
        addPrice: that.data.addPrice,   //加价幅度
        category:that.data.category,   //商品类型
        commodityReadme: that.data.commodityReadme,  //商品自述
        descriptionPictureDTOS: that.data.descriptionPictureDTOS,   //详情图
        detailPictureDTOS: that.data.detailPictureDTOS,     //主图
        earnestMoney: that.data.earnestMoney,   //保证金
        endTime: that.data.endTime,  //结束时间
        opneid:that.data.openid,
        reservePrice: that.data.reservePrice,  //保留价格（可以为空）
        startPrice: that.data.startPrice,//起拍价
        startTime: that.data.startTime,  //开始时间
        taktTime: that.data.taktTime,   // 延时周/
        thumbnail: '',  //缩略图 1
        title: that.data.title,  //标题
        auctionOrSale:that.data.auctionOrSale
      },
     
      method:'post',
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        console.log(res.data.data);
        that.setData({
          commodityid:res.data.data,
        })
        that.zhifu()

        console.log(that.data.commodityid);

      }
    })
},
zhifu:function(){
  let that =this;
  wx.request({
    // url:getApp().globalData.baseUrl+ '/jglPay/pay',                                                                                                                                                                                                                                                                           ', 
    url:'https://jgl.hemajia.net/jgl/pay/jglPay/pay',
    data: {
      // kedagai
      openId:'oS5bk5DPJKHDc6UwrR8xcUb3Ri8w',
      money:that.data.earnestMoney,
      productId:that.data.commodityid,
      idno:''
    },
   
    method:'post',
    header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function(res) {
     console.log(res.data.data);
     that.setData({
      // appId:res.data.data.appId,
      nonceStr:res.data.data.nonceStr,
      package:res.data.data.package,
      paySign:res.data.data.paySign,
      prepay_id:res.data.data.prepay_id,
      signType:res.data.data.signType,
      timeStamp:res.data.data.timeStamp,
      
    })
    wx.requestPayment({
      // appId: that.data.appId,
      timeStamp: that.data.timeStamp,
      nonceStr: that.data.nonceStr,
      package: that.data.package,
      signType:  that.data.signType,
      paySign: that.data.paySign,
      success:function(res){
        console.log(res);
      },
      fail:function(res){},
      complete:function(res){}
    })
    // that.wxZhifu()
    }
  })
},

// 成功后返回的数据调微信支付接口
// wxZhifu:function() {
//   let that =this;
//   wx.requestPayment({
// 		timeStamp: that.data.timeStamp,
// 		nonceStr: that.data.nonceStr,
// 		package: that.data.package,
// 		signType:  that.data.signType,
// 		paySign: that.data.paySign,
// 		success:function(res){
//       console.log(res);
//     },
// 		fail:function(res){},
// 		complete:function(res){}
// 	})
// },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.data.fudong= JSON.parse(options.addPrice);//解析得到对象
    // this.title=options.title
    console.log(options,111)
    this.setData({
      category:options.category,
      earnestMoney:JSON.parse(options.earnestMoney),
      title:options.title,
      addPrice :options.addPrice,
      commodityReadme :options.commodityReadme,
      descriptionPictureDTOS :JSON.parse(options.descriptionPictureDTOS),
      detailPictureDTOS :JSON.parse(options.detailPictureDTOS),
      endTime :options.endTime,
      reservePrice :options.reservePrice,
      startPrice :options.startPrice,
      startTime :options.startTime,
      taktTime :options.taktTime,
      auctionOrSale :options.auctionOrSale,
    })
    console.log(this.data.earnestMoney,2222)
    console.log(this.data.endTime,2222)
    // console.log(earnestMoney);
    // console.log(this.data.descriptionPictureDTOS,2222)
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
