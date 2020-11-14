
const db = wx.cloud.database()
Page({
  data: {
    userInfo:null,
    authorized:false,
    avatar:'../../images/timg.jpg',
    isAdmin:false
  },

  getUserInfo(e){
    const user = e.detail.user
    if(user){
      this.setData({
        userInfo:user,
        authorized:true
      })
      this._cloudLogin(user.nickName)
    }
  },

  _cloudLogin(nickName){
    wx.cloud.callFunction({
      name:'login',
      data:{
        nickName:nickName
      }
    }).then(res => {
      const user = res.result.user[0]
      wx.setStorageSync('userInfo', {
        ...user
      })
    })
  },

  userAuthorized(){
    //getSetting可以知道用户是否授权
    wx.getSetting({
      success:data => {
        // console.log(data);
        if(data.authSetting['scope.userInfo']){
          //getUserInfo可以在用户登录后获取用户信息
          wx.getUserInfo({
            success:data => {
              // console.log(data);
              this.setData({
                userInfo:data.userInfo,
                authorized:true
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.userAuthorized()
    
    // const user = await wx.getStorageSync('userInfo') || {}
    // this.setData({
    //   userInfo:user,
    //   authorized:true
    // })
    
    
    // const user = await db.collection('users').where({
    //   _openid:'oM-3F5BBi-sp7ZL6o1tLHSsdRUJA'
    // }).get()
    // this.setData({
    //   isAdmin:user.data[0].isAdmin
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})