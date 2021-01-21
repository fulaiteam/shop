
const app = getApp();
Page({
data:{
  releaseList: [],  // 发布商品的数据

},
// 获取发布商品的数据
getreleaseList:function() {
  let that =this;
  wx.request({
    url:getApp().globalData.baseUrl+ '', 
    data: {
     
    },
    method: 'POST',
    success: (res) => {
      console.log(res)
     
      this.setData({
       
      })
    }
  })
},

})
