// /src/vuex/user/actions.js

import * as types from './mutation-types'
import Api from '../../net/api'
import { popupErrMsg, popupMsg } from '../../util/popupMessage'
import { router } from '../../main'
import Device from '../../util/device'
// export const setShowModal = function ({dispatch, state}, bool) {
//   dispatch(types.U_SET_SHOW_MODAL, bool)
// }
// //选中的用户
// export const setChooseUser = function ({dispatch, state}, chooseUsers) {
//   dispatch(types.U_SET_CHOOSE_USER, chooseUsers)
// }
export const setCleanUserSelectIds = function({ dispatch, state }) {
  dispatch(types.U_SET_CLEAN_SELECTIDS)
}
export const setCurrUser = function({ dispatch, state }, currUser) {
  dispatch(types.U_SET_CURRUSER, currUser)
}
export const setOther = function({ dispatch, state }, bool) {
    dispatch(types.U_SET_OTHER, bool)
  }
  //----------------------右侧详情是否显示
export const setDetail = function({ dispatch, state }) {
    dispatch(types.U_SET_DETAIL)
  }
  //当跳到二级菜单页面,设置详情页消失
export const removeDetail = function({ dispatch, state }, bool) {
    dispatch(types.U_SET_DETAIL_LEVEL, bool)
  }
  //----------------------页面跳转
export const setPage = function({ dispatch, state }, page) {
    dispatch(types.U_SET_PAGE, page)
    syncUsersData({ dispatch, state })
  }
  //----------------------更新用户数据
  // export const upsertUser = function ({dispatch, state}, user, GO) {
  //   Api.User.upsert(user
  //     , (r) => {
  //       popupMsg(r.message)
  //       this.$route.router.go(GO)
  //     }
  //     , (err) => popupErrMsg(err.message))
  // }
  //----------------------用户启用与禁用
export const setChangeState = function({ dispatch, state }, id, isvalid) {
  Api.User.valid({ '_id': id, 'isValid': !isvalid }, (r) => {
    popupMsg(r.message)
    dispatch(types.U_SET_VALID, !isvalid)
    syncUsersData({ dispatch, state })
  }, (err) => popupErrMsg(err.message))
}

//----------------------删除
export const setRemoveModal = function({ dispatch, state }) {
  dispatch(types.U_SET_REMOVE_MODAL)
}
export const removeUser = function({ dispatch, state }, id, GO) {
  Api.User.remove(id, (r) => {
    popupMsg(r.message)
    dispatch(types.U_SET_REMOVE_MODAL)
      // dispatch(types.U_REMOVE_USER, id)
    setTimeout(() => {
      const USER_STORE = state.user
      if (this.$route.params.userId) {
        var u = '/m/user/list/' + (parseInt(USER_STORE.page))
        if (GO) u = GO
        router.go(u)
        syncData({ dispatch, state })
      }
    }, 400)

  }, (err) => popupErrMsg(err.message))
}
export const removeUserAll = function({ dispatch, state }, id) {
  Api.User.remove(id, (r) => {
    popupMsg(r.message)
    dispatch(types.U_SET_REMOVE_MODAL)
    dispatch(types.U_SELECT_CLEAR_DATA)
    syncUsersData({ dispatch, state })
  }, (err) => popupErrMsg(err.message))
}

export const syncUsersData = function syncData({ dispatch, state }) {
  const USER_STORE = state.user
  var filter = {}
  filter.limit = 10
  if (Device.isMobile) {
    filter.limit = 15
  }

  Api.User.list({ page: USER_STORE.page }, filter, (r) => {
    var result = r.data.list || {}
    var users = result.docs || {}
    dispatch(types.U_SET_RESULT, result)
    dispatch(types.U_SET_USERS, users)
    dispatch(types.U_SELECT_INIT_DATA)
    dispatch(types.U_SELECT_SYNC_DATA)
    dispatch(types.U_SHOW_DETAIL_SYNC_DATA)
    if (USER_STORE.users.length === 0 && parseInt(USER_STORE.page) > 1) {
      router.go('/m/user/list/' + (parseInt(USER_STORE.page) - 1))
    }
  }, (e) => popupErrMsg(e.message))
}

export const syncAllUsersData = function({ dispatch, state }) {
  // fetch all users
  Api.User.allUsers({}, (r) => {
    dispatch(types.U_SET_ALLUSERS, r.data.list || {})
  }, (e) => popupErrMsg(e.message))
}

//---------------------------单选,多选
export const setSelectAll = function({ dispatch, state }) {
  dispatch(types.U_SELECT_ALL)
  for (var i = 0; i < state.user.selected.length; i++) {
    dispatch(types.U_SELECTED_ID, i)
  }
  dispatch(types.U_SELECT_SYNC_DATA)
}
export const setSelected = function({ dispatch, state }, index) {
  dispatch(types.U_SELECTED, index)
  dispatch(types.U_SELECTED_ID, index)
  dispatch(types.U_SELECT_SYNC_DATA)
}


// mobile
export const setFentchUserOne = function({ dispatch, state }, id) {
  Api.User.fetchOne(id, (r) => {
    // popupMsg(r.message)
    var userOne = r.data.user || {}
    dispatch(types.U_SET_USER_ONE, userOne)
  }, (err) => popupErrMsg(err.message))
}

export const updateUser = function({ dispatch, state }, user, GO) {
  Api.User.upsert(user, (r) => {
    popupMsg(r.message)
    this.$route.router.go(GO)
  }, (err) => popupErrMsg(err.message))
}