// pages/vip_center/vip_center.js
Page({
  data: {
    balance: ''
  },
  chongzhi: function () {
    wx.navigateTo({
      url: '../chongzhi/chongzhi'
    })
  },
  my_card: function () {
    wx.navigateTo({
      url: '../my_card/my_card'
    })
  },
  order: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  mycar: function () {
    wx.navigateTo({
      url: '../mycar/mycar'
    })
  },
  person: function () {
    wx.navigateTo({
      url: '../person/person?name=' + this.data.name + '&&phone=' + this.data.phone + '&&grade=' + this.data.grade + '&&imgurl=' + this.data.imgurl + '&&sex=' + this.data.sex + '&&birthday=' + this.data.birthday
    })
  },
  account_info: function () {
    wx.navigateTo({
      url: '../account_info/account_info'
    })
  },
  help: function () {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  //此处实现页面刷新
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  loginOut: function () {
    var openId = this.data.openId
    wx.request({
      url: getApp().data.url +'/ws/business/loginOut',
      method: 'POST',
      data: { "params": { "openId": openId } },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        wx.redirectTo({
          url: '../index/login'
        })

      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (data) {
        // console.log(data)
      }
    })
  },
  call_phone: function () {
    wx.makePhoneCall({
      phoneNumber: '400-009-0906' //仅为示例，并非真实的电话号码
    })
  },
  onLoad: function (options) {
    if (getApp().data.memberId == '') {
      wx.redirectTo({
        url: '../loading/loading?num=3',
      })
    } else {
      var that = this;
      // 获取头像
      wx.getUserInfo({
        success: function (res) {
          console.log(res.userInfo.gender)
          console.log(res.userInfo.avatarUrl)
          that.setData({
            imgurl: res.userInfo.avatarUrl,
            gender: res.userInfo.gender
          })
        }
      })
      // 获取openid
      var that = this;
      wx.login({
        success: function (loginCode) {
          var appid = 'wxc34b2effd8c3f0a4'; //填写微信小程序appid  
          var secret = '1f9a3583744c12dbcd53af9b843a356d'; //填写微信小程序secret  
          //调用request请求api转换登录凭证  
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data.openid) //获取openid  
              console.log("获取openid成功")
              that.setData({
                openId: res.data.openid
              })
            }
          })
        }
      }),
        // 获取余额
        wx.request({
        url: getApp().data.url +'/ws/business/myWalletQry',
          method: 'POST',
          data: { "params": { "memberId": getApp().data.memberId } },
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              balance: res.data.object.balance
            })
          },
          fail: function (err) {
            console.log(err)
          },
          complete: function (data) {
            // console.log(data)
          }
        }),
        // 获取用户信息
        wx.request({
        url: getApp().data.url +'/ws/business/userInfoQry',
          method: 'POST',
          data: { "params": { "memberId": getApp().data.memberId } },
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              name: res.data.object.name,
              phone: res.data.object.phone,
              grade: res.data.object.grade,
              sex: res.data.object.sex,
              birthday: res.data.object.birthday
            })
          },
          fail: function (err) {
            console.log(err)
          },
          complete: function (data) {
            // console.log(data)
          }
        });
    }

  }
})