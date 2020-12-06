// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const result = await cloud.openapi.templateMessage.send({
    touser:OPENID,
    page:`/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data:{
      phrase2:{
        value:'评价完成'
      },
      thing3:{
        value:event.content
      },
      time1:{
        value:new Date().toLocaleString()
      }
    },
    templateId:'9IrIG20gI6eODq2aLXdQkVWJvmerSrPeUqTPFAaq0bw',
    formId: event.formId
  })
  return result
}