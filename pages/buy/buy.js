// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table_list: 1,  // table栏切换， 1 是热度， 2 是最新
    contentList: [],  // 求购列表数据
    ifLike: false,  // 是否点赞
    pagenum: 1,  // 当前页面
    isLoading: false,   // 判断是否正在加载
    hasMore: false,  // 是否到了最后一页
    ifPage: 0,  // 进入页面开关 - （正常情况为0，进入求购详情时为1 - 实现tabber页面切换会刷新，进入详情页退回时不刷新）

    searchInput: '',  // 输入框输入内容
    haveFont: false,   // 输入框是否有文字
    isFoucs: false,  // 是否获取焦点
    ifSearch: 0,   // 0 是未搜索， 1 是搜索结果
    searchLength: 0,  // 搜索结果条数  
  },

  onShow() {
    if (this.data.ifPage == 0) {
      this.setData({
        table_list: 1,
        pagenum: 1,
        hasMore: false,
        contentList: [],
      })
      this.acquireBuyList()
    } else {
      this.setData({
        ifPage: 0,
      })
      if (this.data.ifSearch == 0) {
        this.setData({
          pagenum: 1,
          hasMore: false,
          contentList: [],
        })
        this.acquireBuyList()
      }
    }
  },

  onHide() {
    if (this.data.ifPage == 0) {
      this.setData({
        ifSearch: 0,
        pagenum: 1,
        haveFont: false,
        searchInput: '',
        hasMore: false,
        contentList: [],
      })
    }
  },

  // 输入框输入文字时触发
  handleInput(e) {
    // console.log(e)
    this.setData({searchInput: e.detail.value})
    if (this.data.searchInput.trim() == '') {
      this.setData({
        haveFont: false
      })
      if (this.data.ifSearch == 1) {
        this.setData({
          pagenum: 1,
          ifSearch: 0,
          hasMore: false,
          contentList: [],
        })
        this.acquireBuyList()
      }
    } else {
      this.setData({haveFont: true})
    }
  },

  // 点击删除按钮删除输入的文字
  handleCancel() {
    this.setData({
      searchInput: '',
      haveFont: false,
      isFoucs: true,
    })
    if (this.data.ifSearch == 1) {
      this.setData({
        ifSearch: 0,
        pagenum: 1,
        hasMore: false,
        contentList: [],
      })
      this.acquireBuyList()
    }
    
  },

  // 点击搜索
  handleSearch() {

    if(this.data.searchInput.trim() == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        ifSearch: 1,
        pagenum: 1,
        hasMore: false,
        contentList: []
      })
  
      //如果开关时正在加载状态，直接返回
      if (this.data.isLoading) return ;
      // 否则打开开关
      this.data.isLoading = true;
  
      wx.showLoading({
        title: '加载中',
        success: (res)=> {
          wx.request({
            url: getApp().globalData.baseUrl+ 'product/jglQiugou/selectByMohu',
            method: 'POST',
            data: {
              "currentPage": this.data.pagenum,
              "pageSize": 5,
              "query": {
                "openid": getApp().globalData.openid,
                "title": this.data.searchInput
              }
            },
            success: (res)=> {
              console.log(res)
              const {result, total} = res.data.data
              this.setData({
                contentList: [...this.data.contentList, ...result],
                searchLength: total
              })
              // 页数加一，解决了不会同时存在多个请求，避免服务器的奔溃
              this.data.pagenum ++;
              // 关灯 表示加载完毕
              this.data.isLoading = false;
  
              // 添加分割后的时间数据
              let arr = this.data.contentList
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
    }

  },

  // 获取求购列表
  acquireBuyList() {

    //如果开关时正在加载状态，直接返回
    if (this.data.isLoading || this.data.hasMore) return ;
    // 否则打开开关
    this.data.isLoading = true;

    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        wx.request({
          url: getApp().globalData.baseUrl+ 'product/jglQiugou/selectByReDu', 
          method: 'POST',
          data: {
            "currentPage": this.data.pagenum,
            "pageSize": 5,
            "query": {
              "status": this.data.table_list,
              "openid": getApp().globalData.openid
            }
          },
          success: (res)=>{
            console.log(res)
            const {result, total} = res.data.data
            this.setData({
              contentList: [...this.data.contentList, ...result],
            })
            // 页数加一，解决了不会同时存在多个请求，避免服务器的奔溃
            this.data.pagenum ++;
            // 关灯 表示加载完毕
            this.data.isLoading = false;

            // 是否加载完毕
            if(this.data.contentList.length >= total){
              // 已经到了最后一页
              this.setData({hasMore: true});
            }


            // 添加分割后的时间数据
            let arr = this.data.contentList
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
    this.setData({
      table_list: e.currentTarget.dataset.index,
      pagenum: 1,
      hasMore: false,
      contentList: []
    })
    this.acquireBuyList()
  },

  // 点赞
  handleLike(e) {
    const qiugouid = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    // console.log(qiugouid, index, e)
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
        if (res.data.flag == true) {
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

  // 点击进入求购信息页
  handleList(e) {
    // console.log(e)
    this.setData({ifPage: 1})
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/buy_info/buy_info?id=' + id
    })
  },

  // 触底事件
  handleBottom() {
    this.acquireBuyList()
  },

})