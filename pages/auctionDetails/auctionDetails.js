// pages/auctionDetails/auctionDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品数据
    list: {},
    // 出价记录
    bidRecord: [],
    // 店主信息
    userInfo: {},
    // table栏选中
    isTable: 0,
    // 商品类型： 0 拍卖商品 ， 1 售卖商品
    auctionOrSale: '',
    // 商品id
    productId: '',
    openid: '',
    // 普通时间格式
    timeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options)
    const {auctionOrSale, productId, openid} = options
    // 动态修改页面导航栏标题
    wx.setNavigationBarTitle({ title: auctionOrSale == 0? '拍卖详情': '售卖详情' })      // options.name表示上个页面传过来的文字
    this.setData({
      auctionOrSale: auctionOrSale,
      productId: productId,
      openid: openid
    })
    // 发送数据请求
    this.getData()
    // 发送出价记录请求
    this.getListId()
    this.getUser()
  },

  // 请求商品数据
  getData() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/product/jglProduct/selectProductDetail',
      data: {
        "auctionOrSale": this.data.auctionOrSale,
        "productId": this.data.productId
      },
      method: 'POST',
      success: (res) => {
        // console.log(res)
        const {data} = res.data

        let TimeList = [data.startTime, data.endTime];
        let TimeList2 = TimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x).slice(0,16)
        })

        this.setData({
          list: data,
          timeList: TimeList2
        })
      }
    })
  },

  // 出价记录数据请求
  getListId() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/bep/jglBid/selectListById',
      data: {
        "query": "4"
      },
      method: 'POST',
      success: (res)=> {
        // console.log(res)
        const {records} = res.data.data
        this.setData({bidRecord: records})
      }
    })
  },

  // 店主信息数据请求
  getUser() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/product/jglProduct/selectProductUser',
      data: {
        "auctionOrSale": this.data.isTable,
        "openid": this.data.openid,
        "productId": this.data.productId
      },
      method: 'POST',
      success: (res)=>{
        console.log(res)
        const {data} = res.data
        this.setData({userInfo: data})
      }
    })
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    return new Date(+new Date(dateee) + 0 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },

  // 切换拍卖宝贝和售卖宝贝栏
  handleClick(e) {
    this.setData({isTable: e.currentTarget.dataset.index})
    this.getUser()
  }
})