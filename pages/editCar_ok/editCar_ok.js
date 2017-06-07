// pages/editCar/editCar.js
var memberId = getApp().data.memberId;
Page({
  data: {
    carNo: '',
    carBrdName: '',
    carSerial: '',
    carColor: '',
    carId: ''
  },
  listenerCarNoInput: function (e) {
    this.data.carNo = e.detail.value.toUpperCase(e.detail.value);
  },
  onLoad: function (options) {
    var carId = options.carId
    var carNo = options.carNo
    var color = options.color
    var cs_name = options.cs_name
    var brd_name = options.brd_name
    console.log(color)
    this.setData({
      carId: carId,
      color: color,
      cs_name: cs_name,
      brd_name: brd_name,
      carNo: carNo
    })
  },
  // 修改车辆信息
  updateOk: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要修改该车辆吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.url +'/ws/business/car',
            data: {
              "params": {
                "memberId": getApp().data.memberId, "carId": that.data.carId, "carNo": that.data.carNo, "carBrdName": that.data.brd_name, "carColor": that.data.color, "carSerial": that.data.cs_name,
                "carModel": "333", "carCc": "11111", "carYear": "2015年", "carmethod": "update"
              }
            },
            method: 'POST',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              // success
              wx.showToast({
                title: '修改车辆成功',
                icon: 'success'
              })
              console.log(res.data);
              wx.redirectTo({
                url: '../mycar/mycar'
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

  },
  edit_color: function () {
    wx.redirectTo({
      url: '../edit_color/edit_color?carNo=' + this.data.carNo + '&&brd_name=' + this.data.brd_name + '&&cs_name=' + this.data.cs_name + '&&carId=' + this.data.carId
    })
  },
  edit_choose: function () {
    wx.redirectTo({
      url: '../edit_search/edit_search?carNo=' + this.data.carNo + '&&color=' + this.data.color + '&&carId=' + this.data.carId
    })

  }
})




















