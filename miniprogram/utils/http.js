import {config} from '../config'

class Http {
  request(url, data={}, method='GET'){
      return new Promise((resolve,reject) => {
          wx.request({
              url:config.api_base_url + url,
              method:method,
              data:data,
              header:{
                  'content-type':'application/json'
              },
              success:res =>{
                resolve(res)
              },
              fail:err => {
                reject(err)
              }
          })
      })
  }
}
export {Http}