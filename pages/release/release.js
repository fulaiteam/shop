
const app = getApp();
var time = require('../../utils/util.js');
var adds = []
var imgadds=[]
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2018; i <= date.getFullYear() + 5; i++) {
years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
if (i < 10) {
  i = "0" + i;
}
months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
if (i < 10) {
  i = "0" + i;
}
days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
if (i < 10) {
  i = "0" + i;
}
hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
if (i < 10) {
  i = "0" + i;
}
minutes.push("" + i);
}

Page({
 

  data: {
    lock:false,
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    thumbnail:[],
    imgpath: [],    //用户上传图片的地址
    img_arr:[],   //用户上传多图
    title:"",   //用户输入的标题
    info:"", //  用户输入的产品自述
    actionSheetHidden: true ,  //作为开关控制弹窗是否从底部弹出
    auctionOrSale:1,    //售卖和拍卖
  qipai:'',   //起拍价
  baoliu:'',  //保留价
  baozhengjin:'', //保证金
  fudong:'',  //浮动价格
  kaishishijian:'', //开始时间
  jieshushijian:'', //结束时间
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
takeTime:'1',  //延迟周期
placeholder_title: '商品标题、品牌型号可以帮助搜索',
placeholder_info: '详细描述商品的购买详情、使用情况及出售原因 能够更快的出售商品哟～',
placeholder_sellPrice: '0.00',
placeholder_newPrice: '0.00',
price_bottom: 0,
},
onLoad: function () {
 //设置默认的年份
this.setData({
  choose_year: this.data.multiArray[0][0]
})
var that =this
// 判断用户是否授权登录
wx.getSetting({
  success: function (res) {
    console.log(res);
    // 判断是否授权
    if (res.authSetting['scope.userInfo']) {
       //获取用户信息
      wx.getUserInfo({
        success: function (res) {
          //用户已经授权过，添加用户信息
          // var that = this
          //wx.setStorageSync('nickName', res.userInfo.nickName)
          //wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        }
      });
    }else{
      wx.showToast({
         title: '请授权登录！',
         icon: 'none',
         duration: 1500,
         success: function () {
      //定时器，未授权1.5秒后跳转授权页面
         setTimeout(function () {
         wx.reLaunch({
          url:"/pages/login_phone/login_phone"
            })
          }, 1500);
         }
        })
    }
  }
})
},
onShow : function() {
  if(wx.getStorageSync('openid')){
    getApp().globalData.openid = wx.getStorageSync('openid')
  }
  this.typeList()
  if(!this.data.lock){
    console.log(this.data.lock, 'onshow判断')
    wx.showLoading({
      title: '加载中',
      success: (res)=> {
        this.setData({
          fudong:'',
          auctionOrSale:1,
          typeid:'',
          info:"",
          baozhengjin:'',
          xinpin:'',
          qipai:'', 
          baoliu:'',
          Sale:'', 
          takeTime:'1',
          title:"",
          imgpath: [], 
          img_arr:[], 
        })
        wx.hideLoading()
      }
    })
  }
},

bindMultijieshuPickerChange: function(e) {
  // console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    multiIndex: e.detail.value
  })
  const index = this.data.multiIndex;
  const year = this.data.multiArray[0][index[0]];
  const month = this.data.multiArray[1][index[1]];
  const day = this.data.multiArray[2][index[2]];
  const hour = this.data.multiArray[3][index[3]];
  const minute = this.data.multiArray[4][index[4]];
  // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
  this.setData({
    jieshushijian:year + '-' + month + '-' + day + ' ' + hour + ':' + minute

  })
  // console.log(this.data.time);
},
//获取时间日期
bindMultiPickerChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    multiIndex: e.detail.value
  })
  const index = this.data.multiIndex;
  const year = this.data.multiArray[0][index[0]];
  const month = this.data.multiArray[1][index[1]];
  const day = this.data.multiArray[2][index[2]];
  const hour = this.data.multiArray[3][index[3]];
  const minute = this.data.multiArray[4][index[4]];
  // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
  this.setData({
    kaishishijian: year + '-' + month + '-' + day + ' ' + hour + ':' + minute,
  })
  // console.log(this.data.time);
},
//监听picker的滚动事件
bindMultiPickerjieshuColumnChange: function(e) {
  //获取年份
  if (e.detail.column == 0) {
    let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
    console.log(choose_year);
    this.setData({
      choose_year
    })
  }
  //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  if (e.detail.column == 1) {
    let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
    let temp = [];
    if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        temp.push("" + i);
      }
      this.setData({
        ['multiArray[2]']: temp
      });
    } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
      for (let i = 1; i <= 30; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        temp.push("" + i);
      }
      this.setData({
        ['multiArray[2]']: temp
      });
    } else if (num == 2) { //判断2月份天数
      let year = parseInt(this.data.choose_year);
      console.log(year);
      if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
        for (let i = 1; i <= 29; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else {
        for (let i = 1; i <= 28; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      }
    }
    console.log(this.data.multiArray[2]);
  }
  var data = {
    multiArray: this.data.multiArray,
    multiIndex: this.data.multiIndex
  };
  data.multiIndex[e.detail.column] = e.detail.value;
  this.setData(data);
},
//监听picker的滚动事件
bindMultiPickerColumnChange: function(e) {
  //获取年份
  console.log(e);
  if (e.detail.column == 0) {
    let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
    console.log(choose_year);
    this.setData({
      choose_year
    })
  }
  //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  if (e.detail.column == 1) {
    let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
    let temp = [];
    if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        temp.push("" + i);
      }
      this.setData({
        ['multiArray[2]']: temp
      });
    } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
      for (let i = 1; i <= 30; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        temp.push("" + i);
      }
      this.setData({
        ['multiArray[2]']: temp
      });
    } else if (num == 2) { //判断2月份天数
      let year = parseInt(this.data.choose_year);
      console.log(year);
      if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
        for (let i = 1; i <= 29; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else {
        for (let i = 1; i <= 28; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      }
    }
    console.log(this.data.multiArray[2]);
  }
  var data = {
    multiArray: this.data.multiArray,
    multiIndex: this.data.multiIndex
  };
  data.multiIndex[e.detail.column] = e.detail.value;
  this.setData(data);
},
//  //  点击开始日期组件确定事件
//  bindDateStartChange: function (e) {
//   var that = this;
//   that.setData({
//     date1: e.detail.value
//   })
// },

// //  点击结束日期组件确定事件
// bindDateEndChange: function (e) {
//   var that = this;
//   that.setData({
//     date2: e.detail.value
//   })
// },

// // 保证金跳转支付页面
Jump:function() {
  let that =this;
  var timestamp1 = Date.parse(new Date(that.data.kaishishijian));
  var timestamp2 = Date.parse(new Date(that.data.jieshushijian));
  console.log(timestamp1);
  console.log(timestamp2);
        
            if(this.data.auctionOrSale==1) {
              wx.request({
                url:getApp().globalData.baseUrl+ 'product/jglProduct/releaseProduct', 
                data: {
                  addPrice: that.data.fudong,   //加价幅度
                  auctionOrSale: that.data.auctionOrSale,   //判断拍卖或者售卖 0 拍卖 1售卖
                  category:that.data.typeid,   //商品类型
                  commodityReadme: that.data.info,  //商品自述
                  descriptionPictureDTOS: adds,   //详情图
                  detailPictureDTOS: imgadds,     //主图
                  earnestMoney: that.data.baozhengjin,   //保证金
                  endTime: timestamp2,  //结束时间
                  newPrice: that.data.xinpin,       //新品
                  openid:getApp().globalData.openid,
                  reservePrice: that.data.baoliu,  //保留价格（可以为空）
                  salePrice: that.data.Sale,  //* 售卖价
                  startPrice: that.data.qipai,//起拍价
                  startTime: timestamp1,  //开始时间
                  takeTime: that.data.takeTime,   // 延时周/
                  thumbnail: imgadds[0].url,  //缩略图 1
                  title: that.data.title,  //标题
                  productId: this.random()
                },
               
                method:'post',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                  console.log(res)
                  if (res.data.flag) {
                    wx.showToast({
                      title: '发布成功',
                      icon: 'none',
                      duration: 2000,
                      success:(res)=>{
                        console.log(res)
                        wx.reLaunch({
                          url: '/pages/index/index'
                        })
                      }
                    })
                    
                  }
                }
              })
              }else {
               
              wx.navigateTo({
                // 将保证金传递到支付页面
            // JSON.stringify
            
                url:
                 `/pages/payment/payment?addPrice=`+that.data.fudong
                 + "&category=" +that.data.typeid
                 + "&commodityReadme=" +that.data.info
                 + "&descriptionPictureDTOS=" +JSON.stringify(adds)
                 + "&detailPictureDTOS=" +JSON.stringify(imgadds)
                 + "&earnestMoney=" +that.data.baozhengjin
                 + "&endTime=" +timestamp2
                 + "&reservePrice=" +that.data.baoliu
                 + "&startPrice=" +that.data.qipai
                 + "&startTime=" +timestamp1
                 + "&takeTime=" +that.data.takeTime
                 + "&title=" +that.data.title
                 + "&auctionOrSale=" +that.data.auctionOrSale
                 + "&openid=" +getApp().globalData.openid
                 +"&thumbnail=" + JSON.stringify(imgadds)
                 + "&productid=" + this.random(),
            
              })
            }
             
          
          
      },

// 生成32位随机数
random() {
  /*生成32位随机流水号*/
  /*默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*/
  var $chars = 'abcdefghijklmnopqrstuvwxyz123456789';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < 32; i++) {
       pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd
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
      // console.log(res.data.data)
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
    auctionOrSale:0,
    show : true,
    isshow:false,
    shoumai:true,//选中售卖
isshoumai:false,//选中拍卖

  })
  console.log(auctionOrSale);
},
isshow:function() {
  this.setData({
    auctionOrSale:1,

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
 
   if(that.data.baozhengjin=="") {
    wx.showToast({
      title: '不能为空',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  } else if(that.data.Sale=="") {
    // &&that.data.baoliu==""&&that.data.fudong==""&&that.data.kaishishijian==""&&that.data.jieshushijian==""
    wx.showToast({
      title: '不能为空',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  } else if(that.data.baoliu=="") {
    // &&&&that.data.fudong==""&&that.data.kaishishijian==""&&that.data.jieshushijian==""
    wx.showToast({
      title: '不能为空',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  }else if(that.data.fudong=="") {
    // &&&&&&that.data.kaishishijian==""&&that.data.jieshushijian==""
    wx.showToast({
      title: '不能为空',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  }
  else if(that.data.kaishishijian=="") {
    // &&&&&&&&that.data.jieshushijian==""
    wx.showToast({
      title: '不能为空',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  }else if(that.data.jieshushijian=="") {
    // &&&&&&&&
    wx.showToast({
      title: '不能为空',
      icon: 'none',
      duration: 2000 //持续的时间
    }) 
  return;
  }
  this.setData({
    actionSheetHidden: !this.data.actionSheetHidden,
    auctionOrSale:0
   })
   console.log();
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
inp_focus:function() {
  this.setData({
    placeholder_title: ''
  })
},
inp_focusx:function() {
  this.setData({
    placeholder_title: '商品标题、品牌型号可以帮助搜索'
  })
},

// 商品描述
infoinput:function(e) {
  this.setData({
    info:e.detail.value,
  })
},
info_focus:function() {
  this.setData({
    placeholder_info: ''
  })
},
info_focusx:function() {
  this.setData({
    placeholder_info: '详细描述商品的购买详情、使用情况及出售原因 能够更快的出售商品哟～'
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
takeTimeinput:function(e) {
  this.setData({
    takeTime:e.detail.value,
  
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
  auctionOrSale:1

   })
 },
//  获取售卖价
Saleinput:function(e) {
 
this.setData({
Sale:e.detail.value,
})

},
price_focus: function(e) {
  let height = e.detail.height;
  this.setData({
    placeholder_sellPrice: '',
    price_bottom: height
  })
},
price_focusx: function(e) {
  this.setData({
    placeholder_sellPrice: '0.00',
    price_bottom: 0
  })
},

// 获取新品加
xinpininput:function(e) {
  this.setData({
  xinpin:e.detail.value
  })
  console.log(e.detail.value);
  },
  newPrice_focus: function() {
    this.setData({
      placeholder_newPrice: ''
    })
  },
  newPrice_focusx: function() {
    this.setData({
      placeholder_newPrice: '0.00'
    })
  },

//  主图
  getImg: function (e) {
    var _this = this;
    _this.setData({lock: true})
    console.log(_this.data.lock, '点击添加图片按钮')
    //选择图片
    wx.chooseImage({
      count: 4, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        _this.setData({
          lock:true
        })
        console.log(_this.data.lock, '选择完图片')
    
        console.log(res);
     //   // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       var imgpath=res.tempFilePaths  
       _this.setData({  
        imgpath: _this.data.imgpath.concat(res.tempFilePaths)  
       }) 
       console.log(imgpath)
     for (var i = 0; i < imgpath.length;i++){
       wx.uploadFile({
         url: getApp().globalData.baseUrl + '/product/upload/uploadImg', //开发者服务器地址,//自己的接口地址,
         name: 'imgFile',
         filePath: imgpath[i],//第几张图片
         header: {
           "Content-Type": "multipart/form-data"
         },
         success: (res) =>{
         console.log(res);
     var data = JSON.parse(res.data).data;
           console.log(data);
           imgadds.push(data)
           console.log(imgadds);
           _this.setData({lock: false})
           console.log(_this.data.lock, '整个添加图片结束')
         },
       })
     }
      },
    })
  },

  imgDeletezhu:function(e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgpath = this.data.imgpath;
    imgpath.splice(index, 1)
    that.setData({
      imgpath: imgpath
    });
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
  that.setData({lock: true})
  wx.chooseImage({
   count: 8, // 默认9，设置图片张数
   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
   success: function (res) {
     console.log(res);
  //   // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var img_arr=res.tempFilePaths  
    that.setData({  
      img_arr: that.data.img_arr.concat(res.tempFilePaths)  
    }) 
  for (var i = 0; i < img_arr.length;i++){
    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/product/upload/uploadImg', //开发者服务器地址,//自己的接口地址,
      name: 'imgFile',
      filePath: img_arr[i],//第几张图片
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
      console.log(res);
  var data = JSON.parse(res.data).data;
        console.log(data);
        adds.push(data)
        console.log(adds);
        that.setData({lock: false})
      },
    })
  }
   },
  })
 },

})

