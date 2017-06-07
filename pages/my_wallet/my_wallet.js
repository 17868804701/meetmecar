// pages/my_wallet/my_wallet.js
var memberId = getApp().data.memberId;
Page({
  data: {
    balance: "",
    items: [],
    money: [],
    hidden: false,
    nocancel: false,
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: '',
    paySign: ''
  },
  chongzhi: function () {
    wx.navigateTo({
      url: '../chongzhi/chongzhi',
    })
  },
  my_card: function () {
    wx.navigateTo({
      url: '../my_card/my_card',
    })
  },
  order_info: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../order_info/order_info?orderId=' + orderId
    })
  },
  pingjia: function (e) {
    var storeId = e.currentTarget.dataset.storeid;
    var orderId = e.currentTarget.dataset.orderid;
    var storename = e.currentTarget.dataset.storename;
    var money = e.currentTarget.dataset.money;
    console.log(storeId)
    console.log(orderId)
    console.log(storename)
    console.log(money)
    wx.navigateTo({
      url: '../assess/assess?storeId=' + storeId + '&&orderId=' + orderId + '&&storename=' + storename + '&&money=' + money
    })
  },
  //此处实现页面刷新
  onShow: function () {
    this.onLoad();
  },
  onLoad: function (options) {
    console.log(getApp().data.memberId)
    // 如果用户登录过，并且直接访问这个页面，判断memberId为空，返回登录界面(传参数num,在登录界面根据参数跳转)，拿回memberId
    if (getApp().data.memberId == '') {
      wx.redirectTo({
        url: '../loading/loading?num=2',
      })
    } else {
      // 查询订单列表和余额
      var that = this;
      wx.request({
        url: getApp().data.url +'/ws/business/myWalletQry',
        method: 'POST',
        data: { "params": { "memberId": getApp().data.memberId} },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log(res.data);
          console.log(res.data.object.orderList);
          console.log(res.data.object.orderList.length);
          that.setData({
            balance: res.data.object.balance,
            item: res.data.object.orderList,
            length: res.data.object.orderList.length
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
  },
  // 普通订单支付
  pay: function (e) {
    // 获取当前套餐价格
    console.log(e)
    var storeId = e.currentTarget.dataset.storeid
    var money = e.currentTarget.dataset.money
    var orderId = e.currentTarget.dataset.orderid
    console.log(storeId)
    console.log(money)
    console.log(orderId)
    console.log("使用微信支付");
    // 如果余额小于当前订单价格使用微信支付，否则使用余额支付
    if (this.data.balance < money) {
      var that = this;
      // 获取微信五个参数
      wx.request({
        url: getApp().data.url +'/ws/business/wxPayQry',
        method: 'POST',
        data: { "params": { "memberId": getApp().data.memberId, "storeId": storeId, "money": money, "payType": "pay" } },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // success
          console.log(res.data);
          console.log(res.data.object.payMap.timeStamp);
          console.log(res.data.object.payMap.nonceStr)
          console.log(res.data.object.payMap.package)
          console.log(res.data.object.payMap.signType)
          console.log(res.data.object.payMap.paySign)
          that.setData({
            timeStamp: res.data.object.payMap.timeStamp,
            nonceStr: res.data.object.payMap.nonceStr,
            package: res.data.object.payMap.package,
            signType: res.data.object.payMap.signType,
            paySign: res.data.object.payMap.paySign,
          })
        },
        fail: function (res) {
          console.log(res)

        },
        complete: function (res) {

        }
      })
      wx.showModal({
        title: '温馨提示',
        content: '你的余额不足，请使用微信支付！',
        success: function (res) {
          if (res.confirm) {
            // 调用微信支付接口
            wx.requestPayment({
              'timeStamp': that.data.timeStamp,
              'nonceStr': that.data.nonceStr,
              'package': that.data.package,
              'signType': that.data.signType,
              'paySign': that.data.paySign,
              'success': function (res) {
                console.log("支付成功");
                // 支付成功修改后台数据
                wx.request({
                  url: getApp().data.url +'/ws/business/orderPay',
                  method: 'POST',
                  data: { "params": { "memberId": getApp().data.memberId, "storeId": storeId, "money": money, "orderId": orderId, "payType": "wx" } },
                  header: {
                    "Content-Type": "application/json"
                  },
                  success: function (res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success'
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                  },
                  complete: function (data) {
                    // console.log(data)
                  }
                });
              },
              'fail': function (res) {
                console.log(res)

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // 如果余额足够，直接使用余额支付
      console.log(this.data.storeid)
      wx.showModal({
        title: '余额：' + this.data.balance + '元',
        content: '确认支付订单￥' + money + '元？',
        success: function (res) {
          if (res.confirm) {
            var that = this
            wx.request({
              url: getApp().data.url +'/ws/business/orderPay',
              method: 'POST',
              data: { "params": { "memberId": getApp().data.memberId, "storeId": storeId, "money": money, "orderId": orderId, "payType": "yue" } },
              header: {
                "Content-Type": "application/json"
              },
              success: function (res) {
                wx.showToast({
                  title: '余额支付成功',
                  icon: 'success'
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
    }
  },
})