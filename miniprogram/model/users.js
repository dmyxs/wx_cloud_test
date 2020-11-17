import {Http} from '../utils/http'

class Users extends Http {
  getUsers(){
    return this.request('/users',{
      name:'litao',
      age:18
    })
  }
}

export {Users}