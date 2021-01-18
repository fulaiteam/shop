// 基准路径  
const baseurl ='http://192.168.3.70:10010/jgl/user/' 

//get请求
function get(url, data) {
  return new Promise((reslove, reject) => {
    wx.request({
      method: 'GET',
      url:baseurl + url,
      data,
      success: reslove,
      fail: reject
    })
  })
}

//post请求
function post(url, data) {
  return new Promise((reslove, reject) => {
    wx.request({
      method: 'POST',
      url, url:baseurl + url,
      data,
      success: reslove,
      fail: reject
    })
  })
}

 //需要导出
module.exports = {
  get,
  post
}