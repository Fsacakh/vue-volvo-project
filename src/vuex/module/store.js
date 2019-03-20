// /src/vuex/module/store.js

import {
  UPDATE_DIRECTION
} from './mutation-types'

const state = {
  fromDir: '',
  direction: 'forward'
}

const mutations = {
  [UPDATE_DIRECTION](state, direction, from) {
    state.direction = direction
    state.fromDir = from
  }

}

export default {
  state,
  mutations
}