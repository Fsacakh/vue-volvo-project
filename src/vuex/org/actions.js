// /src/vuex/org/actions.js

import * as types from './mutation-types'
import Api from '../../net/api'
import { popupMsg, popupErrMsg } from '../../util/popupMessage'
import _ from 'lodash'

//设置头像
export const setOrgLogo = function ({dispatch, state}, logo) {
   dispatch(types.O_SET_ORG_LOGO, logo)
   updateOrg({ dispatch, state })
}

export const getOrg = function ({dispatch, state}) {
  // fetch org 
  Api.Org.get({}, (r) => {
    dispatch(types.O_SET_ORG, r.data || {})
  }
  , (err) => popupErrMsg(err.message))
}

export const updateOrg = function ({dispatch, state}) {
  // update org 
  const ORG_STORE = state.org.orgs
  Api.Org.update(ORG_STORE, (r) => {
    popupMsg(r.message)
    getOrg({ dispatch, state })
  }
  , (err) => popupErrMsg(err.message))
}