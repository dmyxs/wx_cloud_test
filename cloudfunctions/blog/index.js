// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
// import TcbRouter from 'tcb-router'

const db = cloud.database()
const blogCollection = db.collection('blog')
// 云函数入口函数

let MAX_LIMIT = 100

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({event})

  //获取博客列表
  app.router('list', async (ctx,next) => {
    //模糊搜索
    //获取搜索key
    const searchKey = event.searchKey
    let w = {}
    if(searchKey.trim() != ''){
      w = {
        //评论内容正则匹配
        content:db.RegExp({
          regexp:searchKey,
          options:'i'  //或略大小写
        })
      }
    }
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.limit)
    .orderBy('createTime', 'desc').get().then((res) => {
      return res.data
    })
    ctx.body = blogList
  })

  //获取博客详情及评论
  app.router('detail', async(ctx, next) => {
    //获取博客传递过来的ID
    let blogId = event.blogId
    // 详情查询
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })

    // 评论查询
    // 获取评论数量
    const countResult = await blogCollection.count()
    const total = countResult.total
    //准备容器存储
    let commentList = {
      data: []
    }

    if (total > 0) {
      // 查询次数
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        // 单次查询，放到数组
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId // 根据博客id查询
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        // 累加
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail,
    }

  })

  //
  app.router('getListByOpenid', async(ctx, next) => {
    ctx.body = await blogCollection.where({
        _openid: wxContext.OPENID
      }).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then((res) => {
        return res.data
      })
  })

  
  return app.serve()
}