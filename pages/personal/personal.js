
const app = getApp();
Page({
    data: {
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
                img: 'https://jgl.oss-cn-beijing.aliyuncs.com/person/change_name.png',
                title: '更改昵称'
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
    onLoad: function () {

    },
    onShow: function () {
        if(wx.getStorageSync('openid')){
            getApp().globalData.openid = wx.getStorageSync('openid')
            this.getUserInfoByOpenid();
        }
    },
    toPage: function (e) {
        var path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: path
        })
    },
    toConfirmName :function(){
        wx.navigateTo({
            url: '/pages/confirmName/confirmName'
        })
    },
    toAuction :function(){
        wx.navigateTo({
            url: '/pages/auction/auction'
        })
    },
    toService:function(){
        wx.navigateTo({
            url: '/pages/myService/myService'
        })
    },
    toBindPhone:function(){
        wx.navigateTo({
            url: '/pages/bindPhone/bindPhone'
        })
    },
    toLogin:function(){
        wx.navigateTo({
            url: '/pages/login_phone/login_phone'
        })
    },
    getUserInfoByOpenid:function(){
            var that = this;
            wx.request({
            // 请求用户地址列表
            url: getApp().globalData.baseUrl + '/selectByOpenid',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            method: 'post',
            data: {
                openid: wx.getStorageSync('openid')
            },
            success(res) {
                if(res.data.flag){
                    that.setData({
                        BaseInfo:res.data.data
                    })
                }
                console.log(res.data.data)

            }
        })
    }


})
