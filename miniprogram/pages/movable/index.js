Page({
data: {
  list: [
    {
      groupId: 1,
      isTouchMove: true, 
    },
    {
      groupId: 2,
      isTouchMove: false,
    },
    {
      groupId: 3,
      isTouchMove: false,
    },
  ],
  startX: 0, //开始x坐标
  startY: 0, //开始y坐标
},


//手指触摸动作开始 记录起点X坐标
touchstart: function(e) {
  console.log(e);
  //开始触摸时 重置所有删除
  this.data.list.forEach((v, i) => {
    //只操作为true的
    if (v.isTouchMove) {
      v.isTouchMove = false;
    }
  })

  this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    list: this.data.list
  })
},


//滑动事件处理,一次只能滑出一个删除按钮
touchmove: function(e) {
  var that = this,
    index = e.currentTarget.dataset.index,  //当前索引
    startX = that.data.startX,  //开始X坐标
    startY = that.data.startY,  //开始Y坐标
    touchMoveX = e.changedTouches[0].clientX, //滑动变化X坐标
    touchMoveY = e.changedTouches[0].clientY, //滑动变化Y坐标
    //获取滑动角度
    angle = that.angle({
      X: startX,
      Y: startY
    }, {
      X: touchMoveX,
      Y: touchMoveY
    });
  that.data.list.forEach(function(v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) {
      return;
    }
    if (i == index) {
      if (touchMoveX > startX) {  //右滑
        v.isTouchMove = false
      } else {  //左滑
        v.isTouchMove = true
      }
    }
  })
  that.setData({
    list: that.data.list
  })
},

    /**
 * 计算滑动角度
 * start 起点坐标
 * end 终点坐标
　　* Math.PI 表示一个圆的周长与直径的比例，约为 3.14159;PI就是圆周率π，PI是弧度制的π,也就是180°
 */
angle: function(start, end) {
  let _X = end.X - start.X;
  let _Y = end.Y - start.Y
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
},

del(e) {
  var id = e.currentTarget.dataset.idx;
　let _list = this.data.list;
  wx.showModal({
    title: '提示',
    content: '确定删除该考勤组吗？',
    confirmColor: "#f16765",
    success: res => {
      if (res.confirm) {
        this.touchstart(e);
　　　　  _list.splice(id, 1);
        this.setData({
　　　　　　  list: _list
　　　　})
      }
    }
  })
},
})