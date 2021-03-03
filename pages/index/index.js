const app = getApp();
Page({
  data: {
    // 轮播图数据
    slideShowList: [],
    // 拍卖商品数据
    auctionDataList: [],
    // 拍卖价格商品价格 - 千位分割
    auctionPrice: [],
    // 售卖商品数据
    sellDataList: [],
    // 售卖价格商品价格 - 千位分割
    sellPrice: [],
    isAuction: 1, // 拍卖列表与售卖列表切换，0 - 拍卖列表 ，1 - 售卖列表
    isBuy: 1, // 拍卖列表立即购买与即将开拍切换，1 - 立即购买 ，2 - 即将开拍
    active: 0, // 拍卖列表控制导航栏商品类别
    activeId: '', // 渲染的商品类别 4为全部分类
    // 倒计时 - 各商品结束时间
    actEndTimeList: [],
    sellActive: 0, // 售卖列表控制导航栏商品类别
    tableHeat: 0, // 售卖列表热度升降序 ， 1 - 升序 ， 2 - 降序
    tableHeatOpen: false, // 售卖列表热度开关
    leftMin: 0, //价格的进度条
    leftMax: 12000, //价格的进度条
    rightMin: 0, //价格的进度条
    rightMax: 12000, //价格的进度条
    leftValue: 0, //左侧价格的进度条默认取值
    rightValue: 12000, //右侧价格的进度条默认取值
    priceSection: [], // 售卖列表价格区间
    select: false, //类型下拉隐藏
    jiageselect: false, //价格下拉隐藏
    jiage: '价格排序  ',
    chanpin: '产品类型  ',
    indicatorDots: true, //轮播图的点
    btns: [], // 商品分类
    cons: ["dataList", "RP", "AE", "C4D"],
    // 拍卖商品条数
    auctionTotal: 0,
    // 售卖商品条数
    sellTotal: 0,
    // 收藏状态
    collectState: [],

    change: false, // 当两个slider在最右端重合时，将change设置为true，从而隐藏slider2，才能继续操作slider1
    change2: false, // 当两个slider在最左端重合时，将change2设置为true，从而隐藏slider1，才能继续操作slider2
    max: 6, // 两个slider所能达到的最大值
    min: 0, // 两个slider所能取的最小值
    rate: 6 / 100, // slider的最大最小值之差和100（或1000）之间的比率 即最大值-最小值/100
    slider1Max: 6, // slider1的最大取值
    slider1Value: 0, // slider1的值
    slider2Value: 6, // slider2的值
    slider2Min: 0, // slider2的最小取值
    slider1W: 0, // slider1的宽度
    slider2W: 100, // slider2的宽度
    showContent1: 0, //左边滑块离左边的距离
    showContent2: 100 / 6, //右边滑块离左边的距离
    zIndexFlag: 1, //控制层叠
  },

  onShow: function () {
    if(wx.getStorageSync('openid')){
      getApp().globalData.openid = wx.getStorageSync('openid')
    }
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        this.getSlideShow();
        this.getAuctionCategory();
        this.getAuctionList();
        this.getSellList();
        this.countDown();
        wx.hideLoading()
      }
    })
  },

  // 请求首页拍卖列表数据
  getAuctionList() {
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl + 'product/jglAuction/selectHomeAuction',
          data: {
            "query": {
              "auctionTime": this.data.isBuy,
              "category": this.data.activeId == '4'? '': this.data.activeId,
            }
          },
          method: 'POST',
          success: (res) => {
            console.log(res)
            const {
              rows,
              total
            } = res.data.data
    
            let endTimeList = [];
            let priceList = [];
            // 将活动的结束时间参数提成一个单独的数组，方便操作
            rows.forEach(o => {
              endTimeList.push(o.endTime)
              if (o.maxPrice) {
                priceList.push(o.maxPrice)
              } else {
                priceList.push(o.startPrice)
              }
            })
            let endTimeList2 = endTimeList.map(x => {
              // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
              return this.renderTime(x)
            })
            let priceList2 = priceList.map(x => {
              return this.miliFormat(x)
            })
    
            this.setData({
              auctionDataList: rows,
              auctionTotal: total,
              actEndTimeList: endTimeList2,
              auctionPrice: priceList2
            })
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 请求首页售卖列表数据
  getSellList() {
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl + 'product/jglSell/selectHomeSell',
          data: {
            "query": {
              "category": this.data.sellActive ? this.data.sellActive : '',
              "heat": this.data.tableHeat ? this.data.tableHeat : '',
              "startPrice": this.data.priceSection[0],
              "endPrice": this.data.priceSection[1] === undefined ? '' : this.data.priceSection[1],
              "openid": wx.getStorageSync('openid')
            }
          },
          method: 'POST',
          success: (res) => {
            const {
              rows,
              total
            } = res.data.data
    
            let priceList = [];
            rows.forEach(o => {
              priceList.push(o.salePrice)
            })
            let priceList2 = priceList.map(x => {
              return this.miliFormat(x)
            })
    
            this.setData({
              sellDataList: rows,
              sellTotal: total,
              sellPrice: priceList2
            })
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 请求首页轮播图
  getSlideShow() {
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl + 'order/jglOtationChart/selectOtationChart',
          method: 'POST',
          success: (res) => {
            const {
              data
            } = res.data
            this.setData({
              slideShowList: data
            })
            wx.hideLoading()
          }
        })
      }
    })
  },

  // 请求拍卖商品的分类
  getAuctionCategory() {
    wx.request({
      url: getApp().globalData.baseUrl + 'product/jglClassify/selectClassify',
      method: 'GET',
      success: (res)=> {
        console.log(res)
        const {data, flag} = res.data
        if (flag) {
          this.setData({btns: data})
        }
      }
    })
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    console.log(dateee)
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/-/g, '/').replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
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
    // 将 countDownArr 中的每个元素（obj）放到对应的 auctionDataList 对象中，做为新的键值对在页面中渲染
    let arr = this.data.auctionDataList
    arr.forEach((item, index) => {
      let objTime = "auctionDataList[" + index + "].objTime"
      this.setData({
        [objTime]: countDownArr[index]
      })
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  },

  // 首页点击
  handleHide() {
    this.setData({
      select: false,
      jiageselect: false
    })
  },

  // 切换拍卖售卖列表
  handlePailistType(e) {
    if (e.currentTarget.dataset.index == 1) {
      this.setData({
        isAuction: e.currentTarget.dataset.index
      })
    } else {
      wx.showToast({
        title: '该功能暂未开放',
        icon: 'none',
        duration: 2000
      })
    }
  },

  handleGouType(e) {
    this.setData({
      isBuy: e.currentTarget.dataset.index
    })
    // 请求拍卖列表立即抢购或即将开拍数据
    this.getAuctionList()
  },

  // 点击热度
  bindHot() {
    this.setData({
      tableHeatOpen: !this.data.tableHeatOpen
    })
    if (this.data.tableHeatOpen) {
      this.setData({
        tableHeat: 1
      })
    } else {
      this.setData({
        tableHeat: 2
      })
    }
    // 请求售卖列表热度变更数据
    this.getSellList()
  },

  // 点击价格区间
  bindjiage() {
    this.setData({
      jiageselect: !this.data.jiageselect,
      select: false
    })
  },

  // 点击价格区间按钮
  jiageselect(e) {
    const {
      name,
      price
    } = e.currentTarget.dataset
    let priceArr = price.split("-")
    this.setData({
      jiage: name,
      priceSection: priceArr,
      jiageselect: false,
    })
    // 请求售卖列表价格区间按钮变更数据
    this.getSellList()
  },

  // 开始滑动
  changeStart: function (e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    // console.log(idx)
    if (this.data.slider1Value !== this.data.slider2Value) {
      this.setData({
        change: false,
        change2: false
      })
    }
    if (idx === 1) {
      // dW是当前操作的slider所能占据的最大宽度百分数
      var dW = (this.data.slider2Value - this.data.min) / this.data.rate;
      this.setData({
        slider1W: dW,
        slider2W: 100 - dW,
        slider1Max: this.data.slider2Value,
        slider2Min: this.data.slider2Value,
        zIndexFlag: 1,
        change: false
      })
    } else if (idx === 2) {
      var dw = (this.data.max - this.data.slider1Value) / this.data.rate;
      this.setData({
        slider2W: dw,
        slider1W: 100 - dw,
        slider1Max: this.data.slider1Value,
        slider2Min: this.data.slider1Value,
        zIndexFlag: 2,
        change2: false
      })
    }
  },
  // 正在滑动
  changing: function (e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    var value = e.detail.value
    if (idx === 1) {
      this.setData({
        slider1Value: value,
        showContent1: 100 - ((this.data.max - this.data.slider1Value) / this.data.rate)
      })
    } else if (idx === 2) {
      this.setData({
        slider2Value: value,
        showContent2: 100 - ((this.data.max - this.data.slider2Value) / this.data.rate)
      })
    }
  },
  // 完成拖动
  changed: function (e) {
    let idx = parseInt(e.currentTarget.dataset.idx)
    if (idx === 1) {
      this.setData({
        showContent1: 100 - ((this.data.max - this.data.slider1Value) / this.data.rate)
      })
    } else if (idx === 2) {
      this.setData({
        showContent2: 100 - ((this.data.max - this.data.slider2Value) / this.data.rate)
      })
    }
    if (this.data.slider1Value === this.data.slider2Value && this.data.slider2Value === this.data.max) {
      this.setData({
        change: true
      })
    }
    if (this.data.slider1Value === this.data.slider2Value && this.data.slider2Value === this.data.min) {
      this.setData({
        change2: true
      })
    }
  },

  // 点击价格滑块确认按钮
  handlePriceBtn() {
    let priceArr = [this.data.slider1Value * 2000, this.data.slider2Value * 2000]
    this.setData({
      priceSection: priceArr,
      jiageselect: false,
      jiage: this.data.slider1Value * 2000 + '-' + this.data.slider2Value * 2000
    })
    // 请求售卖列表价格区间确定按钮变更数据
    this.getSellList()
  },

  // 产品类型点击
  bindshow() {
    this.setData({
      select: !this.data.select,
      jiageselect: false
    })
  },

  // 点击产品类型下拉中的类型
  myselect(e) {
    const {
      name,
      index
    } = e.currentTarget.dataset
    this.setData({
      chanpin: name,
      sellActive: index,
      select: false,
    })
    // 请求售卖列表中类别变更数据
    this.getSellList()
  },

  // 千分位分割 - 整、小数混合
  miliFormat(num) {  
    return num && num.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  },

  // 收藏按钮
  handleCollect(e) {
    const {index, productid} = e.currentTarget.dataset
    // 判断是否登录
    if (getApp().globalData.openid) {
      wx.request({
        url: getApp().globalData.baseUrl + 'product/jglCollection/clickCollect',
        data: {
          "openid": wx.getStorageSync('openid'),
          "productId": productid
        },
        method: 'POST',
        success: (res)=>{
          console.log(res)
          if (res.data.message == '收藏成功') {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
            let collectState = "sellDataList[" + index + "].isCollect"
            this.setData({[collectState]: 1})
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
            let collectState = "sellDataList[" + index + "].isCollect"
            this.setData({[collectState]: 2})
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login_phone/login_phone'
      })
    }
  },

  clickSeach() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  toggle: function (e) {
    this.setData({
      //设置active的值为用户点击按钮的索引值
      active: e.currentTarget.dataset.index,
      activeId: e.currentTarget.dataset.id
    })
    // 请求拍卖列表中类别变更数据
    this.getAuctionList()
  },

  // 拍卖商品跳转
  handleToAuctionDetails(e) {
    const {openid, productid ,index} = e.currentTarget.dataset
    let objTime = this.data.auctionDataList[index].objTime
    if (getApp().globalData.openid) {
      if (objTime.hou == "00" && objTime.min == "00" && objTime.sec == "00") {
        wx.showToast({
          title: '拍卖已结束',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '/pages/auctionDetails/auctionDetails?auctionOrSale=0&productId=' + productid + '&openid=' + openid + '&buy=' + this.data.isBuy
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login_phone/login_phone'
      })
    }
  },

  // 售卖商品跳转
  handleToSellDetails(e) {
    const {openid, productid} = e.currentTarget.dataset
    console.log(openid, productid)
    if (getApp().globalData.openid) {
      wx.navigateTo({
        url: "/pages/auctionDetails/auctionDetails?auctionOrSale=1&productId=" + productid + "&openid=" + openid
      })
    } else {
      wx.showToast({
        title: '请授权登录！',
        icon: 'none',
        duration: 1500,
        success: ()=> {
     //定时器，未授权1.5秒后跳转授权页面
        setTimeout(()=> {
          wx.navigateTo({
            url: '/pages/login_phone/login_phone'
          })
         }, 1500);
        }
      })
    }
  }
 })
