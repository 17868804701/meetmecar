var memberId = getApp().data.memberId;
Page({
  data: {
    item: []
  },
  order_info: function (e) {
    console.log(e.currentTarget.dataset.orderid)
    this.setData({
      orderId:e.currentTarget.dataset.orderid
    })
    wx.navigateTo({
      url: '../order_info/order_info?orderId='+this.data.orderId
    })
  },
  pingjia: function (e) {
    var storeId = e.currentTarget.dataset.storeid;
    var orderId = e.currentTarget.dataset.orderid;
    var storename = e.currentTarget.dataset.storename;
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '../assess/assess?storeId=' + storeId + '&&orderId=' + orderId + '&&storename=' + storename + '&&money=' + money
    })
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/myOrderQry',
      data: { "params": { "memberId": getApp().data.memberId} },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // success
        console.log(res.data);
        console.log(res.data.object.orderList);
        that.setData({
          item: res.data.object.orderList,
          length:res.data.object.orderList.length
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