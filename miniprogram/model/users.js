import {Http} from '../utils/http'


class Users extends Http {
  getUsers(){
    return this.request('/users')
  }
}

export {Users}