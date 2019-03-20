// /src/vuex/app/actions.js


import * as types from './mutation-types'
import Api from '../../net/api'
import { popupErrMsg, popupMsg, popupInfoMsg } from '../../util/popupMessage'
import moment from 'moment'
import _ from 'lodash'
import { router } from '../../main'

export const setCleanAppSelectIds = function({ dispatch, state }) {
    dispatch(types.A_SET_CLEAN_SELECTIDS)
  }
  // 当不是列表页的时候详情框消失
export const removeDetail = function({ dispatch, state }, bool) {
    dispatch(types.A_SET_DETAIL_LEVEL, bool)
  }
  // 选中
export const setSelected = function({ dispatch, state }, index) {
  dispatch(types.A_SELECTED, index)
  dispatch(types.A_SELECTED_ID, index)
  dispatch(types.A_SELECT_SYNC_DATA)
}
export const setSelectAll = function({ dispatch, state }) {
  dispatch(types.A_SELECT_ALL)

  for (var i = 0; i < state.app.selected.length; i++) {
    dispatch(types.A_SELECTED_ID, i)
  }

  dispatch(types.A_SELECT_SYNC_DATA)
}

// 分页
export const setPage = function({ dispatch, state }, page) {
    dispatch(types.A_SET_PAGE, page)
    syncAppsData({ dispatch, state })
  }
  // 右侧详情是否显示
export const setDetail = function({ dispatch, state }) {
    dispatch(types.A_SET_DETAIL)
  }
  // 过滤器
export const setCreator = function({ dispatch, state }, creator) {
  dispatch(types.A_SET_CREATOR, creator)
  dispatch(types.A_SELECT_CLEAR_DATA)
  dispatch(types.A_SET_PAGE, 1)
  syncAppsData({ dispatch, state })
}

export const setPeriod = function({ dispatch, state }, period) {
  dispatch(types.A_SET_PERIOD, period)
  dispatch(types.A_SELECT_CLEAR_DATA)
  dispatch(types.A_SET_PAGE, 1)
  syncAppsData({ dispatch, state })
}

export const setType = function({ dispatch, state }, type) {
  dispatch(types.A_SET_TYPE, type)
  dispatch(types.A_SELECT_CLEAR_DATA)
  dispatch(types.A_SET_PAGE, 1)
  syncAppsData({ dispatch, state })
}

export const setSort = function({ dispatch, state }, sort) {
  dispatch(types.A_SET_SORT, sort)
  dispatch(types.A_SELECT_CLEAR_DATA)
  dispatch(types.A_SET_PAGE, 1)
  syncAppsData({ dispatch, state })
}


// 删除应用模态框
export const setDeleteAppModal = function({ dispatch, state }) {
  dispatch(types.A_SET_DETELE_APP_MODAL)
}

// 删除应用
export const removeApp = function({ dispatch, state }, appIds, GO) {

  const CONTENT_STORE = state.app
  list = CONTENT_STORE.selectedIDs
  if (appIds) {
    var list = appIds
  }
  Api.App.remove(list, (r) => {
    popupMsg(r.message)
    dispatch(types.A_SET_DETELE_APP_MODAL)
    dispatch(types.A_SELECT_CLEAR_DATA)
    syncAppsData({ dispatch, state })
    if (GO) this.$route.router.go(GO)
  }, (err) => popupErrMsg(err.message))
}


export const syncAppsData = function syncData({ dispatch, state }, content, more) {
  var filter = {}
  const APP_STORE = state.app

  if (APP_STORE.creator !== '_ALL') {
    filter.creator = APP_STORE.creator
  }

  if (APP_STORE.period !== '_ALL') {
    filter.period = moment().subtract(1, APP_STORE.period)
  }
  if (APP_STORE.type !== '_ALL') {
    filter.appType = APP_STORE.type
  }
  if (APP_STORE.sort !== '_ALL') {
    filter.sort = APP_STORE.sort
  }
  // fetch all contents
  Api.App.list({ page: APP_STORE.page }, filter, (r) => {
    var result = r.data.list || {}
    var apps = result.docs || {}
    dispatch(types.A_SET_RESULT, result)
    dispatch(types.A_SET_APPS, apps)
    dispatch(types.A_SELECT_INIT_DATA)
    dispatch(types.A_SELECT_SYNC_DATA)
    dispatch(types.A_SHOW_DETAIL_SYNC_DATA)
    if (APP_STORE.apps.length === 0 && parseInt(APP_STORE.page) > 1) {
      dispatch(types.A_SET_PAGE, (parseInt(APP_STORE.page) - 1))
      syncAppsData({ dispatch, state })
        // router.go('/m/app/list/' + (parseInt(APP_STORE.page) - 1))
    }
  }, (e) => {
    popupErrMsg(e.message)
  })
}

// 媒体应用
export const setPlayMode = function({ dispatch, state }, val) {
  dispatch(types.A_SET_PLAY_MODE, val)
}
export const setSwitchMode = function({ dispatch, state }, val) {
  dispatch(types.A_SET_SWITCH_MODE, val)
}
export const saveApp = function({ dispatch, state }, _id, appname, appType, ref, GO) {
  Api.App.upsert({ '_id': _id, 'name': appname, 'appType': appType, 'ref': ref }, (r) => {
    if (r.success === false) {
      popupInfoMsg(r.message)
    } else {
      popupMsg(r.message)
    }
    if (GO) {
      this.$route.router.go(GO)
      return
    }
    this.$route.router.go('/m/app/list')
  }, (err) => popupErrMsg(err.message))
}

// 签到应用
// export const setSignPage = function ({dispatch, state}, page, id, bool) {
//   dispatch(types.A_SET_MODAL_PAGE, page)
//   syncSignData({dispatch, state})
// }
// export const syncSignData = function ({dispatch, state}) {
//   const APP_STORE = state.app
//   Api.sign.list({page: APP_STORE.signPage}
//     , (r) => {
//       var result = r.data.list || {}
//       var signs = result.docs || {}

//       dispatch(types.A_SET_SIGN_RESULT, result)
//       dispatch(types.A_SET_SIGN_SIGNS, signs)

//       dispatch(types.A_SET_SIGN_SELECT_INIT_DATA)
//       dispatch(types.A_SET_SIGN_SELECT_SYNC_DATA)
//     }
//     , (e) => popupErrMsg(e.message)
//     ) // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息
// }
// export const setSignSelectedIds = function ({dispatch, state}, index, selected) {
//   dispatch(types.A_SET_SIGN_SELECTEDIDS, index, selected)
// }
// export const setSignSelected = function ({dispatch, state}, index) {
//   dispatch(types.A_SET_SIGN_SELECTED, index)
//   dispatch(types.A_SET_SIGN_SELECTEDIDS, index)
//   dispatch(types.A_SET_SIGN_SELECT_SYNC_DATA)
// }
// export const setSignSelectAll = function ({dispatch, state}) {
//   dispatch(types.A_SET_SIGN_SELECT_ALL)

//   for (var i = 0; i < state.app.signselected.length; i++) {
//     dispatch(types.A_SET_SIGN_SELECTEDIDS, i)
//   }
//   dispatch(types.A_SET_SIGN_SELECT_SYNC_DATA)
// }

// 发布模态框
export const setAddPublishedModal = function({ dispatch, state }) {
  dispatch(types.A_SET_ADD_PUBLISHED_MODAL)
}
export const setAddCancelModal = function({ dispatch, state }) {
  dispatch(types.A_SET_ADD_CANCEL_MODAL)
}
export const setModalPage = function({ dispatch, state }, page, id, bool) {
  dispatch(types.A_SET_MODAL_PAGE, page)
  syncData({ dispatch, state }, id, bool)
}

export const setModalCreator = function({ dispatch, state }, creator, id, bool) {
  dispatch(types.A_SET_MODAL_CREATOR, creator)
  dispatch(types.A_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state }, id, bool)
}

export const setModalPeriod = function({ dispatch, state }, period, id, bool) {
  dispatch(types.A_SET_MODAL_PERIOD, period)
  dispatch(types.A_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state }, id, bool)
}

export const setModalLocation = function({ dispatch, state }, location, id, bool) {
  dispatch(types.A_SET_MODAL_LOCATION, location)
  dispatch(types.A_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state }, id, bool)
}
export const setModalSort = function({ dispatch, state }, sort, id, bool) {
  dispatch(types.A_SET_MODAL_SORT, sort)
  dispatch(types.A_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state }, id, bool)
}
export const syncData = function({ dispatch, state }, id, bool) {
    // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息
    // if (_.isUndefined(refresh)) {
    //   refresh = false
    // }

    var filter = {}

    const APP_STORE = state.app
    const SCREEN_STORE = state.screen

    if (APP_STORE.modalCreator !== '_ALL') {
      filter.creator = APP_STORE.modalCreator
    }
    if (APP_STORE.modalPeriod !== '_ALL') {
      filter.period = moment().subtract(1, APP_STORE.modalPeriod)
    }

    if (APP_STORE.modalLocation !== '_ALL') {
      filter.location = APP_STORE.modalLocation
    }
    if (APP_STORE.modalSort !== '_ALL') {
      filter.sort = APP_STORE.modalSort
    }
    filter.appId = id
    filter.published = bool
      // fetch all screens
    Api.Screen.list({ page: APP_STORE.modalPage }, filter, (r) => {
        var result = r.data.list || {}
        var screens = result.docs || {}

        dispatch(types.A_SET_MODAL_RESULT, result)
        dispatch(types.A_SET_MODAL_SCREENS, screens)

        dispatch(types.A_SET_MODAL_SELECT_INIT_DATA)
        dispatch(types.A_SET_MODAL_SELECT_SYNC_DATA)
      }, (e) => popupErrMsg(e.message)) // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息

    // if (!refresh) {
    //   // sync location data with backend
    //   syncLocData({dispatch, state})

    //   // sync user data with backend
    //   syncAllUsersData({dispatch, state})
    // }
  }
  // 删除模态框下面的已选择标签，同步select
export const changeModalSelectNames = function({ dispatch, state }, index) {
  dispatch(types.A_CHANGE_MODAL_SELECTEDID, index)
  dispatch(types.A_SET_MODAL_SELECT_INIT_DATA)
  dispatch(types.A_SET_MODAL_SELECT_SYNC_DATA)
}
export const setModalSelectedIds = function({ dispatch, state }, index, selected) {
  dispatch(types.A_SET_MODAL_SELECTEDIDS, index, selected)
}
export const setModalSelected = function({ dispatch, state }, index, GO) {
  dispatch(types.A_SET_MODAL_SELECTED, index, GO)
  dispatch(types.A_SET_MODAL_SELECTEDIDS, index, GO)
  dispatch(types.A_SET_MODAL_SELECT_SYNC_DATA)
}
export const setModalSelectAll = function({ dispatch, state }) {
  dispatch(types.A_SET_MODAL_SELECT_ALL)

  for (var i = 0; i < state.app.modalselected.length; i++) {
    dispatch(types.A_SET_MODAL_SELECTEDIDS, i)
  }
  dispatch(types.A_SET_MODAL_SELECT_SYNC_DATA)
}

// 撤销发布
export const cancel = function({ dispatch, state }, _id, ids) {
  Api.App.cancel(_id, ids, (r) => {
    popupMsg(r.message)
    dispatch(types.A_SET_ADD_CANCEL_MODAL)
    syncAppsData({ dispatch, state })
  }, (e) => popupErrMsg(e.message))
}

// 发布应用
export const publish = function({ dispatch, state }, _id, ids, GO) {
    Api.App.publish(_id, { screenIds: ids, from: 'APP' }, (r) => {
      dispatch(types.A_SET_ADD_PUBLISHED_MODAL)
      if (r.success === false) {
        popupInfoMsg(r.message)
      } else {
        popupMsg(r.message)

      }

      syncAppsData({ dispatch, state })
      if (GO) router.go(GO)
    }, (e) => popupErrMsg(e.message))
  }
  // 照片墙审核模态框
export const setAddCheckModal = function({ dispatch, state }) {
  dispatch(types.A_SET_ADD_CHECK_MODAL)
}
export const syncCheckPendingList = function({ dispatch, state }, _id) {
  Api.Wechat.checkPendingList(_id, (r) => {
    popupMsg(r.message)
    var penging = r.data || {}
    dispatch(types.A_SET_PENGING_lIST, penging)
  }, (err) => popupErrMsg(err.message))
}
export const checkPenging = function({ dispatch, state }, appId, _id, status, index, onScreen, search) {
  Api.Wechat.check(appId, { _id: _id, state: status }, (r) => {
    if (onScreen === 'onScreen') {
      dispatch(types.A_CHANGE_PENGING_lIST, index)

    } else {
      dispatch(types.A_REMOVE_PENGING_lIST, index)
    }
    syncWechatData({ dispatch, state }, appId, search, 'picture')
  }, (err) => { popupErrMsg(err.message) })

}
export const checkPendingListCount = function({ dispatch, state }, appId) {
    if (appId) {
      Api.Wechat.checkPendingListCount(appId,
        (r) => {
          dispatch(types.A_CHECK_PENDING_COUNT, r.data.count)
        }, (err) => { popupErrMsg(message) })
    }

  }
  // 微信
export const setWechatSort = function({ dispatch, state }, sort, _id, search, type) {
  dispatch(types.A_SET_WECHAT_SORT, sort)
  dispatch(types.A_SET_WECHAT_PAGE, 1)
  syncWechatData({ dispatch, state }, _id, search, type)
}
export const setCheck = function({ dispatch, state }, check, _id, search, type) {
  dispatch(types.A_SET_CHECK, check)
  dispatch(types.A_SET_WECHAT_PAGE, 1)
  syncWechatData({ dispatch, state }, _id, search, type)
}
export const setCheckInit = function({ dispatch, state }, check) {
  dispatch(types.A_SET_CHECK, check)
}

export const setCleanWechatSelectedIds = function({ dispatch, state }) {
  dispatch(types.A_SET_CLEAN_WECHAT_SELECTEDIDS)
}
export const setDeleteWechatModal = function({ dispatch, state }) {
  dispatch(types.A_SET_DETELE_WECHAT_MODAL)
}
export const setWechatPage = function({ dispatch, state }, page, _id, search, type) {
  dispatch(types.A_SET_WECHAT_PAGE, page)
  syncWechatData({ dispatch, state }, _id, search, type)
}
export const setRemoveWechat = function({ dispatch, state }, _id, searchName, type) {
  Api.Wechat.remove(_id, state.app.wechatSelectIds, (r) => {
    popupMsg(r.message)
    dispatch(types.A_SET_DETELE_WECHAT_MODAL)
    dispatch(types.A_SET_CLEAN_WECHAT_SELECTEDIDS)
    syncWechatData({ dispatch, state }, _id, searchName, type)
  }, (e) => popupErrMsg(e.message))
}
export const syncWechatData = function({ dispatch, state }, _id, searchName, type) {
  const APP_STORE = state.app
  var filter = {}
  if (searchName !== '') {
    filter.search = searchName
  }
  if (type === 'picture') {
    if (APP_STORE.check !== '_ALL')
      filter.state = APP_STORE.check
    if (APP_STORE.wechatSort !== '_ALL')
      filter.sort = APP_STORE.wechatSort
    Api.Wechat.checkedList(_id, APP_STORE.wechatPage, filter, (r) => {
        var wechatResult = r.data.list || {}
        var wechatUser = wechatResult.docs || {}

        dispatch(types.A_SET_WECHAT_RESULT, wechatResult)
        dispatch(types.A_SET_WECHAT_USERS, wechatUser)

        dispatch(types.A_SET_WECHAT_SELECT_INIT_DATA)
        dispatch(types.A_SET_WECHAT_SELECT_SYNC_DATA)
        if (APP_STORE.wechatUsers.length === 0 && parseInt(APP_STORE.wechatPage) > 1) {
          //router.go('/m/screen/list/' + (parseInt(APP_STORE.wechatPage) - 1))
          dispatch(types.A_SET_WECHAT_PAGE, (parseInt(APP_STORE.wechatPage) - 1))
          syncWechatData({ dispatch, state }, _id, searchName, type)
        }
      }, (e) => popupErrMsg(e.message)) // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息
  } else {
    Api.Wechat.list(_id, APP_STORE.wechatPage, filter, (r) => {
        var wechatResult = r.data.list || {}
        var wechatUser = wechatResult.docs || {}

        dispatch(types.A_SET_WECHAT_RESULT, wechatResult)
        dispatch(types.A_SET_WECHAT_USERS, wechatUser)

        dispatch(types.A_SET_WECHAT_SELECT_INIT_DATA)
        dispatch(types.A_SET_WECHAT_SELECT_SYNC_DATA)
        if (APP_STORE.wechatUsers.length === 0 && parseInt(APP_STORE.wechatPage) > 1) {
          //router.go('/m/screen/list/' + (parseInt(APP_STORE.wechatPage) - 1))
          dispatch(types.A_SET_WECHAT_PAGE, (parseInt(APP_STORE.wechatPage) - 1))
          syncWechatData({ dispatch, state }, _id, searchName, type)
        }
      }, (e) => popupErrMsg(e.message)) // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息
  }
}
export const setWechatSelectedIds = function({ dispatch, state }, index, selected) {
  dispatch(types.A_SET_WECHAT_SELECTEDIDS, index, selected)
}
export const setWechatSelected = function({ dispatch, state }, index) {
  dispatch(types.A_SET_WECHAT_SELECTED, index)
  dispatch(types.A_SET_WECHAT_SELECTEDIDS, index)
  dispatch(types.A_SET_WECHAT_SELECT_SYNC_DATA)
}
export const setWechatSelectAll = function({ dispatch, state }) {
  dispatch(types.A_SET_WECHAT_SELECT_ALL)

  for (var i = 0; i < state.app.wechatSelected.length; i++) {
    dispatch(types.A_SET_WECHAT_SELECTEDIDS, i)
  }
  dispatch(types.A_SET_WECHAT_SELECT_SYNC_DATA)
}

//mobile 
export const setFilter = function({ dispatch, state }, filter, value) {
  if (filter === 'creator') {
    dispatch(types.A_SET_CREATOR, value)
  }
  if (filter === 'period') {
    dispatch(types.A_SET_PERIOD, value)
  }
  if (filter === 'type') {
    dispatch(types.A_SET_TYPE, value)
  }
  if (filter === 'filter') {
    dispatch(types.A_SET_PAGE, 1)
  }
  syncAppsData({ dispatch, state })
}

export const setModalFilter = function({ dispatch, state }, filter, value, id, bool) {
  if (filter === 'creator') {
    dispatch(types.A_SET_MODAL_CREATOR, value)
  }
  if (filter === 'period') {
    dispatch(types.A_SET_MODAL_PERIOD, value)
  }
  if (filter === 'location') {
    dispatch(types.A_SET_MODAL_LOCATION, value)
  }
  if (filter === 'filter') {
    dispatch(types.A_SET_MODAL_PAGE, 1)
  }
  syncData({ dispatch, state }, id, bool)
}
export const setReset = function({ dispatch, state }, id, bool) {
  dispatch(types.A_SET_LIST_INIT)
  syncAppsData({ dispatch, state }, id, bool)
}
export const setModalReset = function({ dispatch, state }, id, bool) {

  setAddPublishedModal({ dispatch, state })
  syncData({ dispatch, state }, id, bool)
}

export const setFentchAppOne = function({ dispatch, state }, id) {
  Api.App.fetchOne(id, (r) => {
    // popupMsg(r.message)
    var appOne = r.data.app || {}
    dispatch(types.A_SET_APP_ONE, appOne)
  }, (err) => popupErrMsg(err.message))
}