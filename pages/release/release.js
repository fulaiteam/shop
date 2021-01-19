
const app = getApp();
Page({
 

  data: {
    imgpath: [],    //用户上传图片的地址
    img_arr:[],   //用户上传多图
    imgurl:[],     //图片上传服务器返回的url
    imgindex:[],   //tupian的索引
    imgstats:[],
    title:"",   //用户输入的标题
    info:"", //  用户输入的产品自述
    actionSheetHidden: true ,  //作为开关控制弹窗是否从底部弹出

  qipai:'',   //起拍价
  baoliu:'',  //保留价
  baozhengjin:'', //保证金
  fudong:'',  //浮动价格
  // kaishishijian:new Date(), //开始时间
  // jieshushijian:new Date(), //结束时间
show:true,   //选中拍卖
isshow:true, //未选中拍卖
shoumai:true,//选中售卖
isshoumai:true,//选中拍卖
Sale:'', //售卖价
xinpin:'',  //新品价
showtype: true,    ///作为开关控制弹窗是否从底部弹出
typelist:[1,2,3,4],  //类型数据
typeName:'',   //商品类型的选中变量   
typeid:'',//商品类型的选中id   
taktTime:'00'  //延迟周期
},
onShow: function () {
 this.typeList();
 this.upload()
},
// // 保证金跳转支付页面
Jump:function() {
  let that =this;
  // for (var i = 0; i < that.data.img_arr.length; i++) {
  //     console.log(that.data.img_arr[i]);//遍历输出
  //     that.data.arr=that.data.img_arr[i]//赋结新值
  //     // console.log(that.data.arr);
  // }
    wx.request({
      url:getApp().globalData.baseUrl+ '/product/jglProduct/releaseProduct', 
     
      data: {
        addPrice: that.data.fudong,   //加价幅度
        auctionOrSale: 1,   //判断拍卖或者售卖 0 拍卖 1售卖
        category:that.data.typeid,   //商品类型
        commodityReadme: that.data.info,  //商品自述
        descriptionPictureDTOS: [  // 商品描述图
          {
            status:that.data.imgindex,
            url: that.data.imgurl
          }
        ],
        detailPictureDTOS: [   //大图
          {
            status: that.data.imgstats[0],
            url: that.data.imgpath
          }
        ], 
        earnestMoney: '',   //保证金
        endTime: that.data.jieshushijian,  //结束时间
        newPrice: that.data.xinpin,       //新品
        opneid:getApp().globalData.unionId,
        reservePrice: that.data.baoliu,  //保留价格（可以为空）
        salePrice: that.data.Sale,  //* 售卖价
        startPrice: that.data.qipai,//起拍价
        startTime: that.data.kaishishijian,  //开始时间
        taktTime: that.data.taktTime,   // 延时周期
        thumbnail: that.data.imgpath,  //缩略图 1
        title: that.data.title  //标题
      },
     
      method:'post',
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data.data)
       
      }
    })
    // wx.navigateTo({

    // })
  // }
  // 进行判断，如果是售卖则不需要支付备用金不需要跳转
  // wx.navigateTo({
  //   // 将保证金传递到支付页面
  //   url: `/pages/payment/payment? baozhengjin=`+this.data.baozhengjin
  // })
  // console.log(this.data.baozhengjin);
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
// 当下拉框发生变化时的操作
bindtaptypeName:function(e) {
 this.setData({
   typeid:e.currentTarget.dataset.name.id,
  typeName:e.currentTarget.dataset.name,
  showtype: !this.data.showtype
 })
 console.log(e);
 console.log(e.currentTarget.dataset.name);
 console.log(e.currentTarget.dataset.name.id);
},

// 当下拉框发生变化时的操作
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
// 点击去售卖，页面显示用户输入的信息
paimaiInput: function() {
  let that =this;
 
   if(that.data.baozhengjin==''&&that.data.Sale==""&&that.data.baoliu==''&&that.data.fudong==""&&that.data.kaishishijian==""&&that.data.jieshushijian=="") {
    wx.showToast({
      title: '不能为空或您未更改',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  }
  this.setData({
    actionSheetHidden: !this.data.actionSheetHidden,
   })
 },
 
// 拍卖价格的change事件
listenerActionSheet:function() {
  this.setData({
   actionSheetHidden: !this.data.actionSheetHidden
  })
},
// title
titleinput:function(e) {
  this.setData({
    title:e.detail.value,
   
  })
},

// 商品描述
infoinput:function(e) {
  this.setData({
    info:e.detail.value,
   
  })
},
// 赋值表单的起拍价
qipaiinput:function(e) {
  this.setData({
    Sale:e.detail.value,
    qipai:e.detail.value
  })
},
// 延时周期
taktTimeinput:function(e) {
  this.setData({
    taktTime:e.detail.value,
  
  })
  console.log(e.detail.value);
},
// 赋值表单的保留价
baoliuinput:function(e) {
  this.setData({
    baoliu:e.detail.value,
  
  })
  console.log(e.detail.value);
},
// 赋值表单的保证金
baozhengjininput:function(e) {
  this.setData({
    baozhengjin:e.detail.value,
  
  })
  console.log(e.detail.value);
},
// 赋值表单的加价浮动
fudonginput:function(e) {
  this.setData({
    fudong:e.detail.value,
  
  })
  console.log(e.detail.value);
},
// 赋值表单的开始时间
kaishishijianinput:function(e) {
  this.setData({
    kaishishijian:e.detail.value,
  
  })
  console.log(e.detail.value);
},
// 赋值表单的结束时间
jieshushijianinput:function(e) {
  this.setData({
    jieshushijian:e.detail.value,
  
  })
  console.log(e.detail.value);
},
// 点击价格选择
Salebtn: function() {
	 this.setData({
	 	actionSheetHidden: !this.data.actionSheetHidden
	 });
 },
// 售卖价格的change事件
 shoumaijiage:function() {
	 this.setData({
	  actionSheetHidden: !this.data.actionSheetHidden
	 })
 },

// 点击去售卖，页面显示用户输入的信息
 showInput: function() {
  let that =this;
 
   if(that.data.Sale=='') {
    wx.showToast({
      title: '不能为空或您未更改',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  }
  this.setData({
    actionSheetHidden: !this.data.actionSheetHidden,
   })
 },
//  获取售卖价
Saleinput:function(e) {
 
this.setData({
Sale:e.detail.value,
})

},
// 获取新品加
xinpininput:function(e) {
  this.setData({
  xinpin:e.detail.value
  })
  console.log(e.detail.value);
  },
//  主图
  getImg: function (e) {
    var _this = this;
    //选择图片
    wx.chooseImage({
      count: 1, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths);
        var imgpath =[]
        //预览显示
        _this.setData({
          imgpath:res.tempFilePaths,
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
               
        });
        console.log(imgpath);        
        _this.upgetImg()
      },
    })
  },
  // 上传主图
  upgetImg:function(e) {
    var that = this
    for (var i = 0; i < that.data.imgpath.length; i++) {//循环遍历图片 
      wx.uploadFile({
         url: getApp().globalData.baseUrl + '/product/upload/uploadImgs', //开发者服务器地址,//自己的接口地址
        filePath: that.data.imgpath[0],
        name: 'imgFiles',
        header: {
          "Content-Type": "multipart/form-data",
        },
    
        success: function (res) {
          console.log(res)
          console.log(res.data);
          var data = JSON.parse(res.data).data;
          console.log(data);
          for(i=0;i<data.length;i++) {
           that.data.imgpath=data[i].url;
           that.data.imgstats=data[i].status;
          }
          
          console.log(that.data.imgpath);
          that.setData({
          })
        }
      })
      }
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
  var that = this;
  wx.chooseImage({
   count: 8, // 默认9，设置图片张数
   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
   success: function (res) {
     console.log(res);
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    that.setData({
        img_arr: that.data.img_arr.concat(res.tempFilePaths)

    })

  
   },
  
  })
 },
// 图片 上传阿里云
upload: function () {
  var that = this
  for (var i = 0; i < that.data.img_arr.length; i++) {//循环遍历图片 
    wx.uploadFile({
       url: getApp().globalData.baseUrl + '/product/upload/uploadImgs', //开发者服务器地址,//自己的接口地址
      filePath: that.data.img_arr[i],
      name: 'imgFiles',
      header: {
        "Content-Type": "multipart/form-data",
      },
  
      success: function (res) {
        console.log(res)
        console.log(res.data);
        var data = JSON.parse(res.data).data;
        console.log(data);
        for(i=0;i<data.length;i++) {
          // var dtos = {
          //   'status': i,
          //   'url':data[i].url
          // }   
          // console.log(data[i]);
         that.data.imgurl=data[i].url;
that.data.imgindex=data[i].status
        }
        console.log(that.data.imgurl);

        that.setData({
         
        })
      }
     
    })
    }

},


})

