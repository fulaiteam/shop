// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 切换栏数据
    table: ["全部","售卖"],
    // 切换栏高亮
    highlight: 0,
    // 收藏商品数据
    list: [
      {
        title: 'AGV K1摩托车头盔',
        start_time: '2020-12-11 13:17',
        stop_time: '2020-12-12 13:17',
        browse_data: '10000',
        like_data: '9999',
        price: '620.80',
        collect_state: 0
      },
      {
        title: 'AGV K1摩托车头盔',
        start_time: '2020-12-11 13:17',
        stop_time: '2020-12-12 13:17',
        browse_data: '10000',
        like_data: '10000',
        price: '620.80',
        collect_state: 1
      },
      {
        title: 'AGV K1摩托车头盔',
        start_time: '2020-12-11 13:17',
        stop_time: '2020-12-12 13:17',
        browse_data: '10000',
        like_data: '10000',
        price: '620.80',
        collect_state: 2
      },
      {
        title: 'AGV K1摩托车头盔',
        start_time: '2020-12-11 13:17',
        stop_time: '2020-12-12 13:17',
        browse_data: '10000',
        like_data: '10000',
        price: '620.80',
        collect_state: 2
      },
      {
        title: 'AGV K1摩托车头盔',
        start_time: '2020-12-11 13:17',
        stop_time: '2020-12-12 13:17',
        browse_data: '10000',
        like_data: '10000',
        price: '620.80',
        collect_state: 2
      },
    ]
  },

  changeLight(e) {
    // console.log(e.currentTarget.dataset.index)
    const {index} = e.currentTarget.dataset
    this.setData({highlight: index})
  }
})