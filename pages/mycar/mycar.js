// pages/mycar/mycar.js
var memberId = getApp().data.memberId;
Page({
  data: {
    item: [],
    statue: '',
    carId: ''
  },
  //此处实现页面刷新
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  addcar: function () {
    wx.navigateTo({
      url: '../addcar/addcar',
    })
  },
  editCar: function (e) {
    var carId = e.target.dataset.carid;
    this.setData({
      carId: e.target.dataset.carid
    })
    wx.navigateTo({
      url: '../editCar/editCar?carId=' + this.data.carId
    })
  },
  editOk: function () {
    this.setData({
      show: 'none'
    })
  },
  onLoad: function (options) {
    console.log(getApp().data.memberId)
    // 查询显示我的车辆
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/myCarsQry',
      data: { "params": { "memberId": getApp().data.memberId } },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // success
        console.log(res.data);
        console.log(res.data.object.carList);
        that.setData({
          item: res.data.object.carList
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
  delCar: function (e) {
    var that = this;
    var carId = e.target.dataset.carid;
    this.setData({
      carId: e.target.dataset.carid
    })
    wx.showModal({
      title: '提示',
      content: '确认要删除该车辆吗？',
      success: function (res) {
        if (res.confirm) {
          // 删除车辆
          wx.request({
            url: getApp().data.url +'/ws/business/car',
            data: {
              "params": {
                "memberId": getApp().data.memberId, "carId": that.data.carId, "carNo": "", "carBrdName": "", "carColor": "", "carSerial": "",
                "carModel": "", "carCc": "", "carYear": "", "carmethod": "delete"
              }
            },
            method: 'POST',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              // success
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              console.log(res.data)
              wx.redirectTo({
                url: '../mycar/mycar'
              })
              console.log("删除成功")
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
  },
  // 设置默认
  checked: function (e) {
    var that = this;
    // var statue = e.currentTarget.dataset.default;
    var carId = e.currentTarget.dataset.carid;
    console.log(e)
    // console.log("当前状态:" + statue)
    console.log(carId)
    this.setData({
      carId: e.currentTarget.dataset.carid
    })
    wx.request({
      url: getApp().data.url +'/ws/business/car',
      data: {
        "params": {
          "memberId": getApp().data.memberId, "carId": this.data.carId, "carNo": "", "carBrdName": "", "carColor": "", "carSerial": "", "carModel": "", "carCc": "", "carYear": "", "carmethod": "default"
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // success
        console.log(res.data);
        wx.redirectTo({
          url: '../mycar/mycar',
        })
      },
      fail: function (res) {
        // fail
        console.log(res.data)
      },
      complete: function (res) {
        // complete
      }
    })

  }
})