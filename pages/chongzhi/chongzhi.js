var memberId = getApp().data.memberId;
Page({
  data: {
    items: [{ price: 100 }, { price: 200 }, { price: 500 }, { price: 1000 }, { price: 2000 }, { price: 3000 }, { price: 5000 }, { price: 8000 }, { price: 10000 }],
    balance: '',
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: '',
    paySign: '',
    value: ''
  },
  //监听余额输入
  balance: function (e) {
    this.data.balance = e.detail.value;
    this.setData({
      value: e.detail.value
    })
  },
  //此处实现页面刷新
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  onLoad: function (options) {
    // 获取余额
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/chargeQry',
      data: { "params": { "memberId": getApp().data.memberId } },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // success
        // console.log(res.data.object.balance);
        that.setData({
          price: res.data.object.balance
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
  btn: function (e) {
    var price = e.currentTarget.dataset.price
    // console.log(price)
    this.setData({
      value: price
    })
  },
  pay: function () {
    console.log("调用微信支付");
    var that = this;
    // 获取微信五个参数
    wx.request({
      url: getApp().data.url +'/ws/business/wxPayQry',
      method: 'POST',
      data: { "params": { "memberId": getApp().data.memberId, "storeId": "36", "money": this.data.value, "payType": "pay" } },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // success
        // console.log(res.data);
        // console.log(res.data.object.payMap.timeStamp);
        // console.log(res.data.object.payMap.nonceStr)
        // console.log(res.data.object.payMap.package)
        // console.log(res.data.object.payMap.signType)
        // console.log(res.data.object.payMap.paySign)
        that.setData({
          timeStamp: res.data.object.payMap.timeStamp,
          nonceStr: res.data.object.payMap.nonceStr,
          package: res.data.object.payMap.package,
          signType: res.data.object.payMap.signType,
          paySign: res.data.object.payMap.paySign,
        })

      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
    // console.log(this.data.balance)

    if (this.data.value == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请选择充值的金额'
      })
    }
    else if (parseInt(this.data.value) + parseInt(this.data.price) > 100000) {
      console.log(parseInt(this.data.value) + parseInt(this.data.price))
      wx.showModal({
        title: '温馨提示',
        content: '亲，为了您的账户安全，您的账户总余额不能超过10万，请重新输入'
      })
    }
    else {
      wx.showModal({
        title: '温馨提示',
        content: '确认充值' + this.data.value + '元吗？',
        success: function (res) {
          if (res.confirm) {
            wx.requestPayment({
              'timeStamp': that.data.timeStamp,
              'nonceStr': that.data.nonceStr,
              'package': that.data.package,
              'signType': that.data.signType,
              'paySign': that.data.paySign,
              'success': function (res) {
                console.log("支付成功");
                // 充值成功修改后台数据
                wx.request({
                  url: getApp().data.url +'/ws/business/totalCharge',
                  data: { "params": { "memberId": getApp().data.memberId, "money": that.data.value } },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/json"
                  },
                  success: function (res) {
                    // success
                    console.log(res.data)
                    console.log("充值完成，修改数据完成")
                    wx.showToast({
                      title: '充值成功',
                      icon: 'success'
                    })
                    wx.navigateBack({
                      delta: 1, // 回退前 delta(默认为1) 页面
                    })
                  },
                  fail: function (res) {
                    // fail
                    console.log(res.data)
                    wx.showModal({
                      title: '',
                      content: '充值失败',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    })
                  },
                  complete: function (res) {
                    // complete
                  }
                })
              },
              'fail': function (res) {
                console.log(res)
              },
              'complete': function (res) {
                // complete
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
})