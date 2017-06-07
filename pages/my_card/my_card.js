// pages/my_card/my_card.js
var memberId = getApp().data.memberId;
Page({
  data: {
    item: []
  },
  showMap: function (e) {
    console.log(e)
    var lat = e.currentTarget.dataset.stlatitude;
    var lon = e.currentTarget.dataset.stlongitude;
    console.log(lat)
    console.log(lon)
    this.setData({
      lat:lat,
      lon:lon
    })
    wx.openLocation({
      latitude: this.data.lat,
      longitude: this.data.lon,
      scale: 28
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/myCardBagQry',
      data: { "params": { "memberId": getApp().data.memberId } },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        console.log(res.data.object.cardList);
        that.setData({
          item: res.data.object.cardList,
          length: res.data.object.cardList.length
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