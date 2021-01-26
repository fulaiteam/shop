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
    // 店铺是否认证： 0 - 未认证 ， 1 - 认证
    status: '',
    // 推荐商品数据
    rectangleGood: {},
    // table栏选中
    isTable: 0,
    // 商品类型： 0 拍卖商品 ， 1 售卖商品
    auctionOrSale: '',
    // 商品id
    productId: '',
    // 商品分类id - 推荐商品用
    category: '',
    openid: '',
    // 轮播图数据
    swiperImg: [],
    // 拍卖商品当前价格
    money: 0,
    // 拍卖商品当前价格 - 普通格式 (用于传参)
    commonMoney: 0,
    // 售卖商品价格
    price: 0,
    // 商品开始、结束普通时间格式
    timeList: [],
    // 出价记录普通时间格式
    byTimeList: [],
    // 出价记录总条数
    byTotal: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    // 发送店主数据请求
    this.getUser()
    // 推荐商品请求
    this.getRectangleGood()
  },

  // 请求商品数据
  getData() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/product/jglProduct/selectProductDetail',
      // url: getApp().globalData.baseUrl + 'product/jglProduct/selectProductDetail',
      data: {
        "auctionOrSale": this.data.auctionOrSale,
        "productId": this.data.productId
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const {data} = res.data

        // 另存商品轮播图数据 - 做全屏预览
        let arr = data.descriptionPictureVOS
        let swiperImg = arr.map(v => {
          return v.url
        })
        // 修改及保存商品开拍时间和结束时间
        let TimeList = [data.startTime, data.endTime];
        let TimeList2 = TimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x).slice(0,16)
        })

        this.setData({
          list: data,
          category: data.category,
          timeList: TimeList2,
          swiperImg: swiperImg,
        })

        // 判断拍卖页当前价是否为最高价，有就是最高价，没有就是起拍价
        if (this.data.auctionOrSale == 0) {
          // 请求最高价
          wx.request({
            url: 'http://192.168.3.70:10010/jgl/bep/jglBid/selectMaxById',
            method: 'POST',
            data: {
              productId: this.data.productId
            },
            success: (o) => {
              console.log(o)
              if (o.data.flag) {
                const {price} = o.data.data
                this.setData({
                  money: this.miliFormat(price),
                  commonMoney: price
                })
              } else {
                this.setData({
                  money: this.miliFormat(data.startPrice),
                  commonMoney: data.startPrice
                })
              }
            }
          })
          // 否则为售卖价
        } else {   
          this.setData({money: this.miliFormat(data.salePrice)})
        }
      }
    })
  },

  // 出价记录数据请求
  getListId() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/bep/jglBid/selectListById',
      data: {
        "currentPage": 1,
        "pageSize": 5,
        "query": this.data.productId
      },
      method: 'POST',
      success: (res)=> {
        // console.log(res)
        const {rows, total} = res.data.data
        this.setData({
          bidRecord: rows,
          byTotal: total,
        })

        // 执行修改和添加出价时间的事件
        // 创建新数组，获得所有出价记录的时间
        let TimeList = [];
        rows.forEach(o => {
          TimeList.push(o.createTime)
        })
        // 修改日期数据
        let TimeList2 = TimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x).slice(5,10)
        })
        // 修改时间数据
        let TimeList3 = TimeList.map(x => {
          return this.renderTime(x).slice(11,19)
        })
        // 将每组修改的日期及时间数据放到对应的 bidRecord 记录数据中，做渲染用
        let arr = this.data.bidRecord
        arr.forEach((item, index) => {
          let objDay = "bidRecord[" + index + "].objDay"
          let objTime = "bidRecord[" + index + "].objTime"
          this.setData({
            [objDay]: TimeList2[index].replace(/-/, "."),
            [objTime]: TimeList3[index]
          })
        })
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
        // console.log(res)
        const {data} = res.data
        this.setData({
          userInfo: data,
          status: data.status
        })
      }
    })
  },

  // 推荐商品数据
  getRectangleGood() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/product/jglProduct/selectDetailRecommendProduct',
      data: {
        category: this.data.category
      },
      method: "get",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res)=>{
        // console.log(res)
        const {data} = res.data
        this.setData({rectangleGood: data})
      }
    })
  },

  // 商品轮播图全屏显示
  handleFullScreen(e) {
    // console.log(e)
    // 在新页面中全屏预览图片
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: this.data.swiperImg // 需要预览的图片http链接列表
    })
  },

  // 千分位分割 - 整、小数混合
  miliFormat(num) {  
    return num && num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
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
  },

  // 参与出价
  handleBid() {
    wx.navigateTo({
      url: '/pages/auctionBid/auctionBid?productId=' + this.data.productId + '&openid=' + this.data.openid + '&money=' + this.data.commonMoney + '&addPrice=' + this.data.list.addPrice + '&image=' + this.data.swiperImg + '&list=' + this.data.list.title,
    })
  },

  // 报名
  handleApply() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/bep/jglEnroll/addEnroll',
      data: {
        "openid": "oS5bk5MYWJQtMTpMI9Atkyy0xlos",
        "productId": this.data.productId,
      },
      method: 'POST',
      success: (res)=>{
        console.log(res)

        if (res.data.flag) {
          wx.navigateTo({
            url: '/pages/earnestMoney/earnestMoney?openid=oS5bk5MYWJQtMTpMI9Atkyy0xlos&money=' + this.data.list.earnestMoney + '&productId=' + this.data.productId + '&idno=' + res.data.data.id + '&flag=' + res.data.flag
          })
        } else {
          wx.navigateTo({
            url: '/pages/earnestMoney/earnestMoney?flag=' + res.data.flag + '&money=' + this.data.list.earnestMoney
          })
        }

        // this.setData({flag: res.data.flag})
      }
    })
  }
})