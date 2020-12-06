// miniprogram/pages/category/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryArr:[],
    categoryIndex:0,
    goods:[],
  },

  onSwitch(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      categoryIndex:index
    },() => {
      this._requestFoodsByCategory()
    })
  },

  onSwitchDetail(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shopping-detail/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._requestCategoryData()
  },

  _requestCategoryData(){
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection('category').get().then(res => {
      this.setData({
        categoryArr:res.data
      }, () => {
        this._requestFoodsByCategory()
        wx.hideLoading()
      })
    })
  },

  _requestFoodsByCategory(){
    wx.showLoading({
      title: '数据加载中',
    })
    const index = this.data.categoryIndex
    const id = this.data.categoryArr[index]._id
    db.collection('goods').where({
      category:id
    }).get().then(res => {
      this.setData({
        goods:res.data
      },() => {
        wx.hideLoading()
      })
    })
    
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