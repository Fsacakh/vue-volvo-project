// /src/vuex/uploader/store.js

import {U_ADD_UPLOADER,
        U_REMOVE_UPLOADER } from './mutation-types'

const state = {
  uploaders: [],
  showModal: false
}

const mutations = {
  [U_ADD_UPLOADER] (state, up) {
    state.locations.push(up)
  },

  [U_REMOVE_UPLOADER] (state, up) {
    state.uploaders.splice(state.uploaders.indexOf(up), 1)
  }
}

export default {
  state,
  mutations
}
