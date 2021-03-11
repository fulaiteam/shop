// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table_list: 1,  // table栏切换， 1 是热度， 2 是最新
    contentList: [],  // 求购列表数据
    ifLike: false,  // 是否点赞
  },

  onShow() {
    this.acquireBuyList()
  },

  // 获取求购列表
  acquireBuyList() {
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl+ 'product/jglQiugou/selectByReDu', 
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: {
            status: this.data.table_list,
            openid: getApp().globalData.openid
          },
          success: (res)=>{
            console.log(res)
            this.setData({
              contentList: res.data.data
            })

            // 添加分割后的时间数据
            let arr = res.data.data
            arr.forEach((item, index) => {
              let objTime = "contentList[" + index + "].objTime"
              this.setData({
                [objTime]: item.create_time.substring(0,10)
              })
            })

            wx.hideLoading()
          }
        })
      }
    })
  },

  // table栏切换
  handleTable(e) {
    this.setData({table_list: e.currentTarget.dataset.index})
    this.acquireBuyList()
  },

  // 点赞
  handleLike(e) {
    const qiugouid = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    console.log(qiugouid, index, e)
    wx.request({
      url: getApp().globalData.baseUrl+ 'product/jglQiugou/dianzan',
      method: 'POST',
      data: {
        qiugouid: qiugouid,
        openid: getApp().globalData.openid,
      },
      success: (res)=> {
        console.log(res)
        let dianzanState = "contentList[" + index + "].isdianzan"
        let dianzanNum = "contentList[" + index + "].dianzan"
        if (res.data.message == '收藏成功') {
          wx.showToast({
            title: '添加喜好成功',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            [dianzanState]: true,
            [dianzanNum]: Number(this.data.contentList[index].dianzan) + 1,
          })
        } else {
          wx.showToast({
            title: '取消喜好成功',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            [dianzanState]: false,
            [dianzanNum]: Number(this.data.contentList[index].dianzan) - 1,
          })
        }
      }
    })
  },

  // 点击进入求购信息页
  handleList(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/buy_info/buy_info?id=' + id
    })
  }

})