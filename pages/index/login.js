Page({
  data: {
    tip: '',
    phone: '',
    code: '',
    nickName: '',
    sex: '',
    get_num: '获取验证码',
    openId: '',
    second: '60',
    selected: false,
    selected1: true,
    disabled: 'true'
  },
  onLoad: function (options) {
    this.data.num = options.num;
    this.setData({
      num: options.num
    })
    var that = this;
    // 登录判断
    wx.login({
      success: function (loginCode) {
        var appid = 'wxc34b2effd8c3f0a4'; //填写微信小程序appid  
        var secret = '1f9a3583744c12dbcd53af9b843a356d'; //填写微信小程序secret  
        //调用request请求api转换登录凭证  获取opendid
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.openid)
            console.log("获取openid成功")
            getApp().data.openId = res.data.openid
            that.setData({
              opendid: res.data.openid
            })
            // 判断opendid是否存在
            wx.request({
              url: getApp().data.url +'/ws/business/loginCheck',
              data: { "params": { "openId": res.data.openid } },
              method: 'POST',
              header: {
                "Content-Type": "application/json"
              },
              success: function (res) {
                console.log(res.data)
                // success
                if (res.data.resultCode == '0000') {
                  if (res.data.object.result == 'fail') {

                  }
                  if (res.data.object.result == 'success') {
                    getApp().data.memberId = res.data.object.memberId
                    if (that.data.num == '2') {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.switchTab({
                        url: '../my_wallet/my_wallet'
                      })
                    }
                    else if (that.data.num == '3') {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.switchTab({
                        url: '../vip_center/vip_center'
                      })

                    } else if (that.data.num == '4') {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.redirectTo({
                        url: '../help/help'
                      })
                    } else {
                      wx.showToast({
                        title: '正在跳转',
                        icon: 'loading'
                      })
                      wx.switchTab({
                        url: '../car_service/car_service'
                      })
                    }
                  }
                } else {
                  wx.showModal({
                    title: '',
                    content: '系统正在维护，请稍后再试',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                  })
                }
              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            })
          }
        })
      }
    })
    wx.getUserInfo({
      success: function (res) {
        // success
        var nickName = res.userInfo.nickName;
        var sex = res.userInfo.gender;
        console.log(sex)
        if (sex == 1) {
          sex = "男";
        } else if (sex == 2) {
          sex = "女";
        } else if (sex == 0) {
          sex = "未知";
        }

        that.setData({
          sex: sex,
          nickName: nickName
        })
      }
    })
  },
  //监听手机号输入
  listenerPhoneInput: function (e) {
    this.data.phone = e.detail.value;
    if (this.data.phone.length == 11) {
      wx.hideKeyboard()
    }
  },
  //监听验证码输入
  listenerPasswordInput: function (e) {
    this.data.code = e.detail.value;
    if (this.data.code.length == 6) {
      wx.hideKeyboard()
    }
  },
  // 获取验证码
  get_phoneNumber: function (e) {
    console.log(this.data.opendid)
    var phone = this.data.phone;
    console.log(phone.length);
    if (phone.length < 11) {
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
        data: { "params": { "openId": getApp().data.openId, "phoneNum": phone } },
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
  // 登录
  login: function (e) {
    console.log(getApp().data.openId)
    var phone = this.data.phone;
    var code = this.data.code;
    console.log(phone);
    console.log(code);
    console.log(this.data.sex);
    console.log(this.data.nickName);

    var that = this;
    // 登录验证
    if (phone == "" || code == '') {
      wx.showModal({
        title: '',
        content: '手机号或验证码不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.request({
        url: getApp().data.url +'/ws/business/login',
        method: 'POST',
        data: {
          "params": { "openId": getApp().data.openId, "phoneNum": phone, "vcode": code, "sex": this.data.sex, "name": this.data.nickName }
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          // 判断验证码状态

          if (res.data.resultCode == '0000') {
            var login = res.data.object.result;


            if (login == "success") {
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              })
              // 将获取的memberId赋值给全局变量

              getApp().data.memberId = res.data.object.memberId;
              if (that.data.num == '2') {
                wx.showToast({
                  title: '登录成功，正在跳转',
                  icon: 'loading'
                })
                wx.switchTab({
                  url: '../my_wallet/my_wallet'
                })
              }
              else if (that.data.num == '3') {
                wx.showToast({
                  title: '登录成功，正在跳转',
                  icon: 'loading'
                })
                wx.switchTab({
                  url: '../vip_center/vip_center'
                })
              } else if (that.data.num == '4') {
                wx.showToast({
                  title: '登录成功，正在跳转',
                  icon: 'loading'
                })
                wx.redirectTo({
                  url: '../help/help'
                })
              } else {
                wx.showToast({
                  title: '登录成功，正在跳转',
                  icon: 'loading'
                })
                wx.switchTab({
                  url: '../car_service/car_service'
                })
              }

            } else {
              wx.showModal({
                title: '',
                content: '手机号与验证码不匹配，重新输入',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          } else {
            wx.showModal({
              title: '',
              content: '系统正在维护，请稍后再试',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        }
      })
    }
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

















