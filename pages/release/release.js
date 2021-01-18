
const app = getApp();
let msg //存储输入的内容

Page({
 

  data: {
    imgpath: '',    //用户上传图片的地址
    img_arr:[],   //用户上传多图
    title:"",   //用户输入的标题
    info:"", //  用户输入的产品自述
    actionSheetHidden: true ,  //作为开关控制弹窗是否从底部弹出

  qipai:'',   //起拍价
  baoliu:'',  //保留价
  baozhengjin:'', //保证金
  fudong:'',  //浮动价格
  kaishishijian:'00:00:00', //开始时间
  jieshushijian:'00:00:00', //结束时间
show:true,   //选中拍卖
isshow:true, //未选中拍卖
shoumai:true,//选中售卖
isshoumai:true,//选中拍卖
Sale:'', //售卖价
xinpin:'',  //新品价
showtype: true,    ///作为开关控制弹窗是否从底部弹出
typelist:[1,2,3,4]  //类型数据
},
onShow: function () {
 this.typeList()
},
// // 保证金跳转支付页面
Jump:function() {
  wx.navigateTo({
    url: '/pages/payment/payment',
  })
},
// 关闭弹窗
cancel: function() {
  this.setData({
    showtype: !this.data.showtype
  });
},
// 获取商品类型分类
typeList:function () {
  var that=this;
  wx.request({
    url:getApp().globalData.baseUrl+ '/product/jglClassify/selectClassify', 
    // data: {
    //    x: '' ,
    //    y: ''
    // },
    method:'get',
    header: {
        'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      console.log(res.data.data)
     that.setData({
       typelist:res.data.data
     })
    }
  })
},

typebtn: function() {
  this.setData({
    showtype: !this.data.showtype
  });
},
type:function() {
  this.setData({
    showtype: !this.data.showtype
  })
},
// 拍卖与售卖的切换
show:function() {
  this.setData({
    show : true,
    isshow:false,
    shoumai:true,//选中售卖
isshoumai:false,//选中拍卖
  })
},
isshow:function() {
  this.setData({
    isshow : true,
    show:false,
    shoumai:false,//选中售卖
    isshoumai:true,//选中拍卖
  })
},
shoumai:function() {
  this.setData({
    show : false,
    isshow:true,
    shoumai:false,//选中售卖
isshoumai:true,//选中拍卖
  })
},
isshoumai:function() {
  this.setData({
    show : true,
    isshow:false,
    shoumai:true,//选中售卖
isshoumai:false,//选中拍卖
  })
},

  //将输入的内容绑定到 msg 中
 obtainInput: function(data) {
 	 msg = data.detail.value;
 },

 listenerButton: function() {
	 this.setData({
	 	actionSheetHidden: !this.data.actionSheetHidden
	 });
 },

 listenerActionSheet:function() {
	 this.setData({
	  actionSheetHidden: !this.data.actionSheetHidden
	 })
 },

 //用户输完并点击确认后，输入的信息会打印到控制台上
 showInput: function() {
 	 console.log(msg);
 },
//  主图
  getImg: function () {
    var _this = this;
    //选择图片
    wx.chooseImage({
      success: function (res) {
        console.log(res);
        //预览显示
        _this.setData({
          imgpath: res.tempFilePaths[0]
        });
      },
    })
  },



 // 删除照片 商品描述的图片&&
 imgDelete1: function (e) {
  let that = this;
  let index = e.currentTarget.dataset.deindex;
  let img_arr = this.data.img_arr;
  img_arr.splice(index, 1)
  that.setData({
    img_arr: img_arr
  });
 },
 // 选择商品描述的图片 &&&
 upimg: function (e) {
  var img_arr = this.data.img_arr;
  console.log(img_arr)
  var that = this;
  // var n = 8;
  // if (8 > img_arr.length > 0) {
  //  n = 8 - img_arr.length;
  // } else if (img_arr.length == 8) {
  //  n = 1;
  // }
  wx.chooseImage({
   count: 8, // 默认9，设置图片张数
   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
   success: function (res) {
    // console.log(res.tempFilePaths)
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = res.tempFilePaths
      img_arr = img_arr.concat(tempFilePaths);

    // if (img_arr.length == 0) {
    //   img_arr = tempFilePaths
    // } else if (8 > img_arr.length) {
    //   img_arr = img_arr.concat(tempFilePaths);
    // }
    that.setData({
      img_arr: img_arr
    });
   }
  })
 },















  upimg: function () {
    console.log('上传图片');
    var that = this;
        wx.chooseImage({
            count: 9,  //最多可以选择的图片张数，默认为9
            sizeType: ['original', 'compressed'], //'可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log(res);
                that.setData({
                    img_arr: res.tempFilePaths     //concat
                });
            }
        })
    
},
})