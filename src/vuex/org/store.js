// /src/vuex/org/store.js

import { 
  O_SET_ORG,
  O_SET_ORG_LOGO
} from './mutation-types'

const state = {
  orgs:{}
}

const mutations = {
  [O_SET_ORG] (state, orgs) {
    state.orgs = orgs
    state.orgs.contact = orgs.contact
  },
  [O_SET_ORG_LOGO] (state, logo){
    state.orgs.logo = logo
  }

}

export default {
  state,
  mutations
}
