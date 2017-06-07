var memberId = getApp().data.memberId;
Page({
  data: {
    name: '',
    phoneNumber: '',
    star1: '☆',
    star2: '☆',
    star3: '☆',
    star4: '☆',
    star5: '★',
    str: '请点击星星评价'
  },
  tousu: function () {
    wx.navigateTo({
      url: '../tousu/tousu'
    })
  },
  click_1: function () {
    console.log("1星评价")
    if (this.data.star1 == "★") {
      this.setData({
        star5: '☆',
        star4: '☆',
        star3: '☆',
        star2: '☆',
        str: this.data.str1
      })
    } else {
      this.setData({
        star1: '★',
        str: this.data.str1
      })
    }

  },
  click_2: function () {
    console.log("2星评价")
    if (this.data.star2 == '★') {
      this.setData({
        star5: '☆',
        star4: '☆',
        star3: '☆',
        str: this.data.str2
      })
    } else {
      this.setData({
        star1: '★',
        star2: '★',
        str: this.data.str2
      })
    }
  },
  click_3: function () {
    console.log("3星评价")
    if (this.data.star3 == "★") {
      this.setData({
        star5: '☆',
        star4: '☆',
        str: this.data.str3
      })
    } else {
      this.setData({
        star1: '★',
        star2: '★',
        star3: '★',
        str: this.data.str3
      })
    }
  },
  click_4: function () {
    console.log("4星评价")
    if (this.data.star4 == '★') {
      this.setData({
        star5: '☆',
        str: this.data.str4
      })
    } else {
      this.setData({
        star1: '★',
        star2: '★',
        star3: '★',
        star4: '★',
        str: this.data.str4
      })
    }
  },
  click_5: function () {
    console.log("5星评价");
    this.setData({
      star1: '★',
      star2: '★',
      star3: '★',
      star4: '★',
      star5: '★',
      str: this.data.str5
    })
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber//仅为示例，并非真实的电话号码
    })
  },
  onLoad: function (options) {
    if (this.data.star5 == '★') {
      this.setData({
        star1: '★',
        star2: '★',
        star3: '★',
        star4: '★',
        str: '服务态度非常好'
      })
    }
    console.log(options.storeId)
    console.log(options.orderId)
    console.log(options.storename)
    console.log(options.money)
    this.setData({
      storeId: options.storeId,
      orderId: options.orderId,
      storename: options.storename,
      money: options.money
    })
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/evaluateQry',
      data: { "params": { "orderId": getApp().data.memberId, "storeId": this.data.storeId } },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        console.log(res.data.object.list[0].secondList[0].NAME)
        that.setData({
          name: res.data.object.storeName,
          phoneNumber: res.data.object.phone,
          str1: res.data.object.list[0].secondList[0].NAME,
          str2: res.data.object.list[1].secondList[0].NAME,
          str3: res.data.object.list[2].secondList[0].NAME,
          str4: res.data.object.list[3].secondList[0].NAME,
          str5: res.data.object.list[4].secondList[0].NAME,
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
  content: function (e) {
    this.data.content = e.detail.value;
    this.setData({
      content: e.detail.value
    })
    console.log(this.data.content)
  },
  assess: function () {
    var str1 = ''
    var stars = ''
    if (this.data.str == '服务态度非常好') {
      str1 = '服务态度非常好'
      stars = 5
      this.setData({
        str1: str1,
        stars: 5
      })
    }
    else if (this.data.str == '服务态度好') {
      str1 = '服务态度好'
      stars = 4
      this.setData({
        str1: str1,
        stars: 4
      })
    }
    else if (this.data.str == '服务态度非一般') {
      str1 = '服务态度一般'
      stars = 3
      this.setData({
        str1: str1,
        stars: 3
      })
    }
    else if (this.data.str == '服务态度差') {
      str1 = '服务态度差'
      stars = 2
      this.setData({
        str1: str1,
        stars: 2
      })
    }
    else if (this.data.str == '服务态度很差') {
      str1 = '服务态度很差'
      stars = 1
      this.setData({
        str1: str1,
        stars: 1
      })
    }
    console.log(str1)
    console.log(stars)
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/evaluate',
      data: { "params": { "orderId": this.data.orderId, "storeId": this.data.storeId, "stars": stars, "evalContent": str1 + ',' + this.data.content } }
      ,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.resultCode == '0000') {
          console.log(res.data);
          console.log("已经评价")
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
          wx.showToast({
            title: '感谢你的评价',
            icon: 'success'
          })
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
        // fail
        wx.showToast({
          title: '评价失败',
          icon: 'success'
        })
      },
      complete: function (res) {
        // complete
      }
    })
  }
})