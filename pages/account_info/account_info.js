// pages/account_info/account_info.js
var memberId = getApp().data.memberId;
Page({
  data:{
    item:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/accDetailQry',
      data: {"params":{"memberId":getApp().data.memberId}},
      method: 'POST',
       header:{
         "Content-Type":"application/json"
      },
      success: function(res){
        // success
        console.log(res.data);
        console.log("账户明细")
        that.setData({
          item:res.data.object.storeList,
          length:res.data.object.storeList.length
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  }
})