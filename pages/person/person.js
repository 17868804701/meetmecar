// pages/person/person.js
var memberId = getApp().data.memberId;
Page({
  data: {
    birthday: '1978-01-01',
    date: '1980-01-01',
    disabled: 'true',
    edit: '确定',
    date1: ''
  },
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(getApp().data.memberId)
    var name = options.name;
    var phone = options.phone;
    var grade = options.grade;
    var imgurl = options.imgurl;
    var sex = options.sex;
    var birthday = options.birthday;
    console.log(sex)
    console.log(birthday)
    console.log(options.imgurl)
    this.setData({
      name: name,
      phone: phone,
      grade: grade,
      imgurl: options.imgurl,
      sex: sex,
      date1: birthday
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
  },
  onShareAppMessage: function () {
    return {
      title: '微信小程序联盟',
      desc: '最具人气的小程序开发联盟!',
      path: '/pages/preson/person'
    }
  },
  store_info: function () {
    wx.navigateTo({
      url: '../store_info/store_info',
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },
  nan: function () {
    this.data.sex = '男'
  },
  nv: function () {
    this.data.sex = '女'
  },
  inputname: function (e) {
    this.data.name = e.detail.value;
  },
  edit: function () {
    this.setData({
      disabled: 'false',
    })
    wx.request({
      url: getApp().data.url +'/ws/business/userInfo',
      method: 'POST',
      data: { "params": { "userMethod": "userInfo", "phoneNum": this.data.phone, "birthday": this.data.date1, "sex": this.data.sex, "name": this.data.name, "memberId": getApp().data.memberId } },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        wx.showToast({
          title: '修改信息成功',
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
        // console.log(data)
      }
    });

  },
  changePhone: function () {
    wx.navigateTo({
      url: '../changePhone/changePhone?name=' + this.data.name + '&&sex=' + this.data.sex + '&&birthday=' + this.data.birthday
    })
  }
})