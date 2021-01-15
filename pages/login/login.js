// pages/Sign/Sign.js
// const cloud = require('wx-server-sdk')
// cloud.init({
//   env: 'some-env-id'
// })
Page({
  getPhoneNumber(e) {
    console.log(e)
    var BackData = this.data.BackData;
    wx.request({
      url: getApp().globalData.baseUrl + '/authorPhone',
      data: {
        code:wx.getStorageSync('code'),
        encryptedData:e.detail.encryptedData,
        iv:e.detail.iv,
        phone:'',
        openid:wx.getStorageSync('openid'),
        pcode:'',
        sessionKey:wx.getStorageSync('session_key')
      },
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        if(res.data.flag){
          wx.switchTab({
            url:'/pages/personal/personal'
          })
        }

      }
    })
  },
  // getPhoneNumber(e) {
  //   console.log("1111")
  //   if (e.detail.errMsg =="getPhoneNumber:fail user deny") {

  //   }else {
  //     wx.showModal({
  //       title:"提示",
  //       showCancel:false,
  //       content:"同意授权",
  //       success:function(res) {
  //         // 用户登录
  //         wx.login({
  //           success: res => {
  //             console.log("code转换", res.code);//用code传给服务器调换session_key
  //             wx.request({
  //               url:getApp().globalData.baseUrl + '/getSessionKey',
  //               method: 'post',
  //               data: {
  //                 code: res.code
  //               },
  //               success: res => {
  //                 console.log(res.data,1111)
  //                 wx.setStorageSync("nowcode", res.data.data.code);
  //                 wx.setStorageSync("openid", res.data.data.openid);
  //                 wx.setStorageSync("session_key", res.data.data.sessionKey);
  //                 console.log(res);

  //                 wx.request({
  //                   url:getApp().globalData.baseUrl + '/authorPhone',
  //                   data: {
  //                     code:wx.getStorageSync("nowcode"),
  //                     encryptedData: e.detail.encryptedData,
  //                     iv: e.detail.iv,
  //                     sessionKey: wx.getStorageSync("session_key"),
  //                     openid:wx.getStorageSync("openid"),
  //                     phone:'',
  //                     pcode:''

  //                   },
  //                   success: res => {
  //                     console.log(res);
  //                   }
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  // },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.login({
      success: res =>{
        that.setData({
          nowcode: res.code
        });
      }
        
      
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo: function (e) {
    var that = this;
    console.log(e, 88888)
    that.setData({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    });
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.setData({
          nowcode: res.code
        });
        wx.request({
          // 请求用户地址列表
          url: getApp().globalData.baseUrl + '/wxlogin',
          method: 'post',
          data: {
            encryptedData: that.data.encryptedData,
            iv: that.data.iv,
            code: that.data.nowcode,
            openid: '',
            pcode: '',
            phone: '',
            sessionKey:''
          },
          success(res) {
            that.setData({
              BackData:res.data.data
            });



          }
        })
      }
    })

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      that.setData({
        userinfo: e.detail.userInfo
      })
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      // toprefer: function () {
      wx.navigateTo({
        url: ""
      })
      // },

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
})