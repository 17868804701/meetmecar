var memberId = getApp().data.memberId;
Page({
  data: {
    areaIndex: 0,
    area: [],
    phoneNumber: '',
    str: ''
  },
  bindPickerChange: function (e) {
    this.setData({
      areaIndex: e.detail.value
    })
  },
  call_phone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber//仅为示例，并非真实的电话号码
    })
  },
  onLoad: function (options) {
    console.log(options.orderId)
    this.setData({
      orderId: options.orderId
    })
    // 页面初始化 options为页面跳转所带来的参数
    //发起网络请求
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/complaintQry',
      method: 'POST',
      data: { "params": { "orderId": this.data.orderId, "memberId": getApp().data.memberId } },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        //   console.log(res.data.object.questions);
        // console.log(this.data.area[areaIndex])
        that.setData({
          area: res.data.object.questions,
          phoneNumber: res.data.object.phone
        })
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (data) {
        console.log(data)
      }
    });
  },
  bindPickerChange: function (e) {
    var index = e.detail.value
    if (index == 0) {
      this.setData({
        str: '服务态度不好'
      })
    }
    if (index == 1) {
      this.setData({
        str: '收费太高了'
      })
    }
    if (index == 3) {
      this.setData({
        str: '师傅技术太差'
      })
    }
  },
  primary: function () {
    console.log(this.data.str)
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/complaint',
      method: 'POST',
      data: { "params": { "comTitle": that.data.str, "memberId": getApp().data.memberId } },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: '投诉成功',
          icon: 'success'
        })
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (data) {
        console.log(data)
      }
    });
  }

})  