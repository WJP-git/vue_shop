import axios from 'axios'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/';
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';
axios.defaults.timeout = 5000

axios.interceptors.request.use(config => {

  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
export default {
  get (path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.get(path, {
        params: data
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post (path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(path, data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  put (path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(path, data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  delete (path = '', data = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(path).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
}