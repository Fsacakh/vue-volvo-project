// src/auth/index.js

import {popupMsg} from '../util/popupMessage'
import {router} from '../main'
import config from '../config'
import $ from 'jquery'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: true,
    mobile: '',
    password: '',
    info: {} // 用来保存checkauth后服务器返回的当前用户信息
  },

  // To log out, we just need to remove the token
  logout () {
    /* eslint-env browser */
    localStorage.removeItem('BZT_TOKEN')
    localStorage.removeItem('BZT_REMEMBER_ME')
    this.user.authenticated = false
    this.user.mobile = ''
    this.user.password = ''
    this.user.info = {}
    // popupMsg('成功退出，记得回来哦：）')

    // todo 添加退出时访问后台的逻辑

    router.go('/home')
  },

  rememberMe () {
    var rememberMe = localStorage.getItem('BZT_REMEMBER_ME')
    var token = localStorage.getItem('BZT_TOKEN')
    if (rememberMe && token)
      return true
    else
      return false
  },

  // 检查浏览器本地是否有token
  checkAuth () {
    /* eslint-env browser */
    var jwt = localStorage.getItem('BZT_TOKEN')
    if (jwt) {
      this.user.authenticated = true
      return true
    } else {
      this.user.authenticated = false
      return false
    }
  },

  // 提交后台检查token是否符合要求，符合要求的话将返回的user信息保存在user.info中
  checkAuthWithBackend () {
    if (!this.checkAuth()) {
      return false
    }

    var that = this
    // var result = null

    // 准备ajax请求的参数
    var ajaxOptions = {
      url: config.HOST_SERVER + 'm/checkauth',
      // ajax.setRequestHeader('If-Modified-Since', '0')
      headers: this.getAuthHeader(),
      type: 'POST',
      contentType: 'application/json',
      data: '',
      cache: false,
      async: false,
      dataType: 'json',
      processData: false,
      timeout: 3 * 1000,
      success: function (r) {
        that.user.info = r.data
        that.result = true
      },
      fail: function () {
        that.result = false
      }
    }

    $.ajax(ajaxOptions)

    this.user.authenticated = this.result

    return this.result
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      /* eslint-env browser */
      'Authorization': 'Bearer ' + localStorage.getItem('BZT_TOKEN')
    }
  }
}
