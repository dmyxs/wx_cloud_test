Page({
  data: {
    longitude:113.8374464468668,
    latitude:22.76773794505824
  },
  regionchange(e){
    // console.log(e);
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation(){
    this.mapCtx.getCenterLocation({
      success: (res) => {
        this.setData({
          longitude:res.longitude,
          latitude:res.latitude
        })
        wx.getLocation({
          altitude: this.data.latitude,
          longitude:this.data.longitude
        })
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:this.data.latitude,
        longitude:this.data.longitude,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding:[10],
      points:[{
        longitude:this.data.longitude,
        latitude:this.data.latitude
      }]
    })
  }
})