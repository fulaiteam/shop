// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 切换栏数据
    table: ["售卖"],
    // 切换栏高亮
    highlight: 0,
    // 收藏商品数据
    list: [],
    j:""
  },

  changeLight(e) {
    // console.log(e.currentTarget.dataset.index)
    const {index} = e.currentTarget.dataset
    this.setData({highlight: index})
  },
  //获去收藏列表信息
  collectList:function() {
    var that=this;
  wx.request({
    url:getApp().globalData.baseUrl+'product/jglCollection/selectCollectionPage', 
    data: {
      // openid:getApp().globalData.openid,
      // // openid:'oS5bk5DPJKHDc6UwrR8xcUb3Ri8w',
      // status:that.data.status,   //拍卖中
      // query:'oS5bk5LsMVZn5bOm25BlhjX64KGc'
      "currentPage": '',
        "pageSize": '',
      "query":getApp().globalData.openid,
    },
    method:'post',
    header: {
      'content-type': 'application/json' //query
    },
    success: function(res) {
      console.log(res);
     that.setData({
      list:res.data.data.rows
     })
     console.log(that.data.list);
    }
  })
},
onShow: function (){
  this.collectList()
  }
})