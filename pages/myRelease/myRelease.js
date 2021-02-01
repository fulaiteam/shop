const app = getApp();
Page({
  data: {
    tabar: '0',
    releaseList: [], // 发布商品的数据
    actEndTimeList: [], // 商品结束毫秒集合
    actStartTimeList: [], // 商品开始毫秒集合
    normEndTimeList: [], // 商品标准结束时间集合
    normStartTimeList: [], // 商品标准开始时间集合
    paddingValue: '74rpx'
  },

  onLoad() {
    this.getreleaseList()
    
  },
  // 获取发布商品的数据
  getreleaseList() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglProduct/selectReleaseProduct',
      data: {
        openid: wx.getStorageSync('openid'),
        auctionOrSale: this.data.tabar
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' //query
      },
      success: (res) => {
        const {
          productVOS
        } = res.data.data

        let endTimeList = [];
        let startTimeList = [];
        // 将活动的结束时间参数提成一个单独的数组，方便操作
        productVOS.forEach(o => {
          endTimeList.push(o.endTime)
          startTimeList.push(o.startTime)
        })
        let endTimeList2 = endTimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return new Date(this.renderTime(x)).getTime()
        })
        let endTimeList3 = endTimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x)
        })
        let startTimeList2 = startTimeList.map(x => {
          return new Date(this.renderTime(x)).getTime()
        })
        let startTimeList3 = endTimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x)
        })

        this.setData({
          releaseList: productVOS,
          actEndTimeList: endTimeList2,
          actStartTimeList: startTimeList2,
          normEndTimeList: endTimeList3,
          normStartTimeList: startTimeList3
        })
        this.aucitonSituation()
      }
    })
  },

  // 判断拍卖情况
  aucitonSituation() {
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    let startTimeList = this.data.actStartTimeList;


    startTimeList.forEach((item, index) => {
      let selected = "releaseList[" + index + "].selected"
      if (newTime < item) {
        this.setData({
          [selected]: '2'
        })
      } else if (newTime >= item && newTime <= endTimeList[index]) {
        this.setData({
          [selected]: '1'
        })
      } else if (newTime > endTimeList[index]) {
        this.setData({
          [selected]: '3'
        })
      }
    })
  },

  // 拍卖售卖切换
  handleTabar(e) {
    this.setData({
      tabar: e.currentTarget.dataset.index
    })
    if (this.data.tabar == '0') {
      this.setData ({paddingValue: '74rpx'})
    } else if (this.data.tabar == '1') {
      this.setData ({paddingValue: 'none'})
    }
    this.getreleaseList()
  },

  // 下架
  handleSoldOut(e) {
    const {productid} = e.currentTarget.dataset
    wx.showModal({
      title: '确定要下架商品吗',
      showCancel: 'true',
      success: (res)=> {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + 'product/jglProduct/upProductByProductId',
            data: {
              productId: productid,
              status: '2'
            },
            method: 'GET',
            header: {
              'content-type': 'application/json' //query
            },
            success: (res)=> {
              if (res.data.flag) {
                this.getreleaseList()
              }
            }
          })
        }
      }
    })
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
})