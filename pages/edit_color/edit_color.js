// pages/color/color.js
Page({
  data: {},
  onLoad: function (options) {
    var carId = options.carId;
    var carNo = options.carNo;
    var brd_name = options.brd_name
    var cs_name = options.cs_name
    console.log(carNo)
    console.log(brd_name)
    console.log(cs_name)
    this.setData({
      carNo:carNo,
      carId:carId,
      brd_name:brd_name,
      cs_name:cs_name
    })
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/carBrand',
      data: { "params": { "brandMethod": "color" } },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data.object.list)
        that.setData({
          color:res.data.object.list
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
  addcar:function(e){
    console.log(e)
    var color = e.currentTarget.dataset.cs_name;
    console.log(color)
    wx.redirectTo({
      url: '../editCar_ok/editCar_ok?color='+color+'&&carNo='+this.data.carNo+'&&cs_name='+this.data.cs_name+'&&brd_name='+this.data.brd_name+'&&carId='+this.data.carId
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