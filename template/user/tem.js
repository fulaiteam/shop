// import record from '../template.js'
var creatwx = function (rese) {
  // 创建用户
  return new Promise(function (resolve, reject) {
    // nmy---必须是在用户已经授权的情况下调用
    wx.getUserInfo({
      success: function (res) {
        // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
        // 根据自己的需求有其他操作再补充
        // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
        wx.login({
          success: res => {
            // console.log(rese, res, 'create')
            // 获取到用户的 code 之后：res.code
            // 可以传给后台，再经过解析获取用户的 openid
            // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
            wx.request({
              url: getApp().globalData.ip+'/user/userinfo/',
              method: 'POST',
              data: {
                'code': res.code,
                'user': JSON.stringify(rese),
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function (res) {
                console.log(res, 'userinfo')
                wx.setStorageSync('sessionkey', res.data)
                wx.switchTab({
                  url: "/pages/index/index",
                })
              }
            });
          }
        });
      }

    });
  })
}


var wxgetsession = function (res) {
  // 获取session_key
  // 调用方式 
  // wxsession.wxgetsession(res.data).then(function (locationData) {
  //   console.log(locationData, 'isex');
  // }) 
  console.log(res)

}


var openid_sessionkey = function(e){
  // 获取 openid, sessionkey的值
  return new Promise(function (resolve, reject) {
    // nmy---必须是在用户已经授权的情况下调用
    wx.getUserInfo({
      success: function (res) {
        // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
        // 根据自己的需求有其他操作再补充
        // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
        console.log(res)
        wx.login({
          success: res => {
            // 获取到用户的 code 之后：res.code
            // 可以传给后台，再经过解析获取用户的 openid
            // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
            wx.request({
              // 自行补上自己的 APPID 和 SECRET
              url: getApp().globalData.ip+'/user/sessionkey/',
              method: 'POST',
              data: {
                'code': res.code
              },
              success: res => {
                console.log(res, res.statusCode, 'sessionkey113')
                wx.setStorageSync('sessionkey', res.data)
                if(e){
                  console.log(e,'eeeeeeeee')

                }
              }
            });
          }
        });
      }

    });
  })
}



module.exports = {
  creatwx: creatwx,
  wxgetsession: wxgetsession,
  openid_sessionkey: openid_sessionkey,
};