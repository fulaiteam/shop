// pages/auctionBid/auctionBid.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否报名
    isBid: 1,
    // 商品id
    productId: '',
    openid: '',
    // 商品标题
    title: '',
    // 商品图片
    swiperImg: [],
    // 商品最高价
    money: '',
    // 商品最高价修改
    alterMoney: '',
    // 商品最高价不修改
    cacheMoney: '',
    // 加价涨幅
    addPrice: '',
    // 竞拍公告按钮
    afficheBtn: false,
    // 自定义弹窗
    showDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let swiperImg = []
    swiperImg = options.image.split(",")
    // console.log(swiperImg)
    this.setData({
      productId: options.productId,
      openid: options.openid,
      title: options.list,
      swiperImg: swiperImg,
      money: this.miliFormat(options.money),
      cacheMoney: options.money,
      alterMoney: options.money,
      addPrice: options.addPrice
    })
  },

  // 减按钮
  handleMinusPrice(e) {
    if(this.data.alterMoney <= this.data.cacheMoney) {
      this.setData({alterMoney: this.data.cacheMoney})
      wx.showToast({
        title: '出价不能低于或等于当前价',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({alterMoney: Number(this.data.alterMoney) + Number(e.currentTarget.dataset.price)})
    }
  },
  // 加按钮
  handleAddPrice(e) {
    this.setData({alterMoney: Number(this.data.alterMoney) + Number(e.currentTarget.dataset.price)})
  },

  // 竞拍公告按钮点击事件
  handleaffiche() {
    this.setData({afficheBtn: !this.data.afficheBtn})
  },

  // 确认按钮
  handleBottom() {
    if (this.data.afficheBtn) {
      if (this.data.alterMoney > this.data.cacheMoney) {
        wx.request({
          url: getApp().globalData.baseUrl + 'bep/jglBid/addbid',
          method: 'POST',
          data: {
            "openid": this.data.openid,
            "price": this.data.alterMoney,
            "productId": this.data.productId
          },
          success: (res) => {
            console.log(res)
          }
        })
        this.setData({
          showDialog: true,
          money: this.miliFormat(this.data.alterMoney),
        })
      } else {
        wx.showToast({
          title: '出价不能等于当前价',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请先阅读竞买人竞拍公告',
        icon: 'none',
        duration: 2000
      })
    }
  },

  toggleDialog() {
    this.setData({
      showDialog: false
    });
  },

  // 千分位分割 - 整、小数混合
  miliFormat(num) {  
    return num && num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  },
})