
const app = getApp();
Page({
    data:{
        top_arr:[
            {
                text:'我发布的',
                num:0
            },
            {
                text:'已下架的',
                num:0
            },
            {
                text:'收藏',
                num:0
            },
        ],
        modules_arr:[
            {
                img:' https://jgl.oss-cn-beijing.aliyuncs.com/person/confirm.png',
                title:'实名认证'
            },
            {
                img:'https://jgl.oss-cn-beijing.aliyuncs.com/person/change_name.png',
                title:'更改昵称'
            },
            {
                img:' https://jgl.oss-cn-beijing.aliyuncs.com/person/gender.png',
                title:'更改性别'
            },
            {
                img:' https://jgl.oss-cn-beijing.aliyuncs.com/person/birth.png',
                title:'更改生日'
            },
            {
                img:'https://jgl.oss-cn-beijing.aliyuncs.com/person/bindmobile.png',
                title:'绑定手机'
            },
            {
                img:' https://jgl.oss-cn-beijing.aliyuncs.com/person/concert_sale.png',
                title:'参与拍卖'
            },
            {
                img:'https://jgl.oss-cn-beijing.aliyuncs.com/person/kefu.png',
                title:'我的客服'
            },
        ]
    },
    onLoad: function (){

    },
    onShow: function (){

    }


})
