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
    isAuction: 1, // 拍卖列表与售卖列表切换，0 - 拍卖列表 ，1 - 售卖列表
    isBuy: 0, // 立即购买与即将开拍切换，0 - 立即购买 ，1 - 即将开拍
    isTable: 1, // 导航栏第几个被点击 
    form_num: '', // 商品类型中当前选择的第几个类型
    dataList: [{
        goods_name: '全部',
        isActive: true,
        goods_id: 1,
        goods_title: 'AGV k1摩特车头盔',
        goods_text: '男女四季全盔街车跑车冬季',
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '限量抢购',
        goods_price: '60', //打折后
        goods_original_price: '100', //原价
        img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
      },
      {
        goods_name: '全部',
        isActive: false,

        goods_id: 1,
        goods_title: 'AGV k1摩特车头盔',
        goods_text: '男女四季全盔街车跑车冬季',

        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '限量抢购',
        goods_price: '70',
        goods_original_price: '100', //原价
        img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
      }, {
        goods_name: '全部',
        isActive: false,

        goods_id: 1,
        goods_title: 'AGV k1摩特车头盔',
        goods_text: '男女四季全盔街车跑车冬季',
        goods_original_price: '100', //原价

        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '限量抢购',
        goods_price: '80',
        img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
      }, {
        goods_name: '全部',
        isActive: false,

        goods_id: 1,
        goods_title: 'AGV k1摩特车头盔',
        goods_text: '男女四季全盔街车跑车冬季',
        goods_original_price: '100' //原价
          ,
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '限量抢购',
        goods_price: '90',
        img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
      }, {
        goods_name: '全部',
        isActive: false,

        goods_id: 1,
        goods_title: 'AGV k1摩特车头盔',
        goods_text: '男女四季全盔街车跑车冬季',
        goods_original_price: '100' //原价
          ,
        goods_img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        goods_xiaoliang: '限量抢购',
        goods_price: '110',
        img:'https://jgl.oss-cn-beijing.aliyuncs.com/sale/ysc.png',
      }
    ],
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