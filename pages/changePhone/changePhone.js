// pages/changePhone/changePhone.js
Page({
  data: {
    get_num: '获取验证码',
    openId: '',
    second: '60',
    selected: false,
    selected1: true,
    disabled: 'true'
  },
  onLoad: function (options) {
    var name = options.name;
    var sex = options.sex;
    var birthday = options.birthday;
    console.log(name)
    console.log(sex)
    console.log(birthday)
    this.setData({
      name: name,
      sex: sex,
      birthday: birthday
    })
  },
  update: function () {
    var phone = this.data.phone
    var code = this.data.code
    wx.request({
      url: getApp().data.url +'/ws/business/userInfo',
      method: 'POST',
      data: { "params": { "userMethod": "phone", "phoneNum": this.data.phone, "vcode": this.data.code, "memberId": getApp().data.memberId } },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.object.result == 'fail') {
          wx.showModal({
            title: '',
            content: '当前手机号已经被注册，如需更换手机号请联系客服',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } else if (res.data.object.result == 'success') {
          wx.showToast({
            title: '修改手机号成功',
            icon: 'success'
          })
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function(res){
              // success
            },
            fail: function(res) {
              // fail
            },
            complete: function(res) {
              // complete
            }
          })
        } else if (res.data.object.result == 'code') {
          wx.showModal({
            title: '',
            content: '验证码错误',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } else {
          wx.showModal({
            title: '',
            content: '数据异常，请联系客服',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (data) {
        // console.log(data)
      }
    });
  },
  //监听手机号输入
  listenerPhoneInput: function (e) {
    this.data.phone = e.detail.value;
    this.setData({
      phone: e.detail.value
    })
  },
  //监听验证码输入
  listenerCodeInput: function (e) {
    this.data.code = e.detail.value;
    this.setData({
      code: e.detail.value
    })
  },
  // 获取验证码
  get_phoneNumber: function (e) {
    if (this.data.phone.length < 11 || this.data.phone == '') {
      wx.showModal({
        title: '',
        content: '请输入正确的手机号',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      countdown(this);
      this.setData({
        selected: true,
        selected1: false
      })
      //发起网络请求
      wx.request({
        url: getApp().data.url +'/ws/business/phoneCodeQry/',
        method: 'POST',
        data: { "params": { "openId": '1111', "phoneNum": this.data.phone } },
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log(res.data);
        },
        fail: function (err) {
          console.log(err)
        },
        complete: function (data) {
          console.log(data)
        }
      });
    }
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
// 验证码倒计时
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}