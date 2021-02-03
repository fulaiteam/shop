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
      earnestMoney:50,   //保证金
      endTime:'',   //结束时间
      reservePrice:'',   //保留价格
      startPrice:'', //起拍价
      startTime:'', //开始时间
      takeTime:'',  //演示周期
      auctionOrSale:'0',   //拍卖
      openid:'',
      commodityid:'',   //商品id
      thumbnail:[],
      // 调起官方微信支付接口需要的返回数据接收
      appId:'',
      nonceStr:'',
      package:'',
      paySign:'',
      signType:'',
      timeStamp:'',
      prepay_id:'',
      openid:'',
      productId: ''

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
        openid:getApp().globalData.openid,
        reservePrice: that.data.reservePrice,  //保留价格（可以为空）
        startPrice: that.data.startPrice,//起拍价
        startTime: that.data.startTime,  //开始时间
        takeTime: that.data.takeTime,   // 延时周/
        thumbnail: that.data.thumbnail[0].url,  //缩略图 1
        title: that.data.title,  //标题
        auctionOrSale:that.data.auctionOrSale,
        productId: that.data.productId
      },
     
      method:'post',
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        console.log(res.data.data);
        if(res.data.flag==true) {
          wx.showModal({
            title: '发布成功',
            content: '已成功发布',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                  wx.switchTab({
                    url:"/pages/index/index"
                  })
              }
            }
        })
        }
        that.setData({
          commodityid:res.data.data,
        })
    

        console.log(that.data.commodityid);

      }
    })
},

zhifu:function(){
  let that =this;
  wx.request({
    // url:getApp().globalData.baseUrl+ '/jglPay/pay',                                                                                                                                                                                                                                                                           ', 
    url:getApp().globalData.baseUrl + 'pay/jglPay/pay',
    data: {
      // kedagai
      openId:getApp().globalData.openid,
      money:that.data.earnestMoney,
      productId:that.data.commodityid,
      idno:''
    },
   
    method:'post',
    header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function(res) {
     console.log(res.data);
     if(res.data.flag==false) {
      wx.showModal({
        title: '发布失败',
        content: '请先登录',
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url:"/pages/login_phone/login_phone"
                })
            }else{
               console.log('用户点击取消')
            }
        }
    })
     }
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
        // errMsg: "requestPayment:ok"
        if(res.errMsg=='requestPayment:ok') {
          that.Jump()
        } 
      },
      fail:function(res){},
      complete:function(res){}
    })
    // that.wxZhifu()
    }
  })
},


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
      takeTime :options.takeTime,
      auctionOrSale :options.auctionOrSale,
      openid:options.openid,
      thumbnail:JSON.parse(options.thumbnail),
      productId: options.productid
    })
    console.log(this.data.earnestMoney,2222)
    console.log(this.data.endTime,2222)
   
    console.log(options);
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
