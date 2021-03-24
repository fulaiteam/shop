const app = getApp();
var imgadds=[]
var upimgadds=[]
Page({
    data:{
        username:'',   //实名认证姓名
        usernameId:'',  //实名认证身份证
        imgpath:[],   //身份证正面图片
        upimgpath:[],  //身份证反面图片
        openid:''
    },
    authentication:function() {
        let that =this;
        wx.showLoading({
          title: '认证中',
          mask: true,
          success:(res)=> {
            wx.request({
              url:getApp().globalData.baseUrl+ 'user/jglUser/authentication', 
              data: {
                  name:that.data.username,
                  openid:getApp().globalData.openid,//oS5bk5DPJKHDc6UwrR8xcUb3Ri8w
                  idNumber:that.data.usernameId,
                  backimg:upimgadds[0].url,
                  fontimg:imgadds[0].url
                  // fontimg:JSON.stringify(imgadds)
              },
             
              method:'post',
              header: {
                  'content-type': 'application/json' // 默认值
              },
              success: function(res) {
                console.log(res)
                console.log(res.data.flag);
                if(res.data.flag==true) {
                    wx.switchTab({
                      url:"/pages/personal/personal"
                    })
                    wx.showToast({
                      title: '认证成功',
                      icon: 'success',
                      duration: 2000
                    })
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 2000
                  })
                }
                wx.hideLoading()
              }
            })
          }
        })
      
      },
    // 上传身份证正面
    getImg: function (e) {
        var _this = this;
        //选择图片
        wx.chooseImage({
          count: 1, // 默认9，设置图片张数
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            console.log(res);
         //   // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           var imgpath=res.tempFilePaths  
           _this.setData({  
            // imgpath: _this.data.imgpath.concat(res.tempFilePaths)  
            imgpath: res.tempFilePaths[0]
           }) 
           console.log(_this.data.imgpath)
         for (var i = 0; i < imgpath.length;i++){
           wx.showLoading({
             title: '加载中',
             mask: true,
             success: (res)=> {
              wx.uploadFile({
                url: getApp().globalData.baseUrl + '/product/upload/uploadImg', //开发者服务器地址,//自己的接口地址,
                name: 'imgFile',
                filePath: imgpath[0],//第几张图片
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success(res) {
                console.log(res);
            var data = JSON.parse(res.data).data;
                  console.log(data);
                  if (imgadds.length == 0) {
                     imgadds.push(data)
                  } else {
                   imgadds = imgadds.map(t => {
                     return data
                   })
                  }
                  
                  console.log(imgadds);

                  wx.hideLoading()
                },
              })
             }
           })
           
         }
          },
        })
      },

    //   上传反面身份证

      upgetImg:function(e){
        var _this = this;
        //选择图片
        wx.chooseImage({
          count: 1, // 默认9，设置图片张数
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // console.log(res);
         //   // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           var upimgpath=res.tempFilePaths  
           _this.setData({  
            // upimgpath: _this.data.upimgpath.concat(res.tempFilePaths) 
            upimgpath: res.tempFilePaths[0]
           }) 
         for (var i = 0; i < upimgpath.length;i++){
           wx.showLoading({
             title: '加载中',
             mask: true,
              success: (res)=> {
                wx.uploadFile({
                  url: getApp().globalData.baseUrl + '/product/upload/uploadImg', //开发者服务器地址,//自己的接口地址,
                  name: 'imgFile',
                  filePath: upimgpath[0],//第几张图片
                  header: {
                    "Content-Type": "multipart/form-data"
                  },
                  success(res) {
                  //  console.log(res);
                  var data = JSON.parse(res.data).data;
                  //  console.log(data);
                  if (upimgadds.length == 0) {
                    upimgadds.push(data)
                  } else {
                    upimgadds = upimgadds.map(t => {
                      return data
                    })
                  }
                    console.log(upimgadds);

                    wx.hideLoading()
                  },
                })
              }
           })
           
         }
          },
        })
      },
    // 获取用户输入的姓名
    usernameinput:function(e) {
    this.setData({
        username:e.detail.value,
    
    })
    // console.log(e.detail.value);
  },
    // 获取用户输入的身份证
    usernameIdinput:function(e) {
        this.setData({
            usernameId:e.detail.value,
        
        })
        // console.log(e.detail.value);
      },
    onLoad: function (){

    },
    onShow: function (){

    }


})
