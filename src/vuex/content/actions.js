// /src/vuex/content/actions.js

import * as types from './mutation-types'
import Api from '../../net/api'
import Device from '../../util/device'
import { popupErrMsg, popupMsg } from '../../util/popupMessage'
import moment from 'moment'
import _ from 'lodash'
import { router } from '../../main'

// const HOME = '/m/content/list/1/'
export const setCleanContentSelectIds = function({ dispatch, state }) {
  dispatch(types.C_SET_CLEAN_SELECTIDS)
}
export const cur = function({ dispatch, state }, c) {
  var s = state.content
  if (!s.ispreview) {
    return
  }
  var index = _.findIndex(s.allcontent, c)

  dispatch(types.C_SET_PREVIEW_CONTENT, index)
}
export const pre = function({ dispatch, state }) {
  var s = state.content
  if (!s.ispreview) {
    return
  }
  var index = _.findIndex(s.allcontent, s.previewShowDetailContent)
  if (index === 0) {
    popupMsg('亲，已经是第一个啦！')
    return
  }
  dispatch(types.C_SET_PREVIEW_CONTENT, index - 1)
}

export const next = function({ dispatch, state }) {
  var s = state.content
  if (!s.ispreview) {
    return
  }
  var index = _.findIndex(s.allcontent, s.previewShowDetailContent)

  if (index === s.allcontent.length - 1) {
    popupMsg('亲，已经是最后一个啦！')
    return
  }

  dispatch(types.C_SET_PREVIEW_CONTENT, index + 1)
}

export const setSelectAll = function({ dispatch, state }) {
  dispatch(types.C_SELECT_ALL)

  for (var i = 0; i < state.content.selected.length; i++) {
    dispatch(types.C_SELECTED_ID, i)
  }

  dispatch(types.C_SELECT_SYNC_DATA)
}

export const setSelected = function({ dispatch, state }, index) {
  dispatch(types.C_SELECTED, index)
  dispatch(types.C_SELECTED_ID, index)
  dispatch(types.C_SELECT_SYNC_DATA)
}

export const setLeave = function({ dispatch, state }, bool) {
  dispatch(types.C_SET_LEAVE, bool)
}

// 是否离开此页面素材模态框
export const setLeaveContentModal = function({ dispatch, state }) {
  dispatch(types.C_SET_LEAVE_CONTENT_MODAL)
}


// 删除素材模态框
export const setDeleteContentModal = function({ dispatch, state }) {
  dispatch(types.C_SET_DETELE_CONTENT_MODAL)
}

// 添加素材模态框
export const setAddContentPush = function({ dispatch, state }, GO) {
  dispatch(types.C_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state }, GO)
}

export const setAddContentModal = function({ dispatch, state }, GO) {
    dispatch(types.C_SET_MODAL_PAGE, 1)
    syncData({ dispatch, state }, GO)
    dispatch(types.C_SET_ADD_CONTENT_MODAL)
  }
  // 推送模态框 - 获取contents
export const syncData = function syncData({ dispatch, state }) {
  var filter = {}
  const MODAL_STORE = state.content.modalFilter

  filter.isPaged = true

  filter.limit = 21
  if (Device.isMobile) {
    filter.limit = 24

  }
  if (MODAL_STORE.creator !== '_ALL') {
    filter.creator = MODAL_STORE.creator
  }

  if (MODAL_STORE.period !== '_ALL') {
    filter.period = moment().subtract(1, MODAL_STORE.period)
  }
  if (MODAL_STORE.type !== '_ALL') {
    filter.type = MODAL_STORE.type
  }
  if (MODAL_STORE.sort !== '_ALL') {
    filter.sort = MODAL_STORE.sort
  }
  // fetch all contents
  Api.Content.list({ page: MODAL_STORE.page }, filter, (r) => {
    var result = r.data.list || {}
    var contents = result.docs || {}
    dispatch(types.C_SET_MODAL_RESULT, result)
    dispatch(types.C_SET_MODAL_CONTENTS, contents)
    dispatch(types.C_SET_MODAL_SELECT_INIT_DATA)
  }, (e) => {

  })
}

// 推送模态框 - 过滤
export const removeModalSelected = function({ dispatch, state }, id) {
  dispatch(types.C_SET_REMOVE_MODAL_SELECTEDIDS, id)
}

export const setModalPage = function({ dispatch, state }, page) {
  dispatch(types.C_SET_MODAL_PAGE, page)
  syncData({ dispatch, state })
}

export const setModalCreator = function({ dispatch, state }, creator) {
  dispatch(types.C_SET_MODAL_CREATOR, creator)
  dispatch(types.C_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state })
}

export const setModalPeriod = function({ dispatch, state }, period) {
  dispatch(types.C_SET_MODAL_PERIOD, period)
  dispatch(types.C_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state })
}

export const setModalType = function({ dispatch, state }, type) {
  dispatch(types.C_SET_MODAL_TYPE, type)
  dispatch(types.C_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state })
}
export const setModalSort = function({ dispatch, state }, sort) {
  dispatch(types.C_SET_MODAL_SORT, sort)
  dispatch(types.C_SET_MODAL_PAGE, 1)
  syncData({ dispatch, state })
}
export const setModalSelected = function({ dispatch, state }, index, GO) {
  dispatch(types.C_SET_MODAL_SELECTED, index, GO)
  dispatch(types.C_SET_MODAL_SELECTEDIDS, index, GO)

}


// 右侧详情是否显示
export const setDetail = function({ dispatch, state }) {
  dispatch(types.C_SET_DETAIL)
}

// 素材列表和卡片视图切换
export const setView = function({ dispatch, state }) {
  dispatch(types.C_SET_VIEW)
}

// 素材预览
export const setPreview = function({ dispatch, state }, BOOL) {
  dispatch(types.C_SET_PREVIEW, BOOL)
  if (state.content.ispreview) {
    getAllContents({ dispatch, state })
  }
}

export const setPreviewDetail = function({ dispatch, state }, index) {
  dispatch(types.C_SET_PREVIEW_CONTENT, index)
}

// 获取所有的图片
export const getAllContents = function({ dispatch, state }) {
  var filter = {}
  const CONTENT_STORE = state.content


  filter.isPaged = false


  if (CONTENT_STORE.creator !== '_ALL') {
    filter.creator = CONTENT_STORE.creator
  }

  if (CONTENT_STORE.period !== '_ALL') {
    filter.period = moment().subtract(1, CONTENT_STORE.period)
  }
  if (CONTENT_STORE.type !== '_ALL') {
    filter.type = CONTENT_STORE.type
  }

  if (CONTENT_STORE.sort !== '_ALL') {
    filter.sort = CONTENT_STORE.sort
  }

  Api.Content.list({ page: 'all' }, filter, (r) => {
    var result = r.data.list || {}
    var all = result.docs || {}
    dispatch(types.C_SET_ALL_CONTENTS, all)
    dispatch(types.C_SYNC_PREVIEW_CONTENT_DATA)
    dispatch(types.C_SET_PREVIEW_CONTENT)
  }, (e) => {})
}


// 分页
export const setPage = function({ dispatch, state }, page, GO) {
  dispatch(types.C_SET_PAGE, page)
  syncContentsData({ dispatch, state }, GO)
}

// 过滤器
export const setCreator = function({ dispatch, state }, creator) {
  dispatch(types.C_SET_CREATOR, creator)
  dispatch(types.C_SELECT_CLEAR_DATA)
  dispatch(types.C_SET_PAGE, 1)
  syncContentsData({ dispatch, state })
}

export const setPeriod = function({ dispatch, state }, period) {
  dispatch(types.C_SET_PERIOD, period)
  dispatch(types.C_SELECT_CLEAR_DATA)
  dispatch(types.C_SET_PAGE, 1)
  syncContentsData({ dispatch, state })
}

export const setType = function({ dispatch, state }, type) {
  dispatch(types.C_SET_TYPE, type)
  dispatch(types.C_SELECT_CLEAR_DATA)
  dispatch(types.C_SET_PAGE, 1)
  syncContentsData({ dispatch, state })
}

export const setSort = function({ dispatch, state }, sort, GO) {
  dispatch(types.C_SET_SORT, sort)
  dispatch(types.C_SELECT_CLEAR_DATA)
  dispatch(types.C_SET_PAGE, 1)
  syncContentsData({ dispatch, state }, GO)
}

export const setQueue = function({ dispatch, state }, q) {
  dispatch(types.C_SET_QUEUE, q)
}

// 上传成功更新素材内容 - 判断是不是视频文件，若是，5秒后刷新一次，15秒后结束
export const createContent = function({ dispatch, state }, content) {
  Api.Content.create(content, (r) => {
    // popupMsg(r.message)
    syncContentsData({ dispatch, state })
    var i = content.name.lastIndexOf('.')
    if (content.name.substring(i) === '.mp4' || content.name.substring(i) === '.avi' || content.name.substring(i) === '.mov' ||
      content.name.substring(i) === '.rmvb' || content.name.substring(i) === '.asf' || content.name.substring(i) === '.wmv') {
      var setRoll = setInterval(function() {
        syncContentsData({ dispatch, state })
      }, 4000)

      setTimeout(function() {
        clearInterval(setRoll)
      }, 10000)
    }
  }, (err) => popupErrMsg(err.message))
}


// 编辑素材内容
export const updateContentOne = function({ dispatch, state }, who, content, GO) {
  var data = {}
  const CONTENT_STORE = state.content
  data._id = CONTENT_STORE.showDetailContent._id
  if (who === 'name') {
    data.name = content
  } else {
    data.memo = content
  }

  Api.Content.update(data, (r) => {
    popupMsg(r.message)
    syncContentsData({ dispatch, state })


    // this.$dispatch('C_SELECT_INIT_EDIT')
  }, (err) => popupErrMsg(err.message))
}

export const removeContent = function({ dispatch, state }, GO) {
  var list = []
  const CONTENT_STORE = state.content

  if (CONTENT_STORE.removeContentCodes.length === 0) {
    dispatch(types.C_SET_DETELE_CONTENT_MODAL)
    return
  }

  for (var i = 0; i < CONTENT_STORE.removeContentCodes.length; i++) {
    list.push(CONTENT_STORE.removeContentCodes[i][0])
  }

  Api.Content.remove(list, (r) => {
    popupMsg(r.message)
    dispatch(types.C_SET_LIST_INIT)
    dispatch(types.C_SET_DETELE_CONTENT_MODAL)
    dispatch(types.C_SELECT_CLEAR_DATA)
    syncContentsData({ dispatch, state })
  }, (err) => popupErrMsg(err.message))
}

export const syncContentsData = function syncData({ dispatch, state }, content) {
    var filter = {}
    const CONTENT_STORE = state.content
    filter.isPaged = CONTENT_STORE.isPaged

    filter.limit = 21
    if (Device.isMobile) {
      filter.limit = 24
    }
    if (CONTENT_STORE.creator !== '_ALL') {
      filter.creator = CONTENT_STORE.creator
    }

    if (CONTENT_STORE.period !== '_ALL') {
      filter.period = moment().subtract(1, CONTENT_STORE.period)
    }
    if (CONTENT_STORE.type !== '_ALL') {
      filter.type = CONTENT_STORE.type
    }
    if (CONTENT_STORE.sort !== '_ALL') {
      filter.sort = CONTENT_STORE.sort
    }

    // fetch all contents
    Api.Content.list({ page: CONTENT_STORE.page }, filter, (r) => {
      var result = r.data.list || {}
      var contents = result.docs || {}

      dispatch(types.C_SET_RESULT, result)
      dispatch(types.C_SET_CONTENTS, contents)
      dispatch(types.C_SELECT_INIT_DATA)
      dispatch(types.C_SELECT_SYNC_DATA)
      dispatch(types.C_SHOW_DETAIL_SYNC_DATA, contents)
      if (CONTENT_STORE.contents.length === 0 && parseInt(CONTENT_STORE.page) > 1) {
        if (content) {
          router.go('/m/content')

        } else {
          router.go('/m/content/list/' + (parseInt(CONTENT_STORE.page) - 1))
        }

      }
    }, (e) => {
      popupErrMsg(e.message)
    })
  }
  //mobile 
export const setModalFilter = function({ dispatch, state }, filter, value, id, bool, GO) {
  if (filter === 'creator') {
    dispatch(types.C_SET_MODAL_CREATOR, value)
  }
  if (filter === 'period') {
    dispatch(types.C_SET_MODAL_PERIOD, value)
  }
  if (filter === 'type') {
    dispatch(types.C_SET_MODAL_TYPE, value)
  }
  if (filter === 'filter') {
    dispatch(types.C_SET_MODAL_PAGE, 1)
  }
  syncData({ dispatch, state }, id, bool, GO)
}

export const setFilter = function({ dispatch, state }, filter, value, GO) {
  if (filter === 'creator') {
    dispatch(types.C_SET_CREATOR, value)
  }
  if (filter === 'period') {
    dispatch(types.C_SET_PERIOD, value)
  }
  if (filter === 'type') {
    dispatch(types.C_SET_TYPE, value)
  }
  if (filter === 'filter') {
    dispatch(types.C_SET_PAGE, 1)

  }
  syncContentsData({ dispatch, state }, GO)
}
export const setModalReset = function({ dispatch, state }, GO) {
  setAddContentModal({ dispatch, state }, GO)
  syncData({ dispatch, state }, GO)
}

export const setReset = function({ dispatch, state }) {
  dispatch(types.C_SET_LIST_INIT)
  syncContentsData({ dispatch, state })
}


export const setFentchContentOne = function({ dispatch, state }, id) {
  Api.Content.fetchOne(id, (r) => {
    // popupMsg(r.message)
    var contentOne = r.data || {}
    dispatch(types.C_SET_CONTENT_ONE, contentOne)
  }, (err) => popupErrMsg(err.message))
}