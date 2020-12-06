// 输入文字最大的个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9

const db = wx.cloud.database()
// 输入的文字内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true, // 添加图片元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userInfo = options
  },

  // 字数限制
  onInput(event) {
    console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  onFocus(event) {
    // 模拟器获取的键盘高度为0
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },

  //图片上传
  onChooseImage() {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length

    //选择图片
    wx.chooseImage({
      count: max, //可选择图片的个数
      sizeType: ['original', 'compressed'], //图片的类型
      sourceType: ['album', 'camera'],//图片来源、相册或拍照
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        //控制加号图片显示与隐藏
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  //删除图片
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    //如果图片小于最大数，就显示图片加号
    if (this.data.images.length < MAX_IMG_NUM) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  //点击图片预览
  onPreviewImage(event) {
    // 6/9
    wx.previewImage({
      urls: this.data.images,  //预览图片的列表
      current: event.target.dataset.imgsrc,  //预览图片的地址
    })
  },

  //真正上传图片
  send() {
    // 数据 -> 云数据库
    // 数据库：内容、图片fileID、openid、昵称、头像、时间
    // 1、图片 -> 云存储 fileID 云文件ID

    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,
    })

    let promiseArr = []
    let fileIds = []
    // 图片上传，每次只能上传一张图片
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        
        // 动态文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]

        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,  //存储路径
          filePath: item,   //文件临时路径
          success: (res) => {
            console.log(res.fileID) //云存储路径
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }

    // 存入到云数据库
    Promise.all(promiseArr).then((res) => {
      //小程序操作db，自带openID
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          imgs: fileIds,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        // 返回blog页面，并且刷新
        wx.navigateBack()

        // 获取当前页面和上一级页面
        const pages = getCurrentPages()
        // console.log(pages)
        // 取到上一个页面
        const prevPage = pages[0]
        //调用上一级页面的下拉刷新，刷新页面
        prevPage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },
})