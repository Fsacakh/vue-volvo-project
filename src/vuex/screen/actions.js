// /src/vuex/screen/actions.js

import Api from '../../net/api'
import { popupErrMsg, popupMsg, popupInfoMsg } from '../../util/popupMessage'
import moment from 'moment'
import * as types from './mutation-types'
import { syncLocData } from '../location/actions'
import { syncAllUsersData } from '../user/actions'
import { setFentchAppOne } from '../app/actions'
import _ from 'lodash'
import { router } from '../../main'

// 重新登录的时候清空slectedIds里面的数据
export const setCleanScreenSelectIds = function({ dispatch, state }) {
    dispatch(types.S_SET_CLEAN_SELECTIDS)
  }
  // screen在线和总数统计
export const setShowDetail = function({ dispatch, state }, show) {
  dispatch(types.S_SET_DETAIL)
}
export const removeDetail = function({ dispatch, state }, bool) {
    dispatch(types.S_SET_DETAIL_LEVEL, bool)
  }
  // 位置模态框
export const setShowModal = function({ dispatch, state }) {
  dispatch(types.S_SET_SHOW_MODAL)
}

// 推送模态框
export const setPushModal = function({ dispatch, state }, screen) {
    dispatch(types.S_SET_PUSH_MODAL, screen)
    dispatch(types.S_SET_MODAL_INIT)
    syncAppsData({ dispatch, state })
  }
  // 推送模态框 - 获取apps
export const syncAppsData = function syncAppsData({ dispatch, state }) {
    var filter = {}
    const MODAL_STORE = state.screen.modalFilter

    if (MODAL_STORE.creator !== '_ALL') {
      filter.creator = MODAL_STORE.creator
    }

    if (MODAL_STORE.period !== '_ALL') {
      filter.period = moment().subtract(1, MODAL_STORE.period)
    }
    if (MODAL_STORE.type !== '_ALL') {
      filter.appType = MODAL_STORE.type
    }
    if (MODAL_STORE.sort !== '_ALL') {
      filter.sort = MODAL_STORE.sort
    }
    // fetch all apps
    Api.App.list({ page: MODAL_STORE.page }, filter, (r) => {
      var result = r.data.list || {}
      var apps = result.docs || {}
      dispatch(types.S_SET_MODAL_RESULT, result)
      dispatch(types.S_SET_MODAL_APPS, apps)
    }, (e) => {

    })
  }
  // 推送模态框 - 过滤
export const setModalPage = function({ dispatch, state }, page) {
  dispatch(types.S_SET_MODAL_SELECTED, '')
  dispatch(types.S_SET_MODAL_PAGE, page)
  syncAppsData({ dispatch, state })
}

export const setModalCreator = function({ dispatch, state }, creator) {
  dispatch(types.S_SET_MODAL_CREATOR, creator)
  dispatch(types.S_SET_MODAL_SELECTED, '')
  dispatch(types.S_SET_MODAL_PAGE, 1)
  syncAppsData({ dispatch, state })
}

export const setModalPeriod = function({ dispatch, state }, period) {
  dispatch(types.S_SET_MODAL_PERIOD, period)
  dispatch(types.S_SET_MODAL_SELECTED, '')
  dispatch(types.S_SET_MODAL_PAGE, 1)
  syncAppsData({ dispatch, state })
}

export const setModalType = function({ dispatch, state }, type) {
  dispatch(types.S_SET_MODAL_TYPE, type)
  dispatch(types.S_SET_MODAL_SELECTED, '')
  dispatch(types.S_SET_MODAL_PAGE, 1)
  syncAppsData({ dispatch, state })
}
export const setModalSort = function({ dispatch, state }, sort) {
  dispatch(types.S_SET_MODAL_SORT, sort)
  dispatch(types.S_SET_MODAL_SELECTED, '')
  dispatch(types.S_SET_MODAL_PAGE, 1)
  syncAppsData({ dispatch, state })
}

export const setModalSelected = function({ dispatch, state }, publishId) {
  dispatch(types.S_SET_MODAL_SELECTED, publishId)
}

export const screenPush = function({ dispatch, state }, screenId) {
  const MODAL_STORE = state.screen.modalApps
  var screenIds = MODAL_STORE.pushScreen._id || screenId
  var appIds = MODAL_STORE.publishId
  if (!appIds) {
    popupErrMsg('请选择一个应用')
    return
  }

  var list = []
  list.push(screenIds)

  Api.App.publish(appIds, { screenIds: list, from: 'SCREEN' }, (r) => {
    if (r.success === false) {
      popupInfoMsg(r.message)

    } else {
      popupMsg(r.message)

    }
    dispatch(types.S_SET_PUSH_MODAL)
    syncData({ dispatch, state })
  }, (err) => popupErrMsg(err.message))
}




export const setSelectAll = function({ dispatch, state }) {
  dispatch(types.S_SELECT_ALL)

  for (var i = 0; i < state.screen.selected.length; i++) {
    dispatch(types.S_SELECTED_ID, i)
  }

  dispatch(types.S_SELECT_SYNC_DATA)
}
export const setPending = function({ dispatch, state }) {
  dispatch(types.S_SET_PENDING)
}
export const setSelected = function({ dispatch, state }, index) {
  dispatch(types.S_SELECTED, index)
  dispatch(types.S_SELECTED_ID, index)
  dispatch(types.S_SELECT_SYNC_DATA)
}

export const setPage = function({ dispatch, state }, page) {
  dispatch(types.S_SET_PAGE, page)
  syncData({ dispatch, state })
}

export const setReset = function({ dispatch, state }) {
  dispatch(types.S_SET_LIST_INIT)
  syncData({ dispatch, state })
}

export const setCreator = function({ dispatch, state }, creator) {
  dispatch(types.S_SET_CREATOR, creator)
  dispatch(types.S_SELECT_CLEAR_DATA)
  dispatch(types.S_SET_PAGE, 1)
  syncData({ dispatch, state })
}

export const setPeriod = function({ dispatch, state }, period) {
  dispatch(types.S_SET_PERIOD, period)
  dispatch(types.S_SELECT_CLEAR_DATA)
  dispatch(types.S_SET_PAGE, 1)
  syncData({ dispatch, state })
}

export const setLocation = function({ dispatch, state }, location) {
  dispatch(types.S_SET_LOCATION, location)
  dispatch(types.S_SELECT_CLEAR_DATA)
  dispatch(types.S_SET_PAGE, 1)
  syncData({ dispatch, state })
}
export const setSort = function({ dispatch, state }, sort) {
  dispatch(types.C_SET_SORT, sort)
  dispatch(types.S_SELECT_CLEAR_DATA)
  dispatch(types.C_SET_PAGE, 1)
  syncData({ dispatch, state })
}

export const removeScreen = function({ dispatch, state }, ids) {
  Api.Screen.removeAll(ids, (r) => {
    popupMsg(r.message)
    dispatch(types.S_SET_REMOVE_MODAL)
      // setTimeout(()=>this.$route.router.go(GO),400)
    setTimeout(() => {
      const SCREEN_STORE = state.screen
      if (this.$route.params.screenId) {
        router.go('/m/screen/list/' + (parseInt(SCREEN_STORE.page)))
        syncData({ dispatch, state })
      }

    }, 400)

    // this.$route.router.go(GO)
  }, (e) => popupErrMsg(e.message))
}

export const removeScreenAll = function({ dispatch, state }, ids) {
  Api.Screen.removeAll(ids, (r) => {
    popupMsg(r.message)
    dispatch(types.S_SET_REMOVE_MODAL)
      // dispatch(types.S_SET_LIST_INIT)
    dispatch(types.S_SELECT_CLEAR_DATA)
    syncData({ dispatch, state })
  }, (e) => popupErrMsg(e.message))
}

export const updateScreen = function({ dispatch, state }, screen, GO) {
  Api.Screen.update(screen, (r) => {
    popupMsg(r.message)
    this.$route.router.go(GO)
  }, (err) => popupErrMsg(err.message))
}

export const addScreen = function({ dispatch, state }, screen, GO) {

  Api.Screen.create(screen, (r) => {
    popupMsg(r.message)
    this.$route.router.go(GO)
  }, (err) => popupErrMsg(err.message))
}
export const setOther = function({ dispatch, state }, bool) {
  dispatch(types.SET_OTHER, bool)
}


export const updateValid = function({ dispatch, state }, id, valid) {
  Api.Screen.updateValid({ _id: id, isValid: valid }, (r) => {
    popupMsg(r.message)
    var filter = {}

    const SCREEN_STORE = state.screen

    if (SCREEN_STORE.creator !== '_ALL') {
      filter.creator = SCREEN_STORE.creator
    }

    if (SCREEN_STORE.period !== '_ALL') {
      filter.period = moment().subtract(1, SCREEN_STORE.period)
    }

    if (SCREEN_STORE.location !== '_ALL') {
      filter.location = SCREEN_STORE.location
    }
    if (SCREEN_STORE.sort !== '_ALL') {
      filter.sort = SCREEN_STORE.sort
    }

    // fetch all screens
    Api.Screen.list({ page: SCREEN_STORE.showDetailPage }, filter, (r) => {
      var result = r.data.list || {}
      var screens = result.docs || {}
      dispatch(types.S_SHOW_DETAIL_SYNC_DATA, screens)
      if (SCREEN_STORE.showDetailPage === SCREEN_STORE.page) {
        dispatch(types.S_SET_RESULT, result)
        dispatch(types.S_SET_SCREENS, screens)
        dispatch(types.S_SELECT_INIT_DATA)
        dispatch(types.S_SELECT_SYNC_DATA)
      }

    }, (e) => {})
  }, (err) => popupErrMsg(err.message))
}

export const syncData = function syncData({ dispatch, state }, refresh) {
  // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息
  if (_.isUndefined(refresh)) {
    refresh = false
  }

  var filter = {}

  const SCREEN_STORE = state.screen

  if (SCREEN_STORE.creator !== '_ALL') {
    filter.creator = SCREEN_STORE.creator
  }

  if (SCREEN_STORE.period !== '_ALL') {
    filter.period = moment().subtract(1, SCREEN_STORE.period)
  }

  if (SCREEN_STORE.location !== '_ALL') {
    filter.location = SCREEN_STORE.location
  }
  if (SCREEN_STORE.sort !== '_ALL') {
    filter.sort = SCREEN_STORE.sort
  }

  // fetch all screens
  Api.Screen.list({ page: SCREEN_STORE.page }, filter, (r) => {
      var result = r.data.list || {}
      var screens = result.docs || {}

      dispatch(types.S_SET_RESULT, result)
      dispatch(types.S_SET_SCREENS, screens)

      dispatch(types.S_SELECT_INIT_DATA)
      dispatch(types.S_SELECT_SYNC_DATA)

      dispatch(types.S_SHOW_DETAIL_SYNC_DATA, screens)

      if (SCREEN_STORE.screens.length === 0 && parseInt(SCREEN_STORE.page) > 1) {
        dispatch(types.S_SET_PAGE, (parseInt(SCREEN_STORE.page) - 1))
          // router.go('/m/screen/list/' + (parseInt(SCREEN_STORE.page) - 1))
        syncData({ dispatch, state })
      }
    }, (e) => popupErrMsg(e.message), !refresh) // 是否显示错误开关，缺省都是显示的，在循环刷新数据时不需要显示错误信息

  if (!refresh) {
    // sync location data with backend
    syncLocData({ dispatch, state })

    // sync user data with backend
    syncAllUsersData({ dispatch, state })
  }
}


export const saveHouse = function({ dispatch, state }, id, data, bool) {
    Api.PlayList.update({ '_id': id, 'playUnits': data, 'isPublished': bool }, (r) => {
      var count = 0
      popupMsg(r.message)
      if (bool === true) {
        var timeout = setInterval(
          () => {
            Api.PlayList.publishHistroy(id, (r) => {
              if (r.data.response === false) {
                popupMsg('正在发布中...')
                count++
                if (count === 3) {
                  popupErrMsg('发布失败')
                  clearInterval(timeout)
                }
              } else {
                popupMsg('发布成功')
                clearInterval(timeout)
              }
            }, (err) => popupErrMsg(r.message))
          }, 3000
        )
      }
    }, (err) => {
      if (err.data.noVideo || err.data.noImage || err.data.noSale || err.data.hasOverallView || err.data.noOtherProperties) {
        var messeng = '以下房源不符合展播要求:<br>'
        if (err.data.noVideo.length !== 0) {
          messeng += ' 缺少视频: '
          for (var i = 0; i < err.data.noVideo.length; i++) {
            messeng += err.data.noVideo[i]
            if (i !== err.data.noVideo.length - 1)
              messeng += ' , '
            else
              messeng += '<br>'
          }
        }
        if (err.data.noImage.length !== 0) {
          messeng += ' 缺少透明底户型图: '
          for (i = 0; i < err.data.noImage.length; i++) {
            messeng += err.data.noImage[i]
            if (i !== err.data.noImage.length - 1)
              messeng += ' , '
            else
              messeng += '<br>'
          }
        }
        if (err.data.noSale.length !== 0) {
          messeng += ' 不是在售二手房源: '
          for (i = 0; i < err.data.noSale.length; i++) {
            messeng += err.data.noSale[i]
            if (i !== err.data.noSale.length - 1) {
              messeng += ' , '
            } else {
              messeng += '<br>'
            }
          }
        }
        if (err.data.hasOverallView.length !== 0) {
          messeng += ' 有全景视频: '
          for (i = 0; i < err.data.hasOverallView.length; i++) {
            messeng += err.data.hasOverallView[i]
            if (i !== err.data.hasOverallView.length - 1)
              messeng += ' , '
            else
              messeng += '<br>'
          }
        }
        if (err.data.noOtherProperties.length !== 0) {
          messeng += ' 有全景视频: '
          for (i = 0; i < err.data.noOtherProperties.length; i++) {
            messeng += err.data.noOtherProperties[i]
            if (i !== err.data.noOtherProperties.length - 1)
              messeng += ' , '
            else
              messeng += '<br>'
          }
        }
        popupErrMsg(messeng, 10000)
      } else {
        popupErrMsg(err.message)
        return
      }
    })
  }
  // ----------------------删除
export const setRemoveModal = function({ dispatch, state }) {
  dispatch(types.S_SET_REMOVE_MODAL)
}


//mobile  

export const setFilter = function({ dispatch, state }, filter, value) {
  if (filter === 'creator') {
    dispatch(types.S_SET_CREATOR, value)
  }
  if (filter === 'period') {
    dispatch(types.S_SET_PERIOD, value)
  }
  if (filter === 'location') {
    dispatch(types.S_SET_LOCATION, value)
  }
  if (filter === 'filter') {
    dispatch(types.S_SET_PAGE, 1)

  }
  syncData({ dispatch, state })
}
export const setModalReset = function({ dispatch, state }, id, Bool) {
  dispatch(types.S_SET_MODAL_INIT)
  syncAppsData({ dispatch, state }, id, Bool)
}


export const setModalFilter = function({ dispatch, state }, filter, value) {
  if (filter === 'creator') {
    dispatch(types.S_SET_MODAL_CREATOR, value)
  }
  if (filter === 'period') {
    dispatch(types.S_SET_MODAL_PERIOD, value)
  }
  if (filter === 'type') {
    dispatch(types.S_SET_MODAL_TYPE, value)
  }
  if (filter === 'filter') {
    dispatch(types.S_SET_MODAL_PAGE, 1)

  }
  syncAppsData({ dispatch, state })
}

export const setFentchScreenOne = function({ dispatch, state }, id) {
  Api.Screen.fetchOne(id, (r) => {
    // popupMsg(r.message)
    var screenOne = r.data.screen || {}
    if (screenOne.app) {
      setFentchAppOne({ dispatch, state }, screenOne.app)
    }

    dispatch(types.S_SET_SCREEN_ONE, screenOne)

  }, (err) => popupErrMsg(err.message))


}