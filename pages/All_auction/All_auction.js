// pages/All_auction/All_auction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 发布商品人的openid
    openid: '',
    isAuction: 0,  // 0 - 拍卖 ， 1 - 售卖
    dataList: {productVOS: []},     // 页面数据
    actEndTimeList: [],  // 倒计时 - 各商品结束时间
    auctionPrice: [],  // 拍卖价格商品价格 - 千位分割
    objTime: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      openid: options.openid
    })
    this.getData()
    
  },

  onShow() {
    this.countDown();
  },

  // 发送请求
  getData() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglProduct/selectReleaseProduct',
      data: {
        openid: this.data.openid,
        auctionOrSale: this.data.isAuction
      },
      method: "get",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res)=>{
        console.log(res)
        const {data} = res.data

        let endTimeList = [];
        let priceList = [];
        
        // 将活动的结束时间参数提成一个单独的数组，方便操作
        data.productVOS.forEach(o => {
          endTimeList.push(o.endTime)
          priceList.push(o.Price)
        })
        let endTimeList2 = endTimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x)
        })
        let priceList2 = priceList.map(x => {
          return this.miliFormat(x)
        })

        this.setData({
          dataList: data,
          actEndTimeList: endTimeList2,
          auctionPrice: priceList2
        })
      }
    })
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    return new Date(+new Date(dateee) + 0 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
  //小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //倒计时函数
  countDown() {
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取时、分、秒
        let hou = Math.floor(time / 60 / 60);
        let min = Math.floor(time / 60 % 60);
        let sec = Math.floor(time % 60);
        obj = {
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    this.setData({objTime: countDownArr})
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  },

  // 千分位分割 - 整、小数混合
  miliFormat(num) {  
    return num && num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  },

  show: function (e) {
    this.setData({
      isAuction: e.currentTarget.dataset.index
    })
    this.getData()
  },
})