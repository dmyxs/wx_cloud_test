// miniprogram/pages/npm-ui/index.js

// ['周一','周二','周三','周四','周五']

const citys = {
  week: ['周一','周二','周三','周四','周五'],
  1: ['上午', '下午', '晚上'],
  time: ['09:00 - 10:00','10:30 - 11:30','14:00 - 15:00','15:30 - 16:30','19:00 - 20:00','20:30 - 21:30']
}

Page({
  // options: {
  //   styleIsolation: 'shared',
  // },
  /**
   * 页面的初始数据
   */
  externalClasses:['tag-class'],
  data: {
    active:0,
    imageURL:'../../images/lunbotu1.jpg',
    activeKey:0,
    items:['家电','美食','服饰'],
    mainActiveIndex:0,
    date: '',
    show: false,
    maxDate:Date.now() + 86400000 * 90,
    columns: [
      {
        values: citys['week'],
        className: 'column1',
        defaultIndex: 0,
      },
      {
        values: citys['time'],
        className: 'column2',
        defaultIndex: 0,
      },
    ],
    steps: [
      {
        text: '步骤一',
      },
      {
        text: '步骤二',
      },
      {
        text: '步骤三',
      },
      {
        text: '步骤四',
      },
    ],
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });
  },
  onChange(event) {
    const { value } = event.detail;
    console.log(value)
    console.log(value[0] + value[1]);
    
    // picker.setColumnValues(1, citys[value[0]]);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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