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
				const code = res.statusCode.toString()
				if(code.startsWith('2')){
					resolve(res.data)
				}else if(code.startsWith('4')){
					wx.showToast({
						title: '请求地址错误',
						icon:'none',
						duration:3000
					})
				}else if(code.startsWith('5')){
					wx.showToast({
						title: '服务端繁忙，请稍后重试',
						icon:'none',
						duration:3000
					})
				}
				},
				fail:err => {
				wx.showToast({
					title:'服务端繁忙，请稍后重试',
					icon:'none',
					duration:3000
				})
				reject(err)
				}
			})
		})
	}
}
export {Http}