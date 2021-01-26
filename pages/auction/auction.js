const app = getApp();
Page({
    data:{
        show:0,    
        picture:[],  //已经拍下的商品数据列表
        auctionList:[],    //拍卖中的数据列表
        status:2,   //拍卖中
        statuss:3,   //已经拍卖结束
        money:'',    //价格
        jiage:[]


    },
   
    // 获取拍卖中的数据列表
    auctionList:function () {
    var that=this;
    wx.request({
      url:getApp().globalData.baseUrl+'bep/jglEnroll/selectByOpenid', 
      data: {
        openid:getApp().globalData.openid,
        // openid:'oS5bk5DPJKHDc6UwrR8xcUb3Ri8w',
        status:that.data.status,   //拍卖中
      },
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //query
      },
      success: function(res) {
        console.log(res,11111);
        
        that.setData({
          auctionList:res.data.data,
         })
         console.log(that.data.auctionList);
           for (let i = 0; i < that.data.auctionList.length; i++) {
        console.log(that.data.auctionList[i].enrollProductVO.productId);
        that.data.jiage.push(that.data.auctionList[i].enrollProductVO.productId)

          }
          console.log( that.data.jiage);
         wx.request({
          url:getApp().globalData.baseUrl+'bep/jglBid/selectMaxById', 
          data: {
            productId:that.data.jiage,
            
          },
          method:'post',
          header: {
            'content-type': 'application/json' //query
          },
          success: function(res) {
            console.log(res)
          //  that.setData({
          //   auctionList:res.data.data
          //  })
           
          }
        })
    
      }
    })

  },
  //  获取拍下的数据列表
   picture:function () {
    var that=this;
    wx.request({
      url:getApp().globalData.baseUrl+'bep/jglEnroll/selectByOpenid', 
      data: {
        openid:getApp().globalData.openid,
        // openid:'oS5bk5DPJKHDc6UwrR8xcUb3Ri8w',
        status:that.data.statuss,   //拍卖中
    
      },
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //query
      },
      success: function(res) {
        console.log(res)
       that.setData({
        picture:res.data.data
       })
       
      }
    })
  },
   // 获取拍卖中的价格
    auctionmoney:function() {
      // var that=this;

  

  },
    handlePailistType(e) {
        this.setData({
            show: e.currentTarget.dataset.index
        })
      },
    onLoad: function (){
      
      
    },
    onShow: function (){
this.auctionList()
this.picture()
this.auctionmoney()
    }


})
