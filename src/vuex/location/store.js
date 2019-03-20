// /src/vuex/location/store.js

import { L_SET_LOCATIONS,
        L_SET_SHOW_MODAL } from './mutation-types'

const state = {
  locations: [],
  showModal: false
}

const mutations = {
  [L_SET_LOCATIONS] (state, locations) {
    state.locations = locations
  },

  [L_SET_SHOW_MODAL] (state, bool) {
    state.showModal = bool
  }
}

export default {
  state,
  mutations
}
