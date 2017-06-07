// pages/loading/loading.js
Page({
  data: {
    num:''
  },
  onLoad: function (options) {
    this.setData({
      num: options.num
    })
    wx.showToast({
      title: '正在跳转',
      icon: 'loading'
    })
    var that = this;
    // 登录判断
    console.log("接下来该获取opendid了");

    wx.login({
      success: function (loginCode) {
        console.log("进入获取opendid方法")
        var appid = 'wxc34b2effd8c3f0a4'; //填写微信小程序appid  
        var secret = '1f9a3583744c12dbcd53af9b843a356d'; //填写微信小程序secret  
        //调用request请求api转换登录凭证  获取opendid
        console.log("开始请求获取opendid")
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log("获取openid成功：" + res.data.openid)
            getApp().data.openId = res.data.openid
            that.setData({
              opendid: res.data.openid
            })
            // 判断opendid是否存在
            wx.request({
              url: getApp().data.url + '/ws/business/loginCheck',
              data: { "params": { "openId": res.data.openid } },
              method: 'POST',
              header: {
                "Content-Type": "application/json"
              },
              success: function (res) {
                var num = that.data.num
                // success
                if (res.data.resultCode == '0000') {
                  if (res.data.object.result == 'fail') {
                    wx.redirectTo({
                      url: '../index/login?num=' + num,
                    })
                  }
                  if (res.data.object.result == 'success') {
                    getApp().data.memberId = res.data.object.memberId
                    if (that.data.num == '2') {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.switchTab({
                        url: '../my_wallet/my_wallet'
                      })
                    }
                    else if (that.data.num == '3') {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.switchTab({
                        url: '../vip_center/vip_center'
                      })

                    } else if (that.data.num == '4') {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.redirectTo({
                        url: '../help/help'
                      })
                    } else {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.switchTab({
                        url: '../car_service/car_service'
                      })
                    }
                  }
                } else {
                  wx.showModal({
                    title: '',
                    content: '系统正在维护，请稍后再试',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                  })
                }
              },
              fail: function (res) {
               console.log(res)
              },
              complete: function (res) {
                // complete
                console.log(res.data)
              }
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
    console.log("opendid获取完了")
  }
})