// /src/vuex/content/store.js

import _ from 'lodash'

import {
  C_SET_CLEAN_SELECTIDS,
  // 过滤器
  C_SET_CREATOR,
  C_SET_PERIOD,
  C_SET_TYPE,
  C_SET_PAGE,

  C_SET_SORT,

  // 模态对话框／信息面板 开关
  C_SET_VIEW,
  C_SET_DETAIL,
  C_SET_QUEUE,
  C_SET_PREVIEW,
  C_SET_DETELE_CONTENT_MODAL,
  C_SET_LEAVE,
  C_SET_LEAVE_CONTENT_MODAL,
  C_SET_ADD_CONTENT_MODAL,

  C_SET_CONTENTS,
  C_SET_ALL_CONTENTS,
  C_SET_PREVIEW_CONTENT,
  C_SYNC_PREVIEW_CONTENT_DATA,
  C_SET_RESULT,
  C_SET_LIST_INIT,

  C_SELECTED_ID,
  C_SELECTED,
  C_SELECT_ALL,
  C_SELECT_SYNC_DATA,
  C_SELECT_INIT_DATA,
  C_SELECT_CLEAR_DATA,
  C_SHOW_DETAIL_SYNC_DATA,

  //推送
  C_SET_MODAL_INIT,
  C_SET_MODAL_RESULT,
  C_SET_MODAL_CONTENTS,
  C_SET_MODAL_PAGE,
  C_SET_MODAL_CREATOR,
  C_SET_MODAL_PERIOD,
  C_SET_MODAL_TYPE,
  C_SET_MODAL_SORT,
  C_SET_MODAL_SELECTED,
  C_SET_MODAL_SELECTEDIDS,
  C_SET_MODAL_SELECT_INIT_DATA,
  C_SET_REMOVE_MODAL_SELECTEDIDS,
  C_SET_CONTENT_ONE

} from './mutation-types'

const state = {
  queues: [], // 上传队列
  preList: [],
  contents: [],
  result: {},
  allcontent: [],

  page: 1,
  isPaged: true,

  isDeleteContentModal: false,
  isAddContentModal: false,
  isLeaveContentModal: false,
  isLeave: true,

  isview: false,
  isdetail: true,
  ispreview: false,
  queueStatus: 'close', // 上传队列是否显示,默认不显示

  creator: '_ALL',
  period: '_ALL',
  type: '_ALL',
  sort: '-createTime',

  selectAll: false,
  selectOneAbove: false,
  selected: [],
  selectedIDs: [],
  selectedLists: [],

  currentIndex: 0,
  showDetailPage: '',
  showDetailContent: null,
  previewShowDetailContent: null,
  previewContent: [],

  removeContentCodes: [],
  screenContentCodes: [],


  modalFilter: {
    page: 1,
    sort: '-createTime',
    creator: '_ALL',
    type: '_ALL',
    period: '_ALL'
  },
  modalContents: {
    result: {},
    total: [],
    contents: [],
    modalselected: [],
    modalselectIds: [],
    modalselectLists: []
  },

  total: []

}

const mutations = {
  // 推送
  [C_SET_REMOVE_MODAL_SELECTEDIDS](state, id) {
    state.modalContents.modalselectIds.splice(state.modalContents.modalselectIds.indexOf(id), 1)
    for (var i = 0; i < state.modalContents.modalselectLists.length; i++) {
      if (state.modalContents.modalselectLists[i]._id === id) {
        state.modalContents.modalselectLists.splice(i, 1)
      }
    }

  },

  [C_SET_MODAL_INIT](state) {
    state.modalContents.modalselected = []
    state.modalContents.modalselectIds = []
    state.modalContents.modalselectLists = []
  },


  [C_SET_MODAL_SELECTEDIDS](state, index, GO) {
    if (GO) {
      if (state.modalContents.modalselected[index] && state.modalContents.modalselectIds.indexOf(state.modalContents.total[index]._id) === -1) {
        state.modalContents.modalselectIds.push(state.modalContents.total[index]._id)
        state.modalContents.modalselectLists.push(state.modalContents.total[index])
      } else if (!state.modalContents.modalselected[index] && state.modalContents.modalselectIds.indexOf(state.modalContents.total[index]._id) > -1) {
        state.modalContents.modalselectIds.splice(state.modalContents.modalselectIds.indexOf(state.modalContents.total[index]._id), 1)
        for (var i = 0; i < state.modalContents.modalselectLists.length; i++) {
          if (state.modalContents.modalselectLists[i]._id === state.modalContents.total[index]._id) {
            state.modalContents.modalselectLists.splice(i, 1)
            break
          }
        }
      }
      return
    }
    if (state.modalContents.modalselected[index] && state.modalContents.modalselectIds.indexOf(state.modalContents.contents[index]._id) === -1) {
      state.modalContents.modalselectIds.push(state.modalContents.contents[index]._id)
      state.modalContents.modalselectLists.push(state.modalContents.contents[index])
    } else if (!state.modalContents.modalselected[index] && state.modalContents.modalselectIds.indexOf(state.modalContents.contents[index]._id) > -1) {
      state.modalContents.modalselectIds.splice(state.modalContents.modalselectIds.indexOf(state.modalContents.contents[index]._id), 1)
      for (var i = 0; i < state.modalContents.modalselectLists.length; i++) {
        if (state.modalContents.modalselectLists[i]._id === state.modalContents.contents[index]._id) {
          state.modalContents.modalselectLists.splice(i, 1)
          break
        }
      }
    }
  },

  [C_SET_MODAL_SELECTED](state, index) {
    state.modalContents.modalselected.$set(index, !state.modalContents.modalselected[index])
  },


  [C_SET_MODAL_SELECT_INIT_DATA](state) {
    state.modalContents.modalselected.length = 0
    for (var i = 0; i < state.modalContents.contents.length; i++) {
      state.modalContents.modalselected.$set(i, false)
    }
    // 根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.modalContents.modalselected.length; i++) {
      if (state.modalContents.contents[i] && state.modalContents.modalselectIds.indexOf(state.modalContents.contents[i]._id) > -1) {
        state.modalContents.modalselected[i] = true
      }
    }
  },

  [C_SET_MODAL_RESULT](state, result) {
    state.modalContents.result = result
  },
  [C_SET_MODAL_CONTENTS](state, contents) {
    state.modalContents.contents = contents

    if (state.modalFilter.page === 1) {
      state.modalContents.total = contents
      return
    }
    for (var i = 0; i < contents.length; i++) {
      state.modalContents.total.push(contents[i])
    }



  },

  [C_SET_MODAL_PAGE](state, page) {
    state.modalFilter.page = page
  },
  [C_SET_MODAL_CREATOR](state, creator) {
    state.modalFilter.creator = state.modalFilter.creator === creator ? '_ALL' : creator
  },

  [C_SET_MODAL_PERIOD](state, period) {
    state.modalFilter.period = state.modalFilter.period === period ? '_ALL' : period
  },
  [C_SET_MODAL_TYPE](state, type) {
    state.modalFilter.type = state.modalFilter.type === type ? '_ALL' : type
  },
  [C_SET_MODAL_SORT](state, sort) {
    if (sort === 'name') {
      if (state.modalFilter.sort === '-name') {
        state.modalFilter.sort = sort
      } else {
        state.modalFilter.sort = '-' + sort
      }
    }
    if (sort === 'createTime') {
      if (state.modalFilter.sort === '-createTime') {
        state.modalFilter.sort = sort
      } else {
        state.modalFilter.sort = '-' + sort
      }
    }
    if (sort === 'size') {
      if (state.modalFilter.sort === 'size') {
        state.modalFilter.sort = '-' + sort
      } else {
        state.modalFilter.sort = sort
      }
    }

  },


  [C_SET_CLEAN_SELECTIDS](state) {
    state.selectedIDs = []
    state.showDetailPage = ''
    state.showDetailContent = null
    state.selectOneAbove = false
  },

  [C_SET_CREATOR](state, creator) {
    state.creator = state.creator === creator ? '_ALL' : creator
  },

  [C_SET_PERIOD](state, period) {
    state.period = state.period === period ? '_ALL' : period
  },

  [C_SET_TYPE](state, type) {
    state.type = state.type === type ? '_ALL' : type
  },

  [C_SET_SORT](state, sort) {
    if (sort === 'createTime') {
      if (state.sort === '-createTime') {
        state.sort = sort
      } else {
        state.sort = '-' + sort
      }
    }

    if (sort === 'size') {
      if (state.sort === 'size') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }

    if (sort === 'creator') {
      if (state.sort === 'creator') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }

    if (sort === 'name') {
      if (state.sort === 'name') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }
  },

  [C_SET_ADD_CONTENT_MODAL](state) {
    state.modalContents.modalselected = []
    state.modalContents.modalselectIds = []
    state.modalContents.modalselectLists = []
    state.modalFilter = {
      page: 1,
      sort: '-createTime',
      creator: '_ALL',
      type: '_ALL',
      period: '_ALL'
    }
    state.isAddContentModal = !state.isAddContentModal
  },

  [C_SET_DETELE_CONTENT_MODAL](state) {
    state.isDeleteContentModal = !state.isDeleteContentModal
    state.removeContentCodes = []
    state.screenContentCodes = []

    for (var i = 0; i < state.selectedLists.length; i++) {
      var arr = []
      var brr = []
      if (state.selectedLists[i].usageCount === 0) {
        arr.push(state.selectedLists[i]._id, state.selectedLists[i].name)
        state.removeContentCodes.push(arr)
      } else {
        brr.push(state.selectedLists[i]._id, state.selectedLists[i].name)
        state.screenContentCodes.push(brr)
      }
    }
  },
  [C_SET_LEAVE_CONTENT_MODAL](state) {
    state.isLeaveContentModal = !state.isLeaveContentModal
  },

  [C_SET_LEAVE](state, BOOL) {
    state.isLeave = BOOL
    if (state.isLeave) {
      state.isLeaveContentModal = false
    }
  },

  // 预览
  [C_SET_PREVIEW](state, BOOL) {
    if (BOOL === false) {
      state.ispreview = false
      return
    }
    state.ispreview = !state.ispreview
  },

  // 获得所有的allcontent之后，调用此函数，将previewShowDetailContent设置成新的列表中的相应的对象
  [C_SYNC_PREVIEW_CONTENT_DATA](state) {
    if (state.ispreview && state.showDetailContent) {
      var index = _.findIndex(state.allcontent, function(c) {
        return c._id === state.showDetailContent._id
      })

      if (index < 0) {
        return
      }
      state.previewShowDetailContent = state.allcontent[index]
      state.currentIndex = index
    }
  },

  [C_SET_DETAIL](state) {
    state.isdetail = !state.isdetail
  },

  [C_SET_VIEW](state) {
    state.isview = !state.isview
  },

  [C_SET_RESULT](state, result) {
    state.result = result
  },

  [C_SET_PAGE](state, page) {
    state.page = page
  },

  [C_SET_ALL_CONTENTS](state, allcontent) {
    state.allcontent = allcontent

    for (var i = 0; i < allcontent.length; i++) {
      var c = {}
      c._id = allcontent[i]._id
      c.name = allcontent[i].name
      c.title = allcontent[i].name
      c.type = allcontent[i].type
      if (allcontent[i].type === 'IMAGE') {
        c.src = allcontent[i].url
        c.w = allcontent[i].resolution ? allcontent[i].resolution.width : 512
        c.h = allcontent[i].resolution ? allcontent[i].resolution.height : 512
      }
      if (allcontent[i].type === 'VIDEO') {
        c.src = allcontent[i].previewUrl
        c.w = allcontent[i].stages === 0 ? 512 : allcontent[i].resolution.width
        c.h = allcontent[i].stages === 0 ? 512 : allcontent[i].resolution.height
      }
      state.preList.push(c)
    }

  },

  [C_SET_QUEUE](state, q) {
    state.queueStatus = q
  },

  [C_SET_CONTENTS](state, contents) {
    state.contents = contents
    if (state.page === 1) {
      state.total = contents
      return
    }
    for (var i = 0; i < contents.length; i++) {
      state.total.push(contents[i])
    }
  },
  [C_SET_LIST_INIT](state) {
    state.sort = '-createTime'
    state.creator = '_ALL'
    state.type = '_ALL'
    state.period = '_ALL'
    state.page = 1
  },
  // 当开关数组中index位置的开关发生变化后，同步ID数组
  [C_SELECTED_ID](state, index) {
    if (state.selected[index] && state.contents[index] && state.selectedIDs.indexOf(state.contents[index]._id) === -1) {
      // 设置开关为true，同时ID数组中没有对应屏幕ID时，便添加其ID
      state.selectedIDs.push(state.contents[index]._id)
      state.selectedLists.push(state.contents[index])
    } else if (!state.selected[index] && state.selectedIDs.indexOf(state.contents[index]._id) > -1) {
      // 设置开关为false，同时ID数组中有对应屏幕ID时，便将其移除
      state.selectedIDs.splice(state.selectedIDs.indexOf(state.contents[index]._id), 1)
      for (var i = 0; i < state.selectedLists.length; i++) {
        if (state.selectedLists[i]._id === state.contents[index]._id) {
          state.selectedLists.splice(i, 1)
          break
        }
      }
    }
  },

  [C_SELECTED](state, index) {
    state.selected.$set(index, !state.selected[index])

    if (state.selected[index]) {
      state.showDetailPage = state.page
      state.showDetailContent = state.contents[index]
    } else {
      for (var i = 0; i < state.selected.length; i++) {
        if (state.selected[i] === true) {
          state.showDetailPage = state.page
          state.showDetailContent = state.contents[i]
          return
        }
      }
      state.showDetailPage = ''
      state.showDetailContent = null
    }

    var count = 0
    for (var j = 0; j < state.selected.length; j++) {
      if (state.selected[j] === true) {
        count++
      }
    }
  },

  [C_SELECT_ALL](state) {
    state.selectAll = !state.selectAll

    for (var i = 0; i < state.selected.length; i++) {
      state.selected.$set(i, state.selectAll)
    }

    if (state.selectAll) {
      state.showDetailContent = state.contents[0]
    } else {
      state.showDetailContent = null
    }
  },

  [C_SELECT_SYNC_DATA](state) {
    var count = 0
    for (var i = 0; i < state.selected.length; i++) {
      if (state.selected[i] === true) {
        count++
      }
    }

    if (state.selectedIDs.length > 0) {
      state.selectOneAbove = true
    } else {
      state.selectOneAbove = false
    }

    if (count === state.selected.length && count > 0) {
      state.selectAll = true
    } else {
      state.selectAll = false
    }
  },
  // 根据删除的id同步一次ID数组
  [C_SELECT_CLEAR_DATA](state) {
    state.selectedIDs = []
    state.selectedLists = []
    state.screenContentCodes = []
    state.removeContentCodes = []
    state.selected.length = 0
    state.selectAll = false
    state.selectOneAbove = false
    state.showDetailContent = null
  },
  [C_SELECT_INIT_DATA](state) {
    state.selected.length = 0
    for (var i = 0; i < state.contents.length; i++) {
      state.selected.$set(i, false)
    }

    // 刷新选中开关数据后，同步ID数据里面的值，第一步，去除ID数组中无效的ID
    // var newIDs = []
    // var newLists = []
    // for (i = 0; i < state.selectedIDs.length; i++) {
    //   for (var j = 0; j < state.contents.length; j++) {
    //     if (state.contents[j]._id === state.selectedIDs[i]) {
    //       newIDs.push(state.selectedIDs[i])
    //       newLists.push(state.contents[j])
    //       break
    //     }
    //   }
    // }

    // state.selectedIDs = newIDs
    // state.selectedLists = newLists
    // 第二步，根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.selected.length; i++) {
      if (state.contents[i] && state.selectedIDs.indexOf(state.contents[i]._id) > -1) {
        state.selected[i] = true
      }
    }
  },

  [C_SHOW_DETAIL_SYNC_DATA](state, details) {
    if (state.showDetailContent === null) {
      return
    }

    for (var i = 0; i < details.length; i++) {
      if (details[i]._id === state.showDetailContent._id) {
        state.showDetailContent = details[i]
        return
      }
    }
  },
  [C_SET_CONTENT_ONE](state, contentOne) {
    state.showDetailContent = contentOne
  },
  [C_SET_PREVIEW_CONTENT](state, index) {
    if (index || index === 0) {
      state.previewShowDetailContent = state.allcontent[index]
      state.currentIndex = index
    }
    if (state.allcontent.length <= 21) {
      state.previewContent = state.allcontent
      return
    }

    if (state.allcontent.length > 21) {
      var prenum = state.currentIndex
      var nextnum = state.allcontent.length - state.currentIndex - 1
      var list = []

      if (prenum <= 10) {
        for (var i = 0; i <= prenum; i++) {
          list.push(state.allcontent[i])
        }

        for (var j = prenum + 1; j < 21; j++) {
          list.push(state.allcontent[j])
        }
      }

      if (nextnum <= 10) {
        for (var i = prenum - 1, j = 0; j < 20 - nextnum; j++, i--) {
          list.unshift(state.allcontent[i])
        }
        for (var i = 0; i < nextnum + 1; i++) {
          list.push(state.allcontent[i + prenum])
        }
      }

      if (prenum > 10 && nextnum > 10) {
        for (var i = prenum - 1, j = 0; j < 10; j++, i--) {
          list.unshift(state.allcontent[i])
        }
        for (var i = 0; i <= 10; i++) {
          list.push(state.allcontent[i + prenum])
        }
      }
      state.previewContent = list
    }
  }
}

export default {
  state,
  mutations
}