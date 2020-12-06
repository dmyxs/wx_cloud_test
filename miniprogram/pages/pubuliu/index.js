// miniprogram/pages/pubuliu/index.js


const db = wx.cloud.database()
const MAXLIMIT = 12
let imgArr1Height = 0; //左边图片数组的总宽高
let imgArr2Height = 0; //右边
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop:0, //设置回到顶部
    showGotoTop:false, //是否显示回到顶部按钮
    scrollH: 0, //scrollView的高度
    imgWidth: 0,//图片宽度
    loadingCount: 0,//图片总数
    images: [],//存放图片数据
    col1: [],//左
    col2: [],//右
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth; //手机的宽度
        let wh = res.windowHeight; //手机的高度
        let imgWidth = ww * 0.48; //设置图片的宽度，影响高度
        let scrollH = wh; //视图的高度

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        // this.loadImages();
        this.loadFromDatabase()
      }
    })
  },

  //通过计算，将图片分成两列
  onImageLoad: function(e) {
    let imageId = e.currentTarget.id; //图片id，用于判断
    let oImgW = e.detail.width; //图片原始宽度，300
    let oImgH = e.detail.height; //图片原始高度，400-450-500
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW //比例计算：设置的宽度 除以 原始的宽度 = 0.6
    let imgHeight = oImgH * scale; //自适应高度：240-270-300

    let images = this.data.images; //要计算的数组图片
    let imageObj = null;

    //遍历数组，找到元素，再设置高度
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img._id === imageId) {
        imageObj = img;
        break;
      }
    }
    //把计算出的动态高度赋值给每一张图片
    imageObj.height = imgHeight;

    //每次加载就减1
    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

  
    //如果 左边的图片的高度 比 右边图片的高度 高 
    //哪边短，就添加到哪一边
    if (imgArr1Height <= imgArr2Height) {
      imgArr1Height += imgHeight;
      col1.push(imageObj);
    } else {
      imgArr2Height += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }
    this.setData(data);
  },

  //方式一：使用本地图片
  loadImages: function() {
    let images = [
      {img:'../../images/pubuliu/1.png',height:0},
      { img: '../../images/pubuliu/2.png', height: 0 },
      { img: '../../images/pubuliu/3.png', height: 0 },
      { img: '../../images/pubuliu/4.png', height: 0 },
      { img: '../../images/pubuliu/5.png', height: 0 },
      { img: '../../images/pubuliu/6.png', height: 0 }, 
      { img: '../../images/pubuliu/7.png', height: 0 },
      { img: '../../images/pubuliu/8.png', height: 0 },
      { img: '../../images/pubuliu/9.png', height: 0 },
      { img: '../../images/pubuliu/10.png', height: 0 },
      { img: '../../images/pubuliu/11.png', height: 0 },
      { img: '../../images/pubuliu/12.png', height: 0 },
    ]

    //加上id
    let baseId = "img-" + (+new Date());
    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }
    this.setData({
      loadingCount: images.length,
      images: images,
    })
  },

  //方式二：从数据库获取数据，无限加载图片
  loadFromDatabase(){
    db.collection('pinterest').skip(this.data.images.length).limit(MAXLIMIT).get().then(res => {
      const data = res.data
      if(data){
        this.setData({
          loadingCount: data.length,
          images: this.data.images.concat(data)
        })
      }
    })
  },

  //滚动到底部
  scrollLower(){
    this.loadFromDatabase()
  },

  //滚动距离顶部
  onScroll(e){
    const scrollTop = e.detail.scrollTop
    if(scrollTop > 1500){
      this.setData({
        showGotoTop:true
      })
    }else{
      this.setData({
        showGotoTop:false
      })
    }

    // console.log(wx.createSelectorQuery().select('.img_item'));
  },

  //回到顶部
  onGoToTop(){
    this.setData({
      scrollTop:0,
      showGotoTop:false
    })
  },

  scroll(e){
    console.log(e);
  },

  onPageScroll: function (e){
    console.log(e); //当前元素距离顶部
  },

  // onPageScroll: function (e) {
  //   // console.log(e.scrollTop)
  // },

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