
const app = getApp();
Page({
    data: {
        authentication:'',
        haveShu: true,   //生日是否有值
        birthday: '',
        date: "请选择",
        havephone:false,
        isOpenid: false,
        newInfos: 0,  // 新消息条数
       
        top_arr: [
            {
                text: '我发布的',
                num: 0,
                path: '/pages/myRelease/myRelease'
            },
            {
                text: '已下架的',
                num: 0,
                path: '/pages/offShelf/offShelf'
            },
            {
                text: '收藏',
                num: 0,
                path: '/pages/myCollect/myCollect'

            },
        ],
        modules_arr: [
            {
                img: ' https://jgl.oss-cn-beijing.aliyuncs.com/person/confirm.png',
                title: '实名认证',
                path: '/pages/confirmName/confirmName'
            },
          
            {
                img: ' https://jgl.oss-cn-beijing.aliyuncs.com/person/gender.png',
                title: '更改性别'
            },
            {
                img: ' https://jgl.oss-cn-beijing.aliyuncs.com/person/birth.png',
                title: '更改生日'
            },
            {
                img: 'https://jgl.oss-cn-beijing.aliyuncs.com/person/bindmobile.png',
                title: '绑定手机'
            },
            {
                img: 'https://jgl.oss-cn-beijing.aliyuncs.com/person/concert_sale.png',
                title: '参与拍卖',
                path: '/pages/auction/auction'
            },
            {
                img: 'https://jgl.oss-cn-beijing.aliyuncs.com/person/kefu.png',
                title: '我的客服'
            },
        ]
    },
    handleContact (e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    },
    onShow: function () {
        if(wx.getStorageSync('openid')){
            getApp().globalData.openid = wx.getStorageSync('openid')
            this.getUserInfoByOpenid()
            this.setData({isOpenid: true})
        } else {
            this.setData({isOpenid: false})
        }
        this.getByCount()
    },
    bindDateChange: function (event) {
        let that =this;
        this.setData({
            date: event.detail.value,
            birthday:event.detail.value
        })
        wx.request({
            // 请求用户地址列表
            url: getApp().globalData.baseUrl + '/user/jglUser/updateUser',
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: 'post',
            data: {
                openid: wx.getStorageSync('openid'),
                birthday:that.data.birthday
            },
            success(res) {
                console.log(res);
            }
        })
        console.log(event.detail.value);
      },
    toPage: function (e) {
        if (wx.getStorageSync('openid')) {
            var path = e.currentTarget.dataset.path;
            wx.navigateTo({
                url: path
            })
        } else {
            wx.showToast({
              title: '请先登录',
              icon: 'none',
              duration: 2000
            })
        }
    },
    toConfirmName :function(){
        console.log(this.data.authentication)
        if (wx.getStorageSync('openid')) {
            if(this.data.authentication == '0') {
                wx.navigateTo({
                    url: '/pages/confirmName/confirmName'
                })
            } else {
            wx.showToast({
                title: '已认证',
                icon: 'success',
                duration: 2000
                })
            }
        } else {
            wx.showToast({
              title: '请先登录',
              icon: 'none',
              duration: 2000
            })
        }
    },
    toAuction :function(){
        if (wx.getStorageSync('openid')) {
            wx.showToast({
                title: '该功能暂未开放',
                icon: 'none',
                duration: 2000
              })
            // wx.navigateTo({
            //     url: '/pages/auction/auction'
            // })
        } else {
            wx.showToast({
              title: '请先登录',
              icon: 'none',
              duration: 2000
            })
        }
    },
    toService:function(){
        wx.navigateTo({
            url: '/pages/myService/myService'
        })
    },
    toBindPhone:function(){
        if(this.data.authentication==0) {
            wx.navigateTo({
                url: '/pages/bindPhone/bindPhone'
            })
           } else {
            wx.showToast({
                title: '已认证',
                icon: 'success',
                duration: 2000
               })
           }
      
    },
    toLogin:function(){
        wx.navigateTo({
            url: '/pages/login_phone/login_phone'
        })
    },
    // 请求后台返回接口
    getUserInfoByOpenid(){
            
            wx.request({
            // 请求用户地址列表
            url: getApp().globalData.baseUrl + 'user/jglUser/selectByOpenid',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            method: 'post',
            data: {
                openid: wx.getStorageSync('openid')
            },
            success:(res)=> {
                console.log(res);
                if(res.data.flag){
                    this.setData({
                        BaseInfo:res.data.data,
                        authentication:res.data.data.isRealname,
                        haveShu: res.data.data.isBirthday ? true : false,
                        birthday: res.data.data.birthday || '请选择',
                        date: res.data.data.birthday || '请选择',

                    })
                }
                console.log(res.data.data)
                
            }
        })
    },

    // 跳转到消息中心页
    toNewsPage() {
        if (wx.getStorageSync('openid')) {
            wx.navigateTo({
                url: '/pages/news/news'
              })
        } else {
            wx.showToast({
              title: '请先登录',
              icon: 'none',
              duration: 2000
            })
        }
    },

    // 消息列表数字显示
    getByCount() {
        wx.request({
            url: getApp().globalData.baseUrl + 'product/jglQiugou/selectByCount',
            method: 'POST',
            data: {
                'openid': getApp().globalData.openid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' //query
            },
            success: (res)=> {
                console.log(res)
                this.setData({newInfos: res.data.data})
            }
        })
    },

})
