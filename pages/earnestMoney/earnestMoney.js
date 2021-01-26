// pages/earnestMoney/earnestMoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否支付
    isPay: 1,
    // 保证金金额
    earnestMoney: '',
    // 商品id
    productId: '',
    // 支付id
    idno: '',
    // 是否报名
    flag: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.flag == 'true') {
      this.setData({
        earnestMoney: options.money,
        productId: options.productId,
        idno: options.idno
      })
    } else {
      this.setData({
        earnestMoney: options.money,
        isPay: 2
      })
    }
    
  },

  handlePay() {
    wx.request({
      url: 'https://jgl.hemajia.net/jgl/pay/jglPay/pay',
      data: {
        openId: wx.getStorageSync('openid'),
        money: this.data.earnestMoney,
        productId: this.data.productId,
        idno: this.data.idno,
      },
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res)=>{
        console.log(res)
        const {data, flag} = res.data
        if (flag) {
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: (o)=>{
              // console.log(res)
              if (o.errMsg == 'requestPayment:ok') {
                wx.showToast({
                  title: '报名成功',
                  icon: 'none',
                  duration: 2000
                })
                this.setData({isPay: 2})
              }
            }
          })
        }
      }
    })
  }
})