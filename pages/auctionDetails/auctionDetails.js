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
    isTable: 1,
    // 商品类型： 0 拍卖商品 ， 1 售卖商品
    auctionOrSale: '',
    // 商品id
    productId: '',
    // 商品分类id - 推荐商品用
    category: '',
    // 商品发布人的openid
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
    // 保留价提示切换
    hint: false,
    // 正在拍卖或即将开始 1 - 正在拍卖 2 - 即将开拍 
    buy: '',
    // 导航栏标题
    title: '',
    // 倒计时提示结束的弹窗
    showDialog: false,
    // 报名是否结束
    auctionEnd: false,
    // 中标人昵称
    nickname: '',
    // 是否报名
    isApply: false,
    // 店主电话
    phone: '',
    // 是否收藏
    collect: '2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.buy) {
      this.setData({
        buy: options.buy
      })
    }
    const {
      auctionOrSale,
      productId,
      openid
    } = options
    // 动态修改页面导航栏标题
    if (auctionOrSale == 0) {
      this.setData({
        title: '拍卖详情'
      })
      this.countDown()
    } else {
      this.setData({
        title: '售卖详情'
      })
    }
    // wx.setNavigationBarTitle({ title: auctionOrSale == 0? '拍卖详情': '售卖详情' })
    // options.name表示上个页面传过来的文字
    this.setData({
      auctionOrSale: auctionOrSale,
      productId: productId,
      openid: openid
    })
  },

  onShow() {
    wx.showLoading({
      title: '加载中',
      success: (res) => {
        // 发送数据请求
        this.getData()
        // 发送出价记录请求
        this.getListId()
        // 发送店主数据请求
        this.getUser()
        // 是否报名
        this.isApply()
        // 是否报名
        this.isCollect()
        wx.hideLoading()
      }
    })
  },

  // 请求商品数据
  getData() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglProduct/selectProductDetail',
      data: {
        "auctionOrSale": this.data.auctionOrSale,
        "productId": this.data.productId,
        "openid": getApp().globalData.openid
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const {
          data
        } = res.data

        // 另存商品轮播图数据 - 做全屏预览
        let arr = data.detailPictureVOS
        let swiperImg = arr.map(v => {
          return v.url
        })
        // 修改及保存商品开拍时间和结束时间
        let TimeList = [data.startTime, data.endTime];
        let TimeList2 = TimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x).slice(0, 16)
        })

        this.setData({
          list: data,
          category: data.category,
          timeList: TimeList2,
          swiperImg: swiperImg,
        })
        // 推荐商品数据
        wx.request({
          url: getApp().globalData.baseUrl + 'product/jglProduct/selectDetailRecommendProduct',
          data: {
            category: this.data.category
          },
          method: "get",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: (res) => {
            console.log(res)
            const {
              data
            } = res.data
            this.setData({
              rectangleGood: data
            })
          }
        })

        // 判断拍卖页当前价是否为最高价，有就是最高价，没有就是起拍价
        if (this.data.auctionOrSale == 0) {
          // 请求最高价
          wx.request({
            url: getApp().globalData.baseUrl + 'bep/jglBid/selectMaxById',
            method: 'POST',
            data: {
              productId: this.data.productId
            },
            success: (o) => {
              // console.log(o)
              if (o.data.flag) {
                const {
                  price
                } = o.data.data
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
          this.setData({
            money: this.miliFormat(data.salePrice)
          })
        }
      }
    })
  },

  // 出价记录数据请求
  getListId() {
    wx.request({
      url: getApp().globalData.baseUrl + 'bep/jglBid/selectListById',
      data: {
        "currentPage": 1,
        "pageSize": 5,
        "query": this.data.productId
      },
      method: 'POST',
      success: (res) => {
        // console.log(res)
        const {
          rows,
          total
        } = res.data.data
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
          return this.renderTime(x).slice(5, 10)
        })
        // 修改时间数据
        let TimeList3 = TimeList.map(x => {
          return this.renderTime(x).slice(11, 19)
        })
        // 将每组修改的日期及时间数据放到对应的 bidRecord 记录数据中，做渲染用
        let arr = this.data.bidRecord
        arr.forEach((item, index) => {
          let objDay = "bidRecord[" + index + "].objDay"
          let objTime = "bidRecord[" + index + "].objTime"
          this.setData({
            [objDay]: TimeList2[index],
            [objTime]: TimeList3[index]
          })
        })
      }
    })
  },

  // 店主信息数据请求
  getUser() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglProduct/selectProductUser',
      data: {
        "auctionOrSale": this.data.isTable,
        "openid": this.data.openid,
        "productId": this.data.productId
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        const {
          data
        } = res.data
        this.setData({
          userInfo: data,
          status: data.status,
          phone: data.phone
        })
      }
    })
  },

  // 推荐商品数据
  // getRectangleGood() {
  //   console.log(this.data.category)
  // },

  // 商品轮播图全屏显示
  handleFullScreen(e) {
    // console.log(e)
    // 在新页面中全屏预览图片
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: this.data.swiperImg // 需要预览的图片http链接列表
    })
  },

  // 是否收藏
  isCollect() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglCollection/selectIsCollection',
      data: {
        openid: getApp().globalData.openid,
        productId: this.data.productId
      },
      method: 'POST',
      success: (res)=> {
        console.log(res)
        if (res.data.flag) {
          this.setData({collect: res.data.data})
        }
      }
    })
  },

  // 保留价提示切换
  handleHint() {
    this.setData({
      hint: !this.data.hint
    })
  },

  // 千分位分割 - 整、小数混合
  miliFormat(num) {
    return num && num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/-/g, '/').replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },

  // 切换拍卖宝贝和售卖宝贝栏
  handleClick(e) {
    this.setData({
      isTable: e.currentTarget.dataset.index
    })
    this.getUser()
  },

  // 参与出价
  handleBid() {
    if (this.data.isApply) {
      wx.navigateTo({
        url: '/pages/auctionBid/auctionBid?productId=' + this.data.productId + '&money=' + this.data.commonMoney + '&addPrice=' + this.data.list.addPrice + '&image=' + this.data.swiperImg + '&list=' + this.data.list.title + '&auctionOrSale=' + this.data.auctionOrSale + '&openid=' + this.data.openid,
      })
    } else {
      wx.showToast({
        title: '您还没有报名',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 是否报名
  isApply() {
    wx.request({
      url: getApp().globalData.baseUrl + 'bep/jglEnroll/selectByOpenidAndProductId',
      data: {
        "openid": wx.getStorageSync('openid'),
        "productid": this.data.productId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res.data.flag) {
          this.setData({
            isApply: true
          })
        }
      }
    })
  },

  // 报名
  handleApply() {
    if (this.data.openid == getApp().globalData.openid) {
      wx.showToast({
        title: '发布人不能报名',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.auctionEnd == true) {
      wx.showToast({
        title: '竞拍已结束',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: getApp().globalData.baseUrl + 'bep/jglEnroll/addEnroll',
        data: {
          "openid": wx.getStorageSync('openid'),
          "productId": this.data.productId,
        },
        method: 'POST',
        success: (res) => {
          console.log(res)
          this.setData({
            applyState: res.data
          })
          console.log(res.data);
          if (res.data.flag) {
            wx.navigateTo({
              url: '/pages/earnestMoney/earnestMoney?money=' + this.data.list.earnestMoney + '&productId=' + this.data.productId + '&idno=' + res.data.data.id + '&flag=' + res.data.flag + '&openid=' + this.data.openid
            })
          } else {
            wx.navigateTo({
              url: '/pages/earnestMoney/earnestMoney?flag=' + res.data.flag + '&money=' + this.data.list.earnestMoney
            })
          }
        }
      })
    }

  },

  // 计算剩余拍卖时间，做倒计时提示
  countDown() {
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = new Date(this.data.timeList[1]).getTime()

    if (endTimeList - newTime <= 0) {
      wx.request({
        url: getApp().globalData.baseUrl + 'bep/jglBid/updateByStatus',
        method: 'POST',
        data: {
          productId: this.data.productId
        },
        success: (res) => {
          if (res.data.flag) {
            wx.request({
              url: 'https://jgl.hemajia.net/jgl/bep/jglBid/selectByProductId',
              method: 'POST',
              data: {
                productId: this.data.productId
              },
              success: (res) => {
                console.log(res)
                const {
                  nickname
                } = res.data.data
                this.setData({
                  nickname: nickname
                })
              }
            })
          }
        }
      })
      this.setData({
        showDialog: true,
        auctionEnd: true
      })
      return
    }
    setTimeout(this.countDown, 1000);
  },
  // 点击弹窗栏外部
  toggleDialog() {
    this.setData({
      showDialog: false
    });
  },

  // 拨打宝主电话
  headlePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: (res)=> {
        console.log("成功拨打电话")
      },
    })
  },

  // 收藏按钮
  headleCollect(e) {
    const {index} = e.currentTarget.dataset    
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglCollection/clickCollect',
      data: {
        "openid": wx.getStorageSync('openid'),
        "productId": this.data.productId
      },
      method: 'POST',
      success: (res)=>{
        console.log(res)
        if (index == 2 && res.data.message == '收藏成功') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          this.setData({collect: '1'})
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          this.setData({collect: '2'})
        }
      }
    })
  }
})