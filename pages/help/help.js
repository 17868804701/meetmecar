// pages/help/help.js
var memberId = getApp().data.memberId;
Page({
  data: {
    phone: ''
  },
  //此处实现页面刷新
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  onLoad: function (options) {
    if (getApp().data.memberId == '') {
      wx.redirectTo({
        url: '../loading/loading?num=4',
      })
    } else {
      console.log(options.name)
      console.log(options.address)
      console.log(options.id)
      this.setData({
        name: options.name,
        address: options.address,
        id: options.id
      })
      // 页面初始化 options为页面跳转所带来的参数
      var that = this;
      wx.request({
        url: getApp().data.url +'/ws/business/reliefQry',
        data: { "params": { "memberId": getApp().data.memberId, "storeId": this.data.id } },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // success
          console.log(res.data)
          console.log(res.data.object.phone)
          that.setData({
            phone: res.data.object.phone
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

  },
  choose: function () {
    wx.redirectTo({
      url: '../choose_store/choose_store'
    })
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone//仅为示例，并非真实的电话号码
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
  }
})