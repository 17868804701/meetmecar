var memberId = getApp().data.memberId;
Page({
  data: {
    carNo: '',
    carBrdName: '',
    carColor: '',
    carYear: '',
    brd_name: '',
    csc_name: '',
    cs_name: ''
  },
  listenerCarNoInput: function (e) {
    this.data.carNo = e.detail.value.toUpperCase(e.detail.value);
  },
  listenerCarBraNameInput: function (e) {
    this.data.carBrdName = e.detail.value;
  },
  listenerCarColorInput: function (e) {
    this.data.carColor = e.detail.value;
  },
  listenerCarYearInput: function (e) {
    this.data.carYear = e.detail.value;
  },
  onLoad: function (options) {
    var color = options.color
    var csc_name = options.csc_name1
    var brd_name = options.brd_name
    var cs_name = options.cs_name
    console.log(color)
    console.log(csc_name)
    console.log(brd_name)
    console.log(cs_name)
    this.setData({
      csc_name: csc_name,
      brd_name: brd_name,
      cs_name: cs_name,
      color: color
    })
  },
  choose: function () {
    wx.redirectTo({
      url: '../search/search?color=' + this.data.color
    })
  },
  add: function (options) {
    var that = this;
    if (this.data.carNo == "") {
      wx.showToast({
        title: '添加失败',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.request({
        url: getApp().data.url +'/ws/business/car',
        data: {
          "params": {
            "memberId": getApp().data.memberId, "carNo": this.data.carNo, "carBrdName": this.data.brd_name, "carColor": this.data.color, "carSerial": this.data.cs_name,
            "carModel": this.data.csc_name, "carCc": "3L", "carYear": "2010-02-09", "carmethod": "save"
          }
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          // success

          if (res.data.resultCode == '0000') {
            console.log(res.data);
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            })
            wx.redirectTo({
              url: '../mycar/mycar'
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
        },
        complete: function (res) {
          // complete
        }
      })
    }
  },
  color: function () {
    wx.redirectTo({
      url: '../color/color?brd_name=' + this.data.brd_name + '&cs_name=' + this.data.cs_name
    })
  }
})