//index.js
//CSDN微信小程序开发专栏:http://blog.csdn.net/column/details/13721.html
//获取应用实例
var app = getApp()
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    // halfSrc:'../../images/half.png',
    key: 0,//评分
  },
  onLoad: function () {
  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    }) 
  }
})
