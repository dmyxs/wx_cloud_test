// //index.js

Page({
  data: {
    name: '李涛',
    todos: ['吃饭', '睡觉', '写代码'],
    val: '',
    showImg:false,
    img:'../../image/time.png',
    imgActive:'../../image/time_active.png',
    

  },
  // handleInput(e) {
  //   this.setData({
  //     val: e.detail.value
  //   })
  // },
  addTodo() {
    this.setData({
      val: '',
      todos: [...this.data.todos, this.data.val]
    })
  },
 
  getLocation(){
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res);
        var latitude = res.latitude // 纬度
        var longitude = res.longitude // 经度
      }
    })
  },

  getsendCode(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },

  onSwitch(){
    this.setData({
      showImg:!this.data.showImg
    })
  },

  pause(){
    this.setData({
      showImg:!this.data.showImg
    })
  },

  

  // onLoad() {
  //   this.setData({
  //     nbTitle: '新标题',
  //     nbLoading: false,
  //     nbFrontColor: '#ffffff',
  //     nbBackgroundColor: '#000000',
  //   })
  // }
})




// //获取应用实例
// const app = getApp()

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })
