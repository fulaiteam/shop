const app = getApp();
Page({
  data: {
    leftMin: 0, //价格的进度条
    leftMax: 6, //价格的进度条
    rightMin: 0, //价格的进度条
    rightMax: 6, //价格的进度条
    leftValue: 0, //价格的进度条
    rightValue: 6, //价格的进度条
    tableHot: false, // 热度是否被点击
    select: false, //类型下拉隐藏
    jiageselect: false, //价格下拉隐藏
    jiage: '价格排序  ',
    chanpin: '产品类型  ',

    indicatorDots: true, //轮播图的点
    btns: ["全部", "机车", "头盔", "配件", "改装保养"],
    cons: ["dataList", "RP", "AE", "C4D"],
    active: 0, // 控制商品类别
    isAuction: 0, // 拍卖列表与售卖列表切换，0 - 拍卖列表 ，1 - 售卖列表
    isBuy: 0, // 立即购买与即将开拍切换，0 - 立即购买 ，1 - 即将开拍
    isTable: 1, // 导航栏第几个被点击 
    form_num: '', // 商品类型中当前选择的第几个类型
    // dataList: [{
    //     goods_name: '全部',
    //     isActive: true,
    //     goods_id: 1,
    //     goods_title: 'AGV k1摩特车头盔',
    //     goods_text: '男女四季全盔街车跑车冬季',
    //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //     goods_xiaoliang: '限量抢购',
    //     goods_price: '60', //打折后
    //     goods_original_price: '100', //原价
    //     img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
    //   },
    //   {
    //     goods_name: '全部',
    //     isActive: false,

    //     goods_id: 1,
    //     goods_title: 'AGV k1摩特车头盔',
    //     goods_text: '男女四季全盔街车跑车冬季',

    //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //     goods_xiaoliang: '限量抢购',
    //     goods_price: '70',
    //     goods_original_price: '100', //原价
    //     img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
    //   }, {
    //     goods_name: '全部',
    //     isActive: false,

    //     goods_id: 1,
    //     goods_title: 'AGV k1摩特车头盔',
    //     goods_text: '男女四季全盔街车跑车冬季',
    //     goods_original_price: '100', //原价

    //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //     goods_xiaoliang: '限量抢购',
    //     goods_price: '80',
    //     img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
    //   }, {
    //     goods_name: '全部',
    //     isActive: false,

    //     goods_id: 1,
    //     goods_title: 'AGV k1摩特车头盔',
    //     goods_text: '男女四季全盔街车跑车冬季',
    //     goods_original_price: '100' //原价
    //       ,
    //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //     goods_xiaoliang: '限量抢购',
    //     goods_price: '90',
    //     img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
    //   }, {
    //     goods_name: '全部',
    //     isActive: false,

    //     goods_id: 1,
    //     goods_title: 'AGV k1摩特车头盔',
    //     goods_text: '男女四季全盔街车跑车冬季',
    //     goods_original_price: '100' //原价
    //       ,
    //     goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //     goods_xiaoliang: '限量抢购',
    //     goods_price: '110',
    //     img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
    //   }
    // ],
    // 商品数据
    dataList: [],
    // 商品条数
    total: 0,
    // 倒计时 - 各商品结束时间
    actEndTimeList: []
  },

  onLoad() {
    this.getList()
    // this.startTimer()
    // 执行倒计时函数
    this.countDown();
  },

  // 请求首页数据
  getList() {
    wx.request({
      url: 'http://192.168.3.70:10010/jgl/product/jglAuction/selectHomeAuction',
      data: {
        "query": {
          "auctionTime": "1"
        }
      },
      method: 'POST',
      success: (res) =>{
        console.log(res)
        const {rows, total} = res.data.data

        let endTimeList = [];
        // 将活动的结束时间参数提成一个单独的数组，方便操作
        rows.forEach(o => {endTimeList.push(o.endTime)})
        let endTimeList2 = endTimeList.map(x => {
          // 将数据中的结束时间格式转化为 普通时间格式 - 便于后续倒计时把时间格式直接转化为 毫秒 
          return this.renderTime(x)
        })
        // console.log(endTimeList2)

        this.setData({
          dataList: rows,
          total: total,
          actEndTimeList: endTimeList2 
        })
        // console.log(this.data.startTime, this.data.endTime)
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
      // console.log(endTime)
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0){
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
      }else{//活动已结束，全部设置为'00'
        obj = {
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 将 countDownArr 中的每个元素（obj）放到对应的 dataList 对象中，做为新的键值对在页面中渲染
    let arr = this.data.dataList
    arr.forEach ((item, index) => {
      let objTime = "dataList[" + index + "].objTime"
      this.setData({
        [objTime]: countDownArr[index]
      })
    }) 
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown,1000);
  },


  handleHide() {
    this.setData({
      select: false,
      jiageselect: false
    })
  },

  handlePailistType(e) {
    this.setData({
      isAuction: e.currentTarget.dataset.index
    })
  },

  handleGouType(e) {
    this.setData({
      isBuy: e.currentTarget.dataset.index
    })
  },

  bindHot() {
      this.setData({
        tableHot: !this.data.tableHot
      })
  },
  bindjiage() {
    this.setData({
      jiageselect:!this.data.jiageselect,
      select: false
    })
  },
  jiageselect(e) {
    console.log(e.currentTarget.dataset.name);
    var name = e.currentTarget.dataset.name
    this.setData({
      jiage:name,
      jiageselect:false
    })
  },
  bindshow() {
    this.setData({
      select:!this.data.select,
      jiageselect: false
    })
  },
  
  myselect(e) {
    const {name, index} = e.currentTarget.dataset
    this.setData({
      chanpin:name,
      form_num:index,
      select:false,
    })
  },
  //获取输入框的内容
  getInputContent: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  toggle: function (e) {

    //console.log(e.currentTarget.dataset.index)

    this.setData({

      //设置active的值为用户点击按钮的索引值

      active: e.currentTarget.dataset.index,

    })

  },

})