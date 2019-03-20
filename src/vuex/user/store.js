// /src/vuex/user/store.js

import {
  U_SET_CLEAN_SELECTIDS,

  U_SET_DETAIL,
  U_SET_DETAIL_LEVEL,
  U_SET_USERS,
  U_UPSERT_USER,
  U_REMOVE_USER,
  U_SET_PAGE,
  U_SET_RESULT,
  U_SET_ALLUSERS,
  U_SET_VALID,

  U_SELECT_SYNC_DATA,
  U_SELECTED_ID,
  U_SELECT_ALL,
  U_SELECTED,
  U_SELECT_INIT_DATA,
  U_SHOW_DETAIL_SYNC_DATA,
  U_SELECT_CLEAR_DATA,

  U_SET_REMOVE_MODAL,

  U_SET_OTHER,
  U_SET_CURRUSER,

  U_SET_USER_ONE
} from './mutation-types'

const state = {
  users: [],    // 当前分页中的用户
  allUsers: [], // 所有用户
  result: {},
  page: 1,
  isdetail: false,

  showRemoveModal:false,
  other: false,
  currUser:{
    name:'',
    mobile:'',
    email: '',
    isValid: true,
  },

  //单选多选
  selectAll: false,
  selectOneAbove: false,
  selected: [],
  selectedIDs: [],
  showDetailUser: null,
  total: []
}

const mutations = {
  [U_SET_CLEAN_SELECTIDS] (state) {
    state.selectedIDs = []
    state.showDetailUser = []
    state.selectOneAbove = false
  },
  [U_SET_OTHER] (state, bool) {
    state.other = bool
  },
  [U_SET_CURRUSER] (state, currUser) {

    state.currUser = currUser
  },
  [U_SET_DETAIL] (state) {
    state.isdetail = !state.isdetail
  },
  [U_SET_DETAIL_LEVEL](state, bool){
    state.isdetail = bool
  },
  [U_SET_RESULT] (state, result) {
    state.result = result
  },

  [U_SET_PAGE] (state, page) {
    state.page = page
  },

  [U_SET_USERS] (state, users) {
    state.users = users
    if(state.page === 1){
      state.total = users
      return
    }
    for(var i = 0; i< users.length; i++){
      state.total.push(users[i])
    }

  },

  [U_SET_ALLUSERS] (state, users) {
    state.allUsers = users
  },

  [U_UPSERT_USER] (state, user) {
    var users = state.users

    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === user._id) {
        users[i] = user
        return
      }
    }

    users.push(user)
  },
  //启用
  [U_SET_VALID](state,isvalid){
    state.showDetailUser.isValid=isvalid
  },

  //-----------------------------------------------删除
  [U_SET_REMOVE_MODAL](state){
    state.showRemoveModal=!state.showRemoveModal
  },

  [U_REMOVE_USER] (state, id) {
    var users = state.users

    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === id) {
        users.splice(i, 1)
        return
      }
    }
  },

  //-----------------------------------------------checkbox
  [U_SELECT_CLEAR_DATA] (state) {
    state.selectedIDs = []
    state.selected.length = 0
    state.selectAll = false
    state.selectOneAbove = false
    state.showDetailUser= null
  },
  [U_SELECT_ALL](state)
  {
    state.selectAll = !state.selectAll
    for (var i = 0; i < state.selected.length; i++) {
      state.selected.$set(i, state.selectAll)
    }
    if (state.selectAll) {
      state.showDetailUser = state.users[0]
    } else {
      state.showDetailUser = null
    }
  }
  ,
  // 当开关数组中index位置的开关发生变化后，同步ID数组
  [U_SELECTED_ID] (state, index) {
    if (state.selected[index] && state.selectedIDs.indexOf(state.users[index]._id) === -1) { // 设置开关为true，同时ID数组中没有对应屏幕ID时，便添加其ID
      state.selectedIDs.push(state.users[index]._id)
    } else if (!state.selected[index] && state.selectedIDs.indexOf(state.users[index]._id) > -1) { // 设置开关为false，同时ID数组中有对应屏幕ID时，便将其移除
      state.selectedIDs.splice(state.selectedIDs.indexOf(state.users[index]._id), 1)
    }
  },
  [U_SELECTED](state, index)
  {
    state.selected.$set(index, !state.selected[index])

    if (state.selected[index])
      state.showDetailUser = state.users[index]
    else {
      for (var i = 0; i < state.selected.length; i++) {
        if (state.selected[i] === true) {
          state.showDetailUser = state.users[i]
          return
        }
      }
      state.showDetailUser = null
    }

  }
  ,
  [U_SELECT_INIT_DATA](state)
  {
    state.selected.length = 0
    state.selectAll = false
    state.selectOneAbove = false
    for (var i = 0; i < state.users.length; i++) {
      state.selected.$set(i, false)
      //state.showDetailUser = state.users[i]

    }
    //state.showDetailUser = null
    // 刷新选中开关数据后，同步ID数据里面的值，第一步，去除ID数组中无效的ID
    // var newIDs = []
    // for (i = 0; i < state.selectedIDs.length; i++) {
    //   for (var j = 0; j < state.users.length; j++) {
    //     if (state.users[j]._id === state.selectedIDs[i]) {
    //       newIDs.push(state.selectedIDs[i])
    //       break
    //     }
    //   }
    // }

    // state.selectedIDs = newIDs

    // 第二步，根据ID数据中的ID值，设置开关数据
    for (i = 0; i < state.selected.length; i++) {
      if (state.selectedIDs.indexOf(state.users[i]._id) > -1) {
        state.selected[i] = true
      }
    }

  }
  ,

  [U_SELECT_SYNC_DATA](state)
  {
    var count = 0
    for (var i = 0; i < state.selected.length; i++) {
      if (state.selected[i] === true) {
        count++
      }
    }
    if (state.selectedIDs.length> 0) {
      state.selectOneAbove = true
    } else {
      state.selectOneAbove = false
    }
    if (count === state.selected.length && count>0) {
      state.selectAll = true
    } else {
      state.selectAll = false
    }
  },
  [U_SHOW_DETAIL_SYNC_DATA](state) {
    // if (state.showDetailUser === null)
    //   return

    // for (var i = 0; i < state.users.length; i++) {
    //   if (state.users[i]._id === state.showDetailUser._id) {
    //     state.showDetailUser = state.users[i]
    //     return
    //   }
    // }

    // state.showDetailUser = null
  }
  ,
   //mobile
  [U_SET_USER_ONE](state, userOne){
    state.showDetailUser = userOne
  }

}

export default {
  state,
  mutations
}
