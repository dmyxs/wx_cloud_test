// pages/recommend/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper:[],
    swiperCurrentIndex:0,
    navH:66
  },

  onSweiperChange(e){
    this.setData({
      swiperCurrentIndex:e.detail.current
    })
  },

  onChangeDot(e){
    this.setData({
      swiperCurrentIndex:e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH:app.globalData.navHeight
    })
    const data = wx.getStorageSync('swiper') || []
    if(data.length){
      this.setData({
        swiper:data
      })
    }else{
      db.collection('carousels').get().then(res => {
        this.setData({
          swiper:res.data
        })
        wx.setStorageSync('swiper', res.data)
      })
    }
    
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