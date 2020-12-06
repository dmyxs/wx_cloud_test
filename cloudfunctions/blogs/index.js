// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()
const blogCollction = db.collection('blog')
// 云函数入口函数

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({event})

  app.router('list', async (ctx,next) => {
    let blogList = await blogCollction.skip(event.start).limit(event.limit)
    .orderBy('createTime', 'desc').get().then((res) => {
      return res.data
    })
    ctx.body = blogList
  })

  app.serve()
}