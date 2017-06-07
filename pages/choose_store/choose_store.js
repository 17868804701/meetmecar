// pages/car_service/car_service.js
Page({
  data: {
    latitude: 0,
    longitude: 0,
    address: '',
    country: '',
    formatted_address: '',
    item: [],
    address: '',
    openId: ''
  },
  //此处实现页面刷新
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  search: function (e) {
    this.data.search = e.detail.value;
    console.log(this.data.search)
    this.setData({
      input: e.detail.value
    })
  },
  searchSubmit: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: getApp().data.url +'/ws/business/changeShopQry',
          data: { "params": { "memberId": "111", "lat": latitude, "log": longitude, "stName": that.data.input } },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            // success
            console.log(res.data);
            // console.log(res.data.object.stores);
            that.setData({
              item: res.data.object.stores
            })
          },
          fail: function (res) {
            // fail
          },
          complete: function (res) {
            // complete
          }
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude)
        console.log(longitude)
        wx.request({
          url: getApp().data.url +'/ws/business/changeShopQry',
          data: { "params": { "memberId": "111", "lat": latitude, "log": longitude } },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            that.setData({
              item: res.data.object.stores
            })
          },
          fail: function (res) {
            // fail
          },
          complete: function (res) {
            // complete
          }
        }),
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1?key=QEPBZ-LQHW4-476UC-X7WAY-MHRT5-K7BZM&location=' + res.latitude + ',' + res.longitude,
            method: 'GET',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              console.log(res.data)
              console.log(res.data.result.address);
              that.setData({
                address: res.data.result.address
              })
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })

      }
    })

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
            console.log(res.data.openid)
            wx.request({
              url: getApp().data.url +'/ws/business/loginCheck',
              data: { "params": { "openId": res.data.openid } },
              method: 'POST',
              header: {
                "Content-Type": "application/json"
              },
              success: function (res) {
                console.log(res.data)
                // success
                if (res.data.object.result == 'fail') {
                  wx.navigateTo({
                    url: '../index/login'
                  })
                }
                if (res.data.resultCode == '0000') {
                  getApp().data.memberId = res.data.object.memberId
                }
              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            })
          }
        })
      }
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  store_info: function (e) {
    var name = e.currentTarget.dataset.name;
    var address = e.currentTarget.dataset.address;
    var id = e.currentTarget.dataset.id;
    console.log(name)
    console.log(id)
    console.log(address)
    wx.redirectTo({
      url: '../help/help?name=' + name + '&&address=' + address + '&&id=' + id,
    })
  },
  showmap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res.name)
        console.log(res.address);
        console.log(res.latitude);
        console.log(res.longitude)
        that.setData({
          address: res.address
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })

  },
})