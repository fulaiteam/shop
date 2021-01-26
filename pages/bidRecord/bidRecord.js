// pages/bidRecord/bidRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 出价记录
    bidRecord: [],
    // 出价记录总条数
    byTotal: 0,
    // 商品id
    productId: '',
    // 当前页面
    pagenum: 1,
    // 判断是否正在加载
    isLoading: false,
    // 是否到了最后一页
    hasMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {productId} = options
    this.setData({
      productId: productId
    })
    this.getListId()
  },

  // 出价记录数据请求
  getListId() {

    //如果开关时正在加载状态，直接返回
    if (this.data.isLoading || this.data.hasMore) return ;
    // 否则打开开关
    this.data.isLoading = true;

    wx.request({
      url: getApp().globalData.baseUrl + 'bep/jglBid/selectListById',
      data: {
        "currentPage": this.data.pagenum,
        "pageSize": 10,
        "query": this.data.productId
      },
      method: 'POST',
      success: (res)=> {
        console.log(res)
        const {rows, total} = res.data.data
        this.setData({
          bidRecord: [...this.data.bidRecord, ...rows],
          byTotal: total,
        })
        // 页数加一，解决了不会同时存在多个请求，避免服务器的奔溃
        this.data.pagenum ++;
        // 关灯 表示加载完毕
        this.data.isLoading = false;
        
        // 是否加载完毕
        if(this.data.bidRecord.length >= total){
          // 已经到了最后一页
          this.setData({hasMore: true});
        }

        // 执行修改和添加出价时间的事件
        // 创建新数组，获得所有出价记录的时间
        let TimeList = [];
        this.data.bidRecord.forEach(o => {
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
            // .replace 字符串替换字符
            [objDay]: TimeList2[index].replace(/-/, "."),
            [objTime]: TimeList3[index]
          })
        })

      }
    })
  },

  // 触底事件
  handleBottom() {
    this.getListId()
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
})