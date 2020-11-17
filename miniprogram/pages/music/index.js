// pages/music/index.js


const BAM = wx.getBackgroundAudioManager()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    play: '../../images/player@play.png',
    stop:'../../images/player@pause.png',
    playArr:[]
  },

  

  onPaly(){
    if(!this.data.playing){
      BAM.play()
      const data = this.data.playArr[0]
      BAM.title = data.title
      BAM.singer = data.singer
      BAM.src = data.playUrl
      this.setData({
        playing:true
      })
    }else{
      BAM.pause()
      this.setData({
        playing:false
      })
    }
  },
  _monitorSwitch(){
    BAM.onPlay(() => {
      this.setData({
        playing:true
      })
    })
    BAM.onPause(() => {
      this.setData({
        playing:false
      })
    })
    BAM.onStop(() => {
      this.setData({
        playing:false
      })
    })
    BAM.onEnded(() => {
      this.setData({
        playing:false
      })
    })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = wx.getStorageSync('music') || []
    if(data.length){
      this.setData({
        playArr:data
      })
    }else{
      db.collection('music').get().then(res => {
        wx.setStorageSync('music',res.data)
        this.setData({
          playArr:res.data
        })
      })
    }
    this._monitorSwitch()
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