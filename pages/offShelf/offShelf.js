Page({
    data: {
        tabar: '0',
        list: [],
        userinfo: '',
    },

    onLoad: function () {
        this.selectByList()
        this.selectByOpenid()
    },

    // 拍卖售卖切换
    handleTabar(e) {
        this.setData({
          tabar: e.currentTarget.dataset.index
        })
        this.selectByList()
    },

    // 商品数据请求
    selectByList() {
        wx.request({
            url: getApp().globalData.baseUrl + 'product/jglProduct/selectOffTheShelfProduct',
            data: {
                openid: getApp().globalData.openid,
                "auctionOrSale": this.data.tabar
            },
            method: 'get',
            header: {
                "content-type": "application/x-www-form-urlencoded" //query
            },
            success: (res)=> {
                console.log(res);
                this.setData({
                    list: res.data.data
                })
            }
        })
    },

    //根据openid查询用户信息
    selectByOpenid() {
        wx.request({
            url: getApp().globalData.baseUrl + 'user/jglUser/selectByOpenid',
            data: {
                openid: getApp().globalData.openid
            },
            method: 'post',
            header: {
                "content-type": "application/x-www-form-urlencoded" //query
            },
            success: (res)=> {
                console.log(res);

                this.setData({
                    userinfo: res.data.data
                })
                console.log(this.data.userinfo);
            }
        })
    },
    delete(e) {
        wx.request({
            url: getApp().globalData.baseUrl + 'product/jglProduct/deleteProductByProductId',
            data: {
                // "openid":getApp().globalData.openid,
                productId: e.currentTarget.dataset.gid,
            },
            method: 'get',
            header: {
                "content-type": "application/x-www-form-urlencoded" //query
            },
            success: (res)=> {
                console.log(res);
                if (res.data.flag) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    })
                    this.selectByList()
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'fail',
                        duration: 2000
                    })
                }
            }
        })
    },
    //重新上架
    chongxinrelease(e) {
        wx.request({
            url: getApp().globalData.baseUrl + 'product/jglProduct/upProductByProductId',
            data: {
                // "openid":getApp().globalData.openid,
                productId: e.currentTarget.dataset.gid,
                status: "1"
            },
            method: 'get',
            header: {
                "content-type": "application/x-www-form-urlencoded" //query
            },
            success: (res)=> {
                console.log(res);
                if (res.data.flag) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    })
                    this.selectByList()
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'fail',
                        duration: 2000
                    })
                }


            }
        })
    },

})