const app = getApp();
Page({
  data: {
    tabar: '1',  // tabar切换， 1 是售卖， 2 是求购， 0 是拍卖
    releaseList: [], // 发布商品的数据
    actEndTimeList: [], // 商品结束毫秒集合
    actStartTimeList: [], // 商品开始毫秒集合
    normEndTimeList: [], // 商品标准结束时间集合
    normStartTimeList: [], // 商品标准开始时间集合
    paddingValue: '0rpx',

    buyInfo: [], // 求购信息数据
    pagenum: 1,  // 当前页面
    isLoading: false,   // 判断是否正在加载
    hasMore: false,  // 是否到了最后一页
    buyLength: 0,  // 搜索求购结果条数  
  },

  onShow() {
    this.getreleaseList()
  },

  // 获取发布商品的数据
  getreleaseList() {
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
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
            console.log(res)
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

            wx.hideLoading()
          }
        })
      }
    })
  },

  // 获取求购信息数据
  getBuyInfo() {
    //如果开关时正在加载状态，直接返回
    if (this.data.isLoading || this.data.hasMore) return ;
    // 否则打开开关
    this.data.isLoading = true;

    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl + 'product/jglQiugou/selectByQiuGou',
          data: {
            "currentPage": this.data.pagenum,
            "pageSize": 10,
            "query": {
              "openid": getApp().globalData.openid,
              "status": 1
            }
          },
          method: 'POST',
          success: (res)=> {
            console.log(res)
            const {result, total} = res.data.data
            this.setData({
              buyInfo: [...this.data.buyInfo, ...result],
              buyLength: total
            })

             // 页数加一，解决了不会同时存在多个请求，避免服务器的奔溃
             this.data.pagenum ++;
             // 关灯 表示加载完毕
             this.data.isLoading = false;

             // 是否加载完毕
            if(this.data.buyInfo.length >= total){
              // 已经到了最后一页
              this.setData({hasMore: true});
            }

            wx.hideLoading()
          }
        })
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
    if (e.currentTarget.dataset.index == '1') {
      this.setData({
        tabar: e.currentTarget.dataset.index,
        paddingValue: 'none'
      })
      this.getreleaseList()
    } else if (e.currentTarget.dataset.index == '2'){
      this.setData({
        tabar: e.currentTarget.dataset.index,
        paddingValue: 'none',
        pagenum: 1,
        hasMore: false,
        buyInfo: []
      })
      this.getBuyInfo()
    } else {
      wx.showToast({
        title: '该功能暂未开放',
        icon: 'none',
        duration: 2000
      })
      // this.setData ({paddingValue: '74rpx'})
    }
  },

  // 下架
  handleSoldOut(e) {
    const {productid} = e.currentTarget.dataset
    wx.showModal({
      title: '确定要下架商品吗',
      showCancel: true,
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
              // console.log(res)
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
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/-/g, '/').replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },

  // 跳转商品详情页
  handleNavigateTo(e) {
    const {openid, productid, auctionorsale} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/auctionDetails/auctionDetails?auctionOrSale=' + auctionorsale + '&productId=' + productid + '&openid=' + openid,
    })
  },

  // 删除
  handleBuyRemove(e) {
    const {qiugouid} = e.currentTarget.dataset
    console.log(qiugouid)
    wx.showModal({
      title: '确定要删除求购吗',
      showCancel: true,
      success: (res)=> {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.baseUrl + 'product/jglQiugou/upandDown',
            data: {
              'qiugouid': qiugouid
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' //query
            },
            success: (res)=> {
              // console.log(res)
              if (res.data.flag) {
                this.setData({
                  pagenum: 1,
                  hasMore: false,
                  buyInfo: []
                })
                this.getBuyInfo()
              }
            }
          })
        }
      }
    })
  },

  // 跳转求购详情页
  handleToBuy(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/buy_info/buy_info?id=' + id
    })
  },

  // 触底事件
  handleBottom() {
    if (this.data.tabar == '2') {
      this.getBuyInfo()
    }
  },
})