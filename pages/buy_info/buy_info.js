// pages/buy_info/buy_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiugouid: '',  // id值
    buy_info: {},  // 求购详情数据
    commentValue: '',  // 评论文字
    replySwitch: false,  // 回复评论开关
    ifFocus: false,  // 回复评论获取焦点开关
    replyValue: '',  // 回复文字
    pinglunid_one: '',  // 主评论id
    buyTimeList: [],  // 评论时间集合
  },

  onLoad(options) {
    // console.log(options)
    this.setData({
      qiugouid: options.id
    })
  },

  onShow() {
    this.getBuyInfo()
  },

  // 获取求购详细信息
  getBuyInfo() {
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl+ 'product/jglQiugou/selectByIdDetail',
          method: 'POST',
          data: {
            qiugouid: this.data.qiugouid,
            openid: getApp().globalData.openid
          },
          success: (res)=> {
            console.log(res)
            if (res.data.flag) {
              let obj = res.data.data
              obj.parents.reverse()  // 翻转数组

              let obj2 = res.data.data.parents
              obj2.forEach(n => {
                n.lists.reverse()
              })

              let timeList = []
              obj.parents.forEach(o => {
                // console.log(o)
                timeList.push(o.jglQiugoumiaoshuDTO.createTime)
              })
              let timeList2 = timeList.map(x => {
                return this.renderTime(x).substring(0,16)
              })

              this.setData({
                buy_info: obj,
                buyTimeList: timeList2,
              })
            }

            // 添加分割后的时间数据 - 标题处时间
            let objTime = "buy_info.jglQiugou.objTime"
            this.setData({
              [objTime]: this.data.buy_info.jglQiugou.createTime.substring(0,10)
            })

            wx.hideLoading()
          }
        })
      }
    })    
  },

  // 时间格式转换 - 转换成 2021-xx-xx xx:xx:xx
  renderTime(x) {
    var dateee = new Date(x).toJSON();
    // console.log(dateee)
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },

  // 点赞
  handleLike() {
    wx.request({
      url: getApp().globalData.baseUrl+ 'product/jglQiugou/dianzan',
      method: 'POST',
      data: {
        qiugouid: this.data.qiugouid,
        openid: getApp().globalData.openid,
      },
      success: (res)=> {
        console.log(res)
        let dianzanState = "buy_info.isdianzan"
        let dianzanNum = "buy_info.dianzan"
        if (res.data.flag == true) {
          if (res.data.message == '收藏成功') {
            wx.showToast({
              title: '添加喜好成功',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              [dianzanState]: true,
              [dianzanNum]: Number(this.data.buy_info.dianzan) + 1,
            })
          } else {
            wx.showToast({
              title: '取消喜好成功',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              [dianzanState]: false,
              [dianzanNum]: Number(this.data.buy_info.dianzan) - 1,
            })
          }
        } else if (res.data.flag == false) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        
      }
    })
  },

  // 评论文字
  changeVal(e) {
    // console.log(e)
    this.setData({
      commentValue: e.detail.value
    })
  },

  // 发布评论
  commentPublish() {
    if (this.data.commentValue.trim() == '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: getApp().globalData.baseUrl+ 'product/jglQiugou/liuyan',
        method: 'POST',
        data: {
          context: this.data.commentValue,
          openid: getApp().globalData.openid,
          parentid: '',
          qiugouid: this.data.qiugouid
        },
        success: (res)=> {
          console.log(res)
          if (res.data.flag) {
            this.setData({
              commentValue: ''
            })
            this.getBuyInfo()
          }
        }
      })
    }
  },
  
  // 点击回复
  handleReply(e) {
    // console.log(e.currentTarget.dataset.pinglunid)
    this.setData({
      replySwitch: true,
      ifFocus: true,
      pinglunid_one: e.currentTarget.dataset.pinglunid
    })
  },

  // 回复文字
  changeReplyVal(e) {
    // console.log(e)
    this.setData({
      replyValue: e.detail.value
    })
  },

  // 回复框失去焦点
  blurFocus() {
    this.setData({
      replySwitch: false,
      ifFocus: false
    })
  },

  // 发布回复
  replyPublish() {
    if (this.data.replyValue.trim() == '') {
      wx.showToast({
        title: '回复不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: getApp().globalData.baseUrl+ 'product/jglQiugou/liuyan',
        method: 'POST',
        data: {
          context: this.data.replyValue,
          openid: getApp().globalData.openid,
          parentid: this.data.pinglunid_one,
          qiugouid: this.data.qiugouid
        },
        success: (res)=> {
          console.log(res)
          if (res.data.flag) {
            this.setData({
              replyValue: '',
              replySwitch: false,
              ifFocus: false
            })
            this.getBuyInfo()
          }
        }
      })
    }
  }

})