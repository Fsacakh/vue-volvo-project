// /src/vuex/screen/store.js

import {
  S_SET_CLEAN_SELECTIDS,

  S_SET_DETAIL,
  S_SET_DETAIL_LEVEL,
  S_SET_CREATOR,
  S_SET_PERIODS,
  S_SET_PERIOD,
  C_SET_SORT,
  S_SET_LOCATIONS,
  S_SET_LOCATION,
  S_SET_PAGE,
  S_SET_RESULT,
  S_SET_SCREENS,

  S_SELECTED_ID,
  S_SELECTED,
  S_SELECT_ALL,
  S_SELECT_SYNC_DATA,
  S_SELECT_INIT_DATA,

  S_SHOW_DETAIL_SYNC_DATA,

  S_SET_SHOW_MODAL,
  S_SET_PUSH_MODAL,
  S_SET_REMOVE_MODAL,

  //推送
  S_SET_MODAL_INIT,
  S_SET_MODAL_RESULT,
  S_SET_MODAL_APPS,
  S_SET_MODAL_PAGE, 
  S_SET_MODAL_CREATOR, 
  S_SET_MODAL_PERIOD, 
  S_SET_MODAL_TYPE,
  S_SET_MODAL_SORT,
  S_SET_MODAL_SELECTED,
  S_SELECT_CLEAR_DATA,

  S_SET_PENDING,
  S_SET_LIST_INIT,
  SET_OTHER,

  S_SET_STASH,
  S_SET_SCREEN_ONE

} from './mutation-types'

const state = {
  showDetail: false,
  showModal: false,

  showRemoveModal: false,
  showPushModal:false,

  modalFilter: {
    page: 1,
    sort: '-createTime',
    creator: '_ALL',
    type: '_ALL',
    period: '_ALL'
  },
  modalApps:{
    result: {},
    apps: [],
    publishId: '',
    pushScreen: null,
    total:[]
  },

  creator: '_ALL',
  location: '_ALL',
  period: '_ALL',
  periods: [
    {'_id': '_ALL', 'name': '全部时间'},
    {'_id': 'hours', 'name': '一小时内'},
    {'_id': 'days', 'name': '一天内'},
    {'_id': 'weeks', 'name': '一周内'},
    {'_id': 'months', 'name': '一月内'},
    {'_id': 'years', 'name': '一年内'}
  ],
  sort: '-createTime',
  result: {},
  screens: [],
  page: 1,

  selectAll: false,
  selectOneAbove: false,
  selected: [],
  selectedIDs: [],
  selectedLists:[],

  showDetailScreen: null,
  showDetailPage: '',
  isPending: true,

  isOther: false,

  total:[]

}

const mutations = {
  [S_SET_CLEAN_SELECTIDS] (state) {
    state.selectedIDs = []
    state.selectedLists = []
    state.showDetailScreen = null
    state.selectOneAbove = false
  },

  // 在原有的创建屏幕的界面上点选创建另一个checkbox
  [SET_OTHER] (state, bool) {
    state.isOther = bool
  },

  //控制屏幕详情列表的启用开关在一次点击后15秒之后才能在点击
  [S_SET_PENDING](state){
    state.isPending = !state.isPending
  },

  [S_SET_REMOVE_MODAL] (state) {
    state.showRemoveModal = !state.showRemoveModal
  },
  [S_SET_SHOW_MODAL] (state) {
    state.showModal = !state.showModal
  },

  // 推送
  [S_SET_MODAL_INIT] (state, publishId) {
    state.modalApps.publishId = ''
    state.modalFilter = {
      page: 1,
      sort: '-createTime',
      creator: '_ALL',
      type: '_ALL',
      period: '_ALL'
    }
  },
  [S_SET_MODAL_SELECTED] (state, publishId) {
    if(publishId === state.modalApps.publishId){
      state.modalApps.publishId = ''
      return
    }
    state.modalApps.publishId = publishId
  },
  [S_SET_PUSH_MODAL] (state, screen) {
    state.showPushModal = !state.showPushModal
    state.modalApps.pushScreen = screen
  },
  [S_SET_MODAL_RESULT] (state, result) {
    state.modalApps.result = result
  },
  [S_SET_MODAL_APPS] (state, apps) {
    state.modalApps.apps = apps
    if(state.modalFilter.page === 1){
      state.modalApps.total = apps
      return
    }
    for(var i = 0; i< apps.length; i++){
      state.modalApps.total.push(apps[i])
    }
  },

  [S_SET_MODAL_PAGE] (state, page) {
    state.modalFilter.page = page
  },
  [S_SET_MODAL_CREATOR]  (state, creator) {
    state.modalFilter.creator = state.modalFilter.creator === creator ?  '_ALL' : creator 
  },
 
  [S_SET_MODAL_PERIOD] (state, period) {
    state.modalFilter.period = state.modalFilter.period === period ? '_ALL' : period 
  },
  [S_SET_MODAL_TYPE] (state, type) {
    state.modalFilter.type = state.modalFilter.type === type ?  '_ALL' : type 
  },
  [S_SET_MODAL_SORT] (state, sort) {
   
    if (sort === 'createTime') {
      if (state.modalFilter.sort === '-createTime') {
        state.modalFilter.sort = sort
      } else {
        state.modalFilter.sort = '-' + sort
      }
    }
    if (sort === 'creator') {
      if (state.modalFilter.sort === 'creator') {
        state.modalFilter.sort = '-' + sort
      } else {
        state.modalFilter.sort = sort
      }
    }
    if (sort === 'name') {
      if (state.modalFilter.sort === 'name') {
        state.modalFilter.sort = '-' + sort
      } else {
        state.modalFilter.sort = sort
      }
    }
    if (sort === 'appType') {
      if (state.modalFilter.sort === 'appType') {
        state.modalFilter.sort = '-' + sort
      } else {
        state.modalFilter.sort = sort
      }
    }
    if (sort === 'screens') {
      if (state.modalFilter.sort === 'screens') {
        state.modalFilter.sort = '-' + sort
      } else {
        state.modalFilter.sort = sort
      }
    }
  },

  [S_SET_DETAIL] (state) {
    state.showDetail = !state.showDetail
  },
  [S_SET_DETAIL_LEVEL](state, bool){
    state.showDetail = bool
  },

  [S_SET_CREATOR] (state, creator) {
    state.creator = state.creator === creator ? '_ALL' : creator
  },

  [S_SET_LOCATIONS] (state, locations) {
    state.locations = locations
  },

  [S_SET_LOCATION] (state, location) {
    state.location = state.location === location ? '_ALL' : location
  },

  [S_SET_PERIODS] (state, periods) {
    state.periods = periods
  },

  [S_SET_PERIOD] (state, period) {
    state.period = state.period === period ? '_ALL' : period
  },
  [C_SET_SORT] (state, sort) {
    if (sort === 'createTime') {
      if (state.sort === '-createTime') {
        state.sort = sort
      } else {
        state.sort = '-' + sort
      }
    }

    if (sort === 'location') {
      if (state.sort === 'location') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }
    if (sort === 'status') {
      if (state.sort === 'status') {
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

     if (sort === 'app') {
      if (state.sort === 'app') {
        state.sort = '-' + sort
      } else {
        state.sort = sort
      }
    }
  },

  [S_SET_RESULT] (state, result) {
    state.result = result
  },
  [S_SET_LIST_INIT] (state) {
    state.sort = '-createTime'
    state.creator = '_ALL'
    state.location = '_ALL'
    state.period = '_ALL'
    state.page = 1
  },
  [S_SELECT_CLEAR_DATA] (state) {
    state.selectedIDs = []
    state.selectedLists = []
    state.selected.length = 0
    state.selectAll = false
    state.selectOneAbove = false
    state.showDetailScreen = null
  },
  [S_SELECTED] (state, index) {
    state.selected.$set(index, !state.selected[index])

    if (state.selected[index]) { // 选中某个屏幕
      if (state.showDetailScreen !== state.screens[index]) {
        state.showDetailScreen = state.screens[index]
        state.isPending = true
        state.showDetailPage = state.page
      }

    } else { // 取消选中某个屏幕，设置预览信息为最前面一个选中的屏幕
      for (var i = 0; i < state.selected.length; i++) {
        if (state.selected[i] === true) {
          if (state.showDetailScreen !== state.screens[i]) {
            state.showDetailScreen = state.screens[i]
            state.isPending = true
            state.showDetailPage = state.page
          }
          //state.showDetailScreen = state.screens[i]
          return
        }
      }

      // 没有任何屏幕被选中，设置预览屏幕为空
      state.showDetailScreen = null
      state.showDetailPage = ''
    }
  },

  [S_SELECT_ALL] (state) {
    state.selectAll = !state.selectAll

    // 设置所有屏幕的选中开关
    for (var i = 0; i < state.selected.length; i++) {
      state.selected.$set(i, state.selectAll)
    }

    if (state.selectAll) {
      if (state.showDetailScreen !== state.screens[0]) {
        state.showDetailScreen = state.screens[0]
        state.isPending = true
      }
      //state.showDetailScreen = state.screens[0]
    } else {
      state.showDetailScreen = null
    }
  },

  // 当开关数组中index位置的开关发生变化后，同步ID数组
  [S_SELECTED_ID] (state, index) {
    if (state.selected[index] && state.selectedIDs.indexOf(state.screens[index]._id) === -1) { // 设置开关为true，同时ID数组中没有对应屏幕ID时，便添加其ID
      state.selectedIDs.push(state.screens[index]._id)
      state.selectedLists.push(state.screens[index])
    } else if (!state.selected[index] && state.selectedIDs.indexOf(state.screens[index]._id) > -1) { // 设置开关为false，同时ID数组中有对应屏幕ID时，便将其移除
      state.selectedIDs.splice(state.selectedIDs.indexOf(state.screens[index]._id), 1)
      for (var i = 0; i < state.selectedLists.length; i++) {
        if (state.selectedLists[i]._id === state.screens[index]._id) {
          state.selectedLists.splice(i, 1)
          break
        }
      }
    }
  },

  [S_SELECT_SYNC_DATA] (state) {
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

  [S_SELECT_INIT_DATA] (state) {
    state.selected.length = 0

    for (var i = 0; i < state.screens.length; i++) {
      state.selected.$set(i, false)
    }
    // 根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.selected.length; i++) {
      if (state.screens[i] && state.selectedIDs.indexOf(state.screens[i]._id) > -1) {
        state.selected[i] = true
      }
    }
  },

  [S_SET_SCREENS] (state, screens) {
    state.screens = screens
    if(state.page === 1){
      state.total = screens
      return
    }

    for(var i = 0; i< screens.length; i++){
      state.total.push(screens[i])
    }
  },

  // 屏幕列表刷新后，同步预览屏幕信息，让其指向相同ID／新的屏幕
  [S_SHOW_DETAIL_SYNC_DATA] (state, details) {
    if (!details) {
      return
    }
    if(!state.showDetailScreen){
      return
    }
    for (var i = 0; i < details.length; i++) {
      if (details[i]._id === state.showDetailScreen._id) {
        state.showDetailScreen = details[i]
        return
      }
    }

  },

  [S_SET_PAGE] (state, page) {
    state.page = page
  },

  [S_SET_SCREEN_ONE](state, screenOne){
    state.showDetailScreen = screenOne
  }
}

export default {
  state,
  mutations
}
