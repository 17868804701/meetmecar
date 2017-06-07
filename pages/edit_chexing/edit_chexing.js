// pages/search/search.js
//定义索引字母数组
var indexArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var y = 0;
//获取touchstart字母数组角标
function getArrIndex(english) {
  // console.log(Page)
  for (var x = 0; x < indexArr.length; x++) {
    if (english == indexArr[x]) {
      return x;
    }
  }
}
//num 移动了多少位 index 当前字母,返回当前触摸位置节点的字母
function getArrEnglish(num, index) {
  var english = indexArr[index + num];
  if (!(1 > num + index > 26)) {
    return english;
  } else {
    return AAA;
  }
}
Page({
  data: {
    rightShow: false,
    dropShow: false,
    indexShow: false,
    toView: "e",
    scrollTop: 1000,
    indexId: "",
    indexy: "",
    indexEnglish: "",
    arrId: indexArr,
    userInfo: "这是一条数据"
  },
  touchstart: function (e) {
    this.setData({
      indexId: e.target.id,
      toView: e.target.id.toLowerCase(),
      indexy: e.touches[0].pageY,
      indexShow: true,
      indexEnglish: e.target.id
    })
  },
  touchmove: function (e) {
    y = getArrIndex(e.target.id);
    var indexY = e.touches[0].pageY;
    if (getArrEnglish(Math.round((indexY - this.data.indexy) / 15), y)) {
      this.setData({
        toView: getArrEnglish(Math.round((indexY - this.data.indexy) / 15), y).toLowerCase(),
        indexEnglish: getArrEnglish(Math.round((indexY - this.data.indexy) / 15), y)
      })
    }
  },
  touchend: function (e) {
    this.setData({
      indexShow: false
    })
  },
  addcar:function(e){
    var cs_name = e.currentTarget.dataset.cs_name
    console.log(cs_name)
    wx.redirectTo({
      url: '../editCar_ok/editCar_ok?cs_name='+cs_name+'&&brd_name='+this.data.brd_name+'&&color='+this.data.color+'&&carNo='+this.data.carNo+'&&carId='+this.data.carId
    })
  },
  onLoad: function (options) {
    // 接受上个页面数据
    var carNo = options.carNo
    var color = options.color
    var brd_id = options.brd_id
    var brd_name = options.brd_name
    var carId = options.carId
    console.log(brd_id)
    console.log(brd_name)
    this.setData({
      brd_id: options.brd_id,
      carId:carId,
      brd_name: options.brd_name,
      color:color,
      carNo:carNo
    })
    var that = this;
    wx.request({
      url: getApp().data.url +'/ws/business/carBrand',
      data: { "params": { "brandMethod": "seriesFl", "brdId": this.data.brd_id} },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.object.list)
        that.setData({
          item: res.data.object.list
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          indexTop: res.windowHeight / 2 - 200
        });
      }
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