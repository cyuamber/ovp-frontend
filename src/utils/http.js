import { message } from 'ant-design-vue'
import axios from 'axios'

axios.defaults.withCredentials = true // set cross-origin

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'x-requested-with,content-type'
})
const uploadGetHeaders = () => ({
  'Content-Type': 'multipart/form-data'
})
export function axiospost(url, data, uploadHeader, callback) {
  // axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: uploadHeader ? uploadGetHeaders() : getHeaders()
      })
      .then(res => {
        if (res.data.code === 200) {
          resolve(res.data)
        } else if (res.data.code === 417) {
          message.error(res.data.body)
          callback()
        } else {
          message.error('Network exception, please try again.')
        }
      })
      .catch(err => {
        reject(err)
        message.error(err + '. Network exception, please try again.')
      })
  })
}
export function axiosget(url, data, callback) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers['Content-Type'] =
      'application/x-www-form-urlencoded;charset=UTF-8'
    axios
      .get(url, {
        params: data,
        headers: getHeaders()
      })
      .then(res => {
        if (+res.data.code === 200) {
          resolve(res.data)
        } else if (+res.data.code === 417) {
          message.error(res.data.body)
          callback()
        } else {
          message.error('Network exception, please try again.')
        }
      })
      .catch(err => {
        reject(err)
        message.error(err + ', Network exception, please try again.')
      })
  })
}
export function axiosput(url, data, callback) {
  axios.defaults.headers['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8'
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, {
        headers: getHeaders()
      })
      .then(res => {
        if (res.data.code === 200) {
          resolve(res.data)
        } else if (res.data.code === 417) {
          message.error(res.data.body)
          callback()
        } else {
          message.error('Network exception, please try again.')
        }
      })
      .catch(err => {
        reject(err)
        message.error(err + ', Network exception, please try again.')
      })
  })
}
export function axiosdelete(url, data, callback) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers['Content-Type'] =
      'application/x-www-form-urlencoded;charset=UTF-8'
    axios
      .delete(url, {
        params: data,
        headers: getHeaders()
      })
      .then(res => {
        if (res.data.code === 200) {
          resolve(res.data)
        } else if (res.data.code === 417) {
          message.error(res.data.body)
          callback()
        } else {
          message.error('Network exception, please try again.')
        }
      })
      .catch(err => {
        reject(err)
        message.error(err + ', Network exception, please try again.')
      })
  })
}
export function axiosCancelToken(url) {
  let CancelToken = axios.CancelToken
  let source = CancelToken.source()
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        cancelToken: source.token
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        if (axios.isCancel(err)) reject(err)
      })
  })
}
export function axiosmock(url, param, data) {
  return new Promise(resolve => {
    console.log(
      '%ccurrenturl',
      'padding: 3px; background: #009fff; color: #fff; border-radius: 3px;',
      url
    )
    console.log(
      '%ccurrentparams',
      'padding: 3px; background:#ff0024; color: #fff; border-radius: 3px;',
      param
    )
    resolve(data)
  })
}
