// pages/color/color.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var cs_name = options.cs_name;
    var brd_name = options.brd_name;
    this.setData({
      cs_name:cs_name,
      brd_name:brd_name
    })
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
      url: '../addcar/addcar?color='+color+'&cs_name='+this.data.cs_name+'&brd_name='+this.data.brd_name
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