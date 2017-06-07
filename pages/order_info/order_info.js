// pages/order_info/order_info.js
var memberId = getApp().data.memberId;
Page({
  data:{},
  tousu:function(){
    wx.navigateTo({
      url: '../tousu/tousu?orderId='+this.data.orderId
    })
  },
  onLoad:function(options){
    console.log(options.orderId)
    this.setData({
      orderId:options.orderId
    })
    // 页面初始化 options为页面跳转所带来的参数
        var that = this;
      wx.request({
        url: getApp().data.url+'/ws/business/orderDetailQry',
        data: { "params": { "orderId": this.data.orderId}},
        method: 'POST', 
         header:{
            "Content-Type":"application/json"
            },
        success: function(res){
          // success
         console.log(res.data);
         console.log(res.data.object.sgBeginList);
        var  beginLength = res.data.object.sgBeginList.length;
        var endLength = res.data.object.sgEndList.length;
         that.setData({
           orderTime:res.data.object.orderTime,
           storeName:res.data.object.storeName,
           item:res.data.object.srvItems,
           status:res.data.object.status,
           totalCost:res.data.object.totalCost,
           orderNo:res.data.object.orderNo,
           payWay:res.data.object.payWay,
           sgBeginList: res.data.object.sgBeginList,
           sgEndList: res.data.object.sgEndList,
           beginLength: res.data.object.sgBeginList.length,
           endLength:res.data.object.sgEndList.length
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