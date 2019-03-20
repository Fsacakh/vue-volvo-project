// /src/vuex/app/store.js

import {
  A_SET_CLEAN_SELECTIDS,

  A_SET_DETAIL_LEVEL,

  A_SET_PAGE,
  A_SET_RESULT,
  A_SET_APPS,
  A_SET_DETAIL,
  A_SET_LIST_INIT,

  A_SET_CREATOR,
  A_SET_PERIOD,
  A_SET_TYPE,
  A_SET_SORT,
  A_SET_CHECK,

  A_SET_PLAY_MODE,
  A_SET_SWITCH_MODE,

  A_SET_ADD_APP_MODAL,
  A_SET_DETELE_APP_MODAL,

  A_SELECTED_ID,
  A_SELECTED,
  A_SELECT_ALL,
  A_SELECT_SYNC_DATA,
  A_SELECT_INIT_DATA,
  A_SELECT_CLEAR_DATA,
  A_SHOW_DETAIL_SYNC_DATA,

  A_SET_ADD_PUBLISHED_MODAL,
  A_SET_ADD_CANCEL_MODAL,
  A_SET_MODAL_PAGE,
  A_SET_MODAL_CREATOR,
  A_SET_MODAL_PERIOD,
  A_SET_MODAL_LOCATION,
  A_SET_MODAL_SORT,
  A_SET_MODAL_RESULT,
  A_SET_MODAL_SCREENS,
  A_SET_MODAL_SELECTEDIDS,
  A_SET_MODAL_SELECT_INIT_DATA,
  A_SET_MODAL_SELECT_SYNC_DATA,
  A_SET_MODAL_SELECTED,
  A_SET_MODAL_SELECT_ALL,
  A_CHANGE_MODAL_SELECTEDID,

  // A_SET_SIGN_RESULT,
  // A_SET_SIGN_SIGNS,
  // A_SET_SIGN_PAGE,
  // A_SET_SIGN_SELECT_INIT_DATA,
  // A_SET_SIGN_SELECT_SYNC_DATA,
  // A_SET_SIGN_SELECTED,
  // A_SET_SIGN_SELECTEDIDS,
  // A_SET_SIGN_SELECT_ALL,

  A_SET_WECHAT_PAGE,
  A_SET_WECHAT_RESULT,
  A_SET_WECHAT_USERS,
  A_SET_WECHAT_SELECT_INIT_DATA,
  A_SET_WECHAT_SELECT_SYNC_DATA,
  A_SET_WECHAT_SELECTED,
  A_SET_WECHAT_SELECTEDIDS,
  A_SET_WECHAT_SELECT_ALL,
  A_SET_DETELE_WECHAT_MODAL,
  A_SET_CLEAN_WECHAT_SELECTEDIDS,
  A_SET_WECHAT_SORT,
  // 待审核模态框
  A_SET_ADD_CHECK_MODAL,
  A_SET_PENGING_lIST,
  A_REMOVE_PENGING_lIST,
  A_CHANGE_PENGING_lIST,
  A_CHECK_PENDING_COUNT,

  A_SET_APP_ONE
} from './mutation-types'

const state = {
  apps: [],
  result: {},
  page: 1,
  isdetail: true,

  creator: '_ALL',
  period: '_ALL',
  type: '_ALL',
  sort: '-createTime',

  check: '_ALL',
  wechatSort: '-createTime',

  modalCreator: '_ALL',
  modalPeriod: '_ALL',
  modalLocation: '_ALL',
  modalSort: '-createTime',
  modalResult: {},
  modalTotal: [],
  modalScreens: [],
  modalPage: 1,
  modalselectIds: [],
  modalselectNames: [],
  modalselected: [],
  modalselectAll: false,
  selectedNum: 0,

  selectAll: false,
  selectOneAbove: false,
  selected: [],
  selectedIDs: [],
  selectedLists: [],
  showDetailApp: null,

  playmode: 'LOOP',
  switchmode: 'RANDOM',
  playmodes: [
    { '_id': 'LOOP', 'name': '顺序播放' },
    { '_id': 'RANDOM', 'name': '随机播放' }
  ],
  switchmodes: [
    { '_id': 'RANDOM', 'name': '随机切换' },
    { '_id': 'LEFT_TO_RIGHT', 'name': '从左至右' },
    { '_id': 'RIGHT_TO_LEFT', 'name': '从右至左' },
    { '_id': 'TOP_TO_DOWN', 'name': '从上至下' },
    { '_id': 'DOWN_TO_TOP', 'name': '从下至上' }
  ],

  isAddAppModal: false,
  isDeleteAppModal: false,
  isAddPublishedModal: false,
  isAddCancelModal: false,

  // // 签到
  // signSelected: [],
  // signSelectAll: false,
  // signSelectIds: [],
  // selectedSignNum: false,
  // signs: [],
  // signResult: [],
  // signPage: 1,

  // 微信
  isAddCheckModal: false,
  wechatPage: 1,
  wechatResult: [],
  wechatUsers: [],
  wechatTotal: [],
  wechatSelected: [],
  wechatSelectAll: false,
  wechatSelectIds: [],
  selectedWechatNum: false,
  isDeleteWechatModal: false,
  pengingList: [],
  pengingCount: 0,

  total: []
}

const mutations = {
  [A_SET_CLEAN_SELECTIDS](state) {
    state.selectedIDs = []
    state.showDetailApp = null
    state.selectOneAbove = false
  },

  [A_SET_DETAIL_LEVEL](state, bool) {
    state.isdetail = bool
  },
  [A_SET_LIST_INIT](state) {
    state.sort = '-createTime'
    state.creator = '_ALL'
    state.type = '_ALL'
    state.period = '_ALL'
    state.page = 1
  },
  [A_SET_PLAY_MODE](state, val) {
    state.playmode = val
  },
  [A_SET_SWITCH_MODE](state, val) {
    state.switchmode = val
  },

  [A_SET_PAGE](state, page) {
    state.page = page
  },
  [A_SET_RESULT](state, result) {
    state.result = result
  },
  [A_SET_APPS](state, apps) {
    state.apps = apps
    if (state.page === 1) {
      state.total = apps
      return
    }
    for (var i = 0; i < apps.length; i++) {
      state.total.push(apps[i])
    }

  },
  [A_SET_DETAIL](state) {
    state.isdetail = !state.isdetail
  },

  [A_SET_CREATOR](state, creator) {
    state.creator = state.creator === creator ? '_ALL' : creator
  },

  [A_SET_PERIOD](state, period) {
    state.period = state.period === period ? '_ALL' : period
  },

  [A_SET_TYPE](state, type) {
    state.type = state.type === type ? '_ALL' : type
  },

  [A_SET_SORT](state, sort) {
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
    if (sort === 'appType') {
      if (state.sort === 'appType') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }
    if (sort === 'screens') {
      if (state.sort === 'screens') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }
  },

  [A_SET_ADD_APP_MODAL](state) {
    state.isAddAppModal = !state.isAddAppModal
  },
  [A_SET_DETELE_APP_MODAL](state) {
    state.isDeleteAppModal = !state.isDeleteAppModal
  },

  [A_SELECT_ALL](state) {
    state.selectAll = !state.selectAll

    for (var i = 0; i < state.selected.length; i++) {
      state.selected.$set(i, state.selectAll)
    }

    if (state.selectAll) {
      state.showDetailApp = state.apps[0]
    } else {
      state.showDetailApp = null
    }
  },

  // 当开关数组中index位置的开关发生变化后，同步ID数组
  [A_SELECTED_ID](state, index) {
    if (state.selected[index] && state.apps[index] && state.selectedIDs.indexOf(state.apps[index]._id) === -1) {
      // 设置开关为true，同时ID数组中没有对应屏幕ID时，便添加其ID
      state.selectedIDs.push(state.apps[index]._id)
      state.selectedLists.push(state.apps[index])
    } else if (!state.selected[index] && state.selectedIDs.indexOf(state.apps[index]._id) > -1) {
      // 设置开关为false，同时ID数组中有对应屏幕ID时，便将其移除
      state.selectedIDs.splice(state.selectedIDs.indexOf(state.apps[index]._id), 1)
      for (var i = 0; i < state.selectedLists.length; i++) {
        if (state.selectedLists[i]._id === state.apps[index]._id) {
          state.selectedLists.splice(i, 1)
          break
        }
      }
    }
  },

  [A_SELECTED](state, index) {
    state.selected.$set(index, !state.selected[index])

    if (state.selected[index]) {
      state.showDetailApp = state.apps[index]
    } else {
      for (var i = 0; i < state.selected.length; i++) {
        if (state.selected[i] === true) {
          state.showDetailApp = state.apps[i]
          return
        }
      }

      state.showDetailApp = null
    }

    var count = 0
    for (var j = 0; j < state.selected.length; j++) {
      if (state.selected[j] === true) {
        count++
      }
    }
  },

  [A_SELECT_ALL](state) {
    state.selectAll = !state.selectAll

    for (var i = 0; i < state.selected.length; i++) {
      state.selected.$set(i, state.selectAll)
    }

    if (state.selectAll) {
      state.showDetailApp = state.apps[0]
    } else {
      state.showDetailApp = null
    }
  },
  [A_SELECT_SYNC_DATA](state) {
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
  [A_SELECT_CLEAR_DATA](state) {
    state.selectedIDs = []
    state.selectedLists = []
    state.selected.length = 0
    state.selectAll = false
    state.selectOneAbove = false
    state.showDetailApp = null
  },

  [A_SELECT_INIT_DATA](state) {
    state.selected.length = 0
    for (var i = 0; i < state.apps.length; i++) {
      state.selected.$set(i, false)
    }
    // 根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.selected.length; i++) {
      if (state.apps[i] && state.selectedIDs.indexOf(state.apps[i]._id) > -1) {
        state.selected[i] = true
      }
    }
  },

  [A_SHOW_DETAIL_SYNC_DATA](state) {
    // if (state.showDetailApp === null) {
    //   return
    // }

    // for (var i = 0; i < state.apps.length; i++) {
    //   if (state.apps[i]._id === state.showDetailApp._id) {
    //     state.showDetailApp = state.apps[i]
    //     return
    //   }
    // }

    // state.showDetailApp = null
  },


  // 发布模态框初始化
  [A_SET_ADD_PUBLISHED_MODAL](state) {
    state.modalselectIds = []
    state.modalselectNames = []
    state.modalPage = 1
    state.modalPeriod = '_ALL'
    state.modalCreator = '_ALL'
    state.modalLocation = '_ALL'
    state.modalSort = '-createTime'
    state.isAddPublishedModal = !state.isAddPublishedModal
  },
  // 撤销模态框初始化
  [A_SET_ADD_CANCEL_MODAL](state) {
    state.modalselectIds = []
    state.modalselectNames = []
    state.modalPage = 1
    state.modalPeriod = '_ALL'
    state.modalCreator = '_ALL'
    state.modalLocation = '_ALL'
    state.modalSort = '-createTime'
    state.isAddCancelModal = !state.isAddCancelModal
  },

  // 发布模态框
  [A_SET_MODAL_SELECTED](state, index) {
    state.modalselected.$set(index, !state.modalselected[index])

    // if (state.modalselected[index]) {
    //   state.showDetailApp = state.apps[index]
    // } else {
    //   for (var i = 0; i < state.selected.length; i++) {
    //     if (state.selected[i] === true) {
    //       state.showDetailApp = state.apps[i]
    //       return
    //     }
    //   }

    //   state.showDetailApp = null
    // }

    // var count = 0
    // for (var j = 0; j < state.modalselected.length; j++) {
    //   if (state.modalselected[j] === true) {
    //     count++
    //   }
    // }
  },
  [A_CHANGE_MODAL_SELECTEDID](state, index) {
    state.modalselectIds.splice(index, 1)
    state.modalselectNames.splice(index, 1)
  },

  [A_SET_MODAL_SELECT_ALL](state) {
    state.modalselectAll = !state.modalselectAll

    for (var i = 0; i < state.modalselected.length; i++) {
      state.modalselected.$set(i, state.modalselectAll)
    }

    // if (state.modalselectAll) {
    //   state.showDetailApp = state.apps[0]
    // } else {
    //   state.showDetailApp = null
    // }
  },
  [A_SET_MODAL_SELECT_INIT_DATA](state) {
    state.modalselected.length = 0
    for (var i = 0; i < state.modalScreens.length; i++) {
      state.modalselected.$set(i, false)
    }
    // 根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.modalselected.length; i++) {
      if (state.modalScreens[i] && state.modalselectIds.indexOf(state.modalScreens[i]._id) > -1) {
        state.modalselected[i] = true
      }
    }
  },
  [A_SET_MODAL_SELECT_SYNC_DATA](state) {
    var count = 0
    for (var i = 0; i < state.modalselected.length; i++) {
      if (state.modalselected[i] === true) {
        count++
      }
    }

    if (count > 0) {
      state.selectedNum = true
    } else {
      state.selectedNum = false
    }

    if (count === state.modalselected.length && count > 0) {
      state.modalselectAll = true
    } else {
      state.modalselectAll = false
    }
  },
  [A_SET_MODAL_SELECTEDIDS](state, index, GO) {
    //跟total匹配数据
    if (GO) {
      if (state.modalselectIds.indexOf(state.modalTotal[index]._id) === -1) {
        state.modalselectIds.push(state.modalTotal[index]._id)
        state.modalselectNames.push(state.modalTotal[index].name)
      } else if (state.modalselectIds.indexOf(state.modalTotal[index]._id) > -1) {
        state.modalselectIds.splice(state.modalselectIds.indexOf(state.modalTotal[index]._id), 1)
        state.modalselectNames.splice(state.modalselectNames.indexOf(state.modalTotal[index].name), 1)
      }
      return
    }

    if (state.modalselected[index] && state.modalselectIds.indexOf(state.modalScreens[index]._id) === -1) { // 设置开关为true，同时ID数组中没有对应屏幕ID时，便添加其ID
      state.modalselectIds.push(state.modalScreens[index]._id)
      state.modalselectNames.push(state.modalScreens[index].name)
    } else if (!state.modalselected[index] && state.modalselectIds.indexOf(state.modalScreens[index]._id) > -1) { // 设置开关为false，同时ID数组中有对应屏幕ID时，便将其移除
      state.modalselectIds.splice(state.modalselectIds.indexOf(state.modalScreens[index]._id), 1)
      state.modalselectNames.splice(state.modalselectNames.indexOf(state.modalScreens[index].name), 1)
    }
  },
  [A_SET_MODAL_RESULT](state, result) {
    state.modalResult = result
  },
  [A_SET_MODAL_SCREENS](state, screens) {
    state.modalScreens = screens

    if (state.modalPage === 1) {
      state.modalTotal = screens
      return
    }
    for (var i = 0; i < screens.length; i++) {
      state.modalTotal.push(screens[i])
    }

  },
  [A_SET_MODAL_PAGE](state, page) {
    state.modalPage = page
  },
  [A_SET_MODAL_CREATOR](state, creator) {
    state.modalCreator = state.modalCreator === creator ? '_ALL' : creator
  },

  [A_SET_MODAL_PERIOD](state, period) {
    state.modalPeriod = state.modalPeriod === period ? '_ALL' : period
  },

  [A_SET_MODAL_LOCATION](state, location) {
    state.modalLocation = state.modalLocation === location ? '_ALL' : location
  },

  [A_SET_MODAL_SORT](state, sort) {
    if (sort === 'name') {
      if (state.modalSort === '-name') {
        state.modalSort = sort
      } else {
        state.modalSort = '-' + sort
      }
    }

    if (sort === 'app') {
      if (state.modalSort === 'app') {
        state.modalSort = '-' + sort
      } else {
        state.modalSort = sort
      }
    }
    if (sort === 'location') {
      if (state.modalSort === 'location') {
        state.modalSort = '-' + sort
      } else {
        state.modalSort = sort
      }
    }
    if (sort === 'createTime') {
      if (state.modalSort === 'createTime') {
        state.modalSort = '-' + sort
      } else {
        state.modalSort = sort
      }
    }
    if (sort === 'status') {
      if (state.modalSort === 'status') {
        state.modalSort = '-' + sort
      } else {
        state.modalSort = sort
      }
    }
  },

  // 微信
  // 待照片墙待审核模态
  [A_SET_ADD_CHECK_MODAL](state) {
    state.isAddCheckModal = !state.isAddCheckModal
  },
  [A_SET_PENGING_lIST](state, list) {
    state.pengingList = list
  },
  [A_REMOVE_PENGING_lIST](state, index) {
    state.pengingList.splice(index, 1)
  },
  [A_CHANGE_PENGING_lIST](state, index) {
    state.wechatUsers[index].isCheck = true
  },
  [A_CHECK_PENDING_COUNT](state, count) {
    state.pengingCount = count
  },

  [A_SET_CHECK](state, check) {
    state.check = state.check === check ? '_ALL' : check
  },
  [A_SET_WECHAT_SORT](state, sort) {
    if (sort === 'createTime') {
      if (state.wechatSort === '-createTime') {
        state.wechatSort = sort
      } else {
        state.wechatSort = '-' + sort
      }
    }
  },
  [A_SET_CLEAN_WECHAT_SELECTEDIDS](state) {
    state.wechatSelectIds = []
  },
  [A_SET_DETELE_WECHAT_MODAL](state) {
    state.isDeleteWechatModal = !state.isDeleteWechatModal
      //state.wechatSelectIds=[]
  },
  [A_SET_WECHAT_SELECTED](state, index) {
    state.wechatSelected.$set(index, !state.wechatSelected[index])
  },
  [A_SET_WECHAT_SELECT_ALL](state) {
    state.wechatSelectAll = !state.wechatSelectAll

    for (var i = 0; i < state.wechatSelected.length; i++) {
      state.wechatSelected.$set(i, state.wechatSelectAll)
    }
  },
  [A_SET_WECHAT_SELECT_INIT_DATA](state) {
    state.wechatSelected.length = 0
    for (var i = 0; i < state.wechatUsers.length; i++) {
      state.wechatSelected.$set(i, false)
    }
    // 根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.wechatSelected.length; i++) {
      if (state.wechatUsers[i] && state.wechatSelectIds.indexOf(state.wechatUsers[i]._id) > -1) {
        state.wechatSelected[i] = true
      }
    }
  },
  [A_SET_WECHAT_SELECT_SYNC_DATA](state) {
    var count = 0
    for (var i = 0; i < state.wechatSelected.length; i++) {
      if (state.wechatSelected[i] === true) {
        count++
      }
    }

    if (state.wechatSelectIds.length > 0) {
      state.selectedWechatNum = true
    } else {
      state.selectedWechatNum = false
    }
    if (count === state.wechatSelected.length && count > 0) {
      state.wechatSelectAll = true
    } else {
      state.wechatSelectAll = false
    }
  },
  [A_SET_WECHAT_SELECTEDIDS](state, index) {
    if (state.wechatSelected[index] && state.wechatSelectIds.indexOf(state.wechatUsers[index]._id) === -1) { // 设置开关为true，同时ID数组中没有对应屏幕ID时，便添加其ID
      state.wechatSelectIds.push(state.wechatUsers[index]._id)
    } else if (!state.wechatSelected[index] && state.wechatSelectIds.indexOf(state.wechatUsers[index]._id) > -1) { // 设置开关为false，同时ID数组中有对应屏幕ID时，便将其移除
      state.wechatSelectIds.splice(state.wechatSelectIds.indexOf(state.wechatUsers[index]._id), 1)
    }
  },
  // [A_SET_SIGN_RESULT] (state, result) {
  //   state.signResult = result
  // },
  // [A_SET_SIGN_SIGNS] (state, signs) {
  //   state.signs = signs
  // },
  // [A_SET_SIGN_PAGE] (state, page) {
  //   state.signPage = page
  // },
  // 微信
  [A_SET_WECHAT_PAGE](state, page) {
    state.wechatPage = page
  },
  [A_SET_WECHAT_RESULT](state, result) {
    state.wechatResult = result
  },
  [A_SET_WECHAT_USERS](state, users) {
    state.wechatUsers = users
    if (state.wechatPage === 1) {
      state.wechatTotal = users
      return
    }
    for (var i = 0; i < users.length; i++) {
      state.wechatTotal.push(users[i])
    }
  },

  //mobile
  [A_SET_APP_ONE](state, appOne) {
    state.showDetailApp = appOne
  }



}

export default {
  state,
  mutations
}