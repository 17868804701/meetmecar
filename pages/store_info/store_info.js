var memberId = getApp().data.memberId;
Page({
  data: {
    selected: true,
    selected1: false,
    balance: '',
    content: '1111',
    hidden: false,
    nocancel: false,
    active: 'active',
    toView: 'green',
    scrollTop: 2000,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected3: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected2: false,
      selected3: false,
      selected1: true
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected3: false,
      selected2: true
    })
  },
  selected3: function (e) {
    this.setData({
      selected2: false,
      selected1: false,
      selected: false,
      selected3: true
    })
  },
  tabFun: function (e) {
    this.setData({
      active: ''
    })
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.fyid;
    console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  tabFun_service: function (e) {
    this.setData({
      active: ''
    })
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.fyid;
    console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  showMap: function () {
    var lat = parseFloat(this.data.lat)
    var lon = parseFloat(this.data.lon)
    wx.openLocation({
      latitude: lat,
      longitude: lon,
      scale: 28
    })
  },
  show: function (e) {
    console.log(e.currentTarget.dataset.text)
    wx.showModal({
      title: '套餐内容',
      content: e.currentTarget.dataset.text,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  // 购买套餐
  buy: function (e) {
    // 获取当前套餐价格
    var price = e.currentTarget.dataset.value
    var id = e.currentTarget.dataset.id
    // 打印当前点击的价格
    console.log(price);
    console.log(id)
    console.log("使用微信支付");
    // 如果余额小于当前订单价格使用微信支付，否则使用余额支付
    var storeId = this.data.storeid;
    console.log(storeId)
    if (this.data.balance < price) {
      var that = this;
      // 获取微信五个参数
      wx.request({
        url: getApp().data.url +'/ws/business/wxPayQry',
        method: 'POST',
        data: { "params": { "memberId": getApp().data.memberId, "storeId": storeId, "money": price, "payType": "pay" } },
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
                  url: getApp().data.url +'/ws/business/totalPay',
                  method: 'POST',
                  data: { "params": { "memberId": getApp().data.memberId, "storeId": storeId, "money": price, "srvItems": id, "payType": "wx" } },
                  header: {
                    "Content-Type": "application/json"
                  },
                  success: function (res) {
                    // success
                    console.log(res.data);
                  },
                  fail: function (res) {
                    // fail
                  },
                  complete: function (res) {
                    // complete
                  }
                })
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
        content: '确认支付订单￥' + price + '元？',
        success: function (res) {
          if (res.confirm) {
            var that = this
            wx.request({
              url: getApp().data.url +'/ws/business/totalPay',
              method: 'POST',
              data: { "params": { "memberId": getApp().data.memberId, "storeId": storeId, "money": price, "srvItems": id, "payType": "yue" } }
              ,
              header: {
                "Content-Type": "application/json"
              },
              success: function (res) {
                // success
                console.log(res.data);
                console.log(id)
                wx.showToast({
                  title: '余额支付成功',
                  icon: 'success'
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
        }
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      name: options.name,
      address: options.address,
      storeid: options.id,
      lat: options.lat,
      lon: options.lon,
      stNotice: options.stNotice,
      stBusinessHour: options.stBusinessHour
    })
    console.log(options.name)
    console.log(options.address)
    console.log(options.id)
    var that = this;
    // 套餐查询
    wx.request({
      url: getApp().data.url +'/ws/business/shopServiceQry',
      data: { "params": { "storeId": this.data.storeid } },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // success
        console.log("查询套餐")
        console.log(res.data);
        console.log(res.data.object.srvItems);
        var str = '';
        for (var i = 0; i < res.data.object.srvItems.length; i++) {
          for (var j = 0; j < res.data.object.srvItems[i].childBus.length; j++) {
            str += (res.data.object.srvItems[i].childBus[j].stb_name + ' x' + res.data.object.srvItems[i].childBus[j].stdb_amount) + ','
          }
        }
        str = str.substring(0, str.length - 1)
        that.setData({
          item1: res.data.object.srvItems,
          str: str
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    }),
      // 查询所有商品
      wx.request({
      url: getApp().data.url +'/ws/business/goodsQry',
        data: { "params": { "storeId": this.data.storeid } },//23
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // success
          console.log("查询所有商品")
          console.log(res.data);
          console.log(res.data.object.map)
          that.setData({
            item3: res.data.object.map
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      }),
      // 查询所有服务
      wx.request({
      url: getApp().data.url +'/ws/business/bussQry',
        data: { "params": { "storeId": this.data.storeid } },//25
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // success
          console.log("查询所有服务")
          console.log(res.data);
          console.log(res.data.object.map)
          // console.log(res.data.object.map[0].storeBussiness)
          that.setData({
            item2: res.data.object.map,
            // item4:res.data.object.storeBussiness
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      }),
      // 门店的评价
      wx.request({
      url: getApp().data.url +'/ws/business/storeEvaQry',
        data: { "params": { "storeId": this.data.storeid } },//35
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // success
          console.log("查询门店评价")
          console.log(res.data);
          console.log(res.data.object.storeEvaluate)
          that.setData({
            assess: res.data.object.storeEvaluate
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      }),
      // 查询余额
      wx.request({
      url: getApp().data.url +'/ws/business/myWalletQry',
        method: 'POST',
        data: { "params": { "memberId": getApp().data.memberId } },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log("查詢餘額")
          console.log(res.data);
          console.log(res.data.object.balance);
          that.setData({
            balance: res.data.object.balance,
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
})