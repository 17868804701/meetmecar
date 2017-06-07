// pages/car_service/car_service.js
Page({
  data: {
    latitude: '',
    longitude: '',
    address: '',
    country: '',
    address: '',
    formatted_address: '',
    item: [],
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
          url: getApp().data.url + '/ws/business/changeShopQry',
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

  },
  onReady: function () {
    // 页面渲染完成
    if (getApp().data.memberId == '') {
      wx.redirectTo({
        url: '../loading/loading',
      })
    } else {
      var that = this;
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          console.log(latitude)
          console.log(longitude)
          that.setData({
            lat: latitude,
            lon: longitude
          })
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1?key=QEPBZ-LQHW4-476UC-X7WAY-MHRT5-K7BZM&location='+res.latitude+','+res.longitude,
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
          wx.request({
            url: getApp().data.url + '/ws/business/changeShopQry',
            data: {
              "params": {
                "memberId": "111", "lat": latitude,
                "log": longitude, "stName": ""
              }
            },
            method: 'POST',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              console.log(res.data);
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
          that.setData({
            latitude: res.latitude
          })
          console.log(that.data.latitude)
        }
      })
    }
  },
  store_info: function (e) {
    console.log(e)
    var lat = e.currentTarget.dataset.st_latitude;
    var lon = e.currentTarget.dataset.st_longitude;
    var name = e.currentTarget.dataset.name;
    var address = e.currentTarget.dataset.address;
    var id = e.currentTarget.dataset.id;
    var stNotice = e.currentTarget.dataset.stnotice;
    var stBusinessHour = e.currentTarget.dataset.stbusinesshour;
    console.log(stNotice)
    console.log(stBusinessHour)
    console.log(name)
    console.log(id)
    console.log(address)
    wx.navigateTo({
      url: '../store_info/store_info?name=' + name + '&&address=' + address + '&&id=' + id + '&&lat=' + lat + '&&lon=' + lon + '&&stNotice=' + stNotice + '&&stBusinessHour=' + stBusinessHour,
    })
  },
  showmap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res.name+111111111111)
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