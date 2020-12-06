// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    styleIsolation: 'apply-shared',
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e){
      this.setData({
        keyword:e.detail.value
      })
    },
    onSearch(){
      if(!this.data.keyword){
        wx.showToast({
          title: '请输入搜索关键词',
          icon:'none'
        })
        return
      }
      this.triggerEvent('search', {
        keyword:this.data.keyword
      })

      this.setData({
        keyword:''
      })
    }
  }
})
