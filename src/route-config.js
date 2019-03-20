import _ from 'lodash'
import auth from './auth'
import store from './vuex/store'
import { popupErrMsg } from './util/popupMessage'
export function configRouter(router) {

    // Redirect to the home route if any routes are unmatched
    /*router.beforeEach(function() {
      window.scrollTo(0, 0)
    })

    // 如果访问首页或者登录页，查看是否记录登录状态标记 与 token有效，则转至内部首页；XHR访问为同步访问，异步会出现页面闪现
    router.beforeEach(function(transition) {
      if (transition.to.path === '/home' || transition.to.path === '/login') {
        /!* eslint-env browser *!/
        if (auth.rememberMe() && auth.checkAuthWithBackend()) {
          transition.redirect('/m/screen/list/1')
        }
      }

      transition.next()
    })

    // 访问受限路由，查看token是否有效
    router.beforeEach(function(transition) {
      if (_.startsWith(transition.to.path, '/m/') && !auth.checkAuth()) {
        // popupErrMsg('未被授权的访问，请您登录。')
        // todo 需要彻底解决退出系统时，发生路由错乱的问题
        transition.abort()
        transition.redirect('/home')
      } else {
        transition.next()
      }
    })

    // 访问受限路由，查看用户是否是管理员权限
    router.beforeEach(function(transition) {
      if (_.startsWith(transition.to.path, '/m/user') &&
        auth && auth.user && auth.user.info && !auth.user.info.isAdmin) {
        transition.abort()
        popupErrMsg('未被授权的访问。')
      } else {
        transition.next()
      }
    })*/
}