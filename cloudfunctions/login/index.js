// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const user = await db.collection('user').where({
    _openid:openid
  }).get()
  if(user.data.length === 0){
    await db.collection('user').add({
      data:{
        _openid:openid,
        nickName:event.nickName,
        createTime:Date.now(),
        count:8
      }
    })
    return {
      userInfo:{
        _openid:openid
      }
    }
  }else{
    return {
      userInfo:user.data[0]
    }
  }
  
  

  // return {
  //   user:user,
  //   openid:openid
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID, //微信平台中，unionid都是相同的，但openid却是不同的
  //   env: wxContext.ENV,
  // }
}

