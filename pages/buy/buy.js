// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table_list: 0,  // table栏切换， 0 是热度， 1 是最新
  },

  // table栏切换
  handleTable(e) {
    this.setData({table_list: e.currentTarget.dataset.index})
  },

  // 点击进入求购信息页
  handleList(e) {
    wx.navigateTo({
      url: '/pages/buy_info/buy_info'
    })
  }

})