// miniprogram/pages/payment/index.js
Page({
  data: {

  },

  async onSwitchPayPage(e){
    wx.showLoading({
      title: '正在下单中',
    })
    const id = e.target.dataset.goodId
    try {
      const {result} = await wx.cloud.callFunction({
        name:'emall-pay',
        data:{
          type:'unifiedorder',
          data:{
            goodId:id
          }
        }
      })
  
      const data = result.data
      wx.hideLoading()
  
      wx.navigateTo({
        url: `/pages/pay-result/index?id=${data.out_trade_no}`,
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: '下单失败请重试',
        icon:'none'
      })
    }
  },


  onLoad: function (options) {

  }
})