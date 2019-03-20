// /src/vuex/uploader/actions.js

import * as types from './mutation-types'
import Api from '../../net/api'
import { popupErrMsg, popupMsg } from '../../util/popupMessage'
import { syncData } from '../screen/actions'
import _ from 'lodash'

export const setShowModal = function ({dispatch, state}, bool) {
  dispatch(types.U_SET_SHOW_MODAL, bool)
}

export const addUploader = function ({dispatch, state}, up) {
  dispatch(types.U_ADD_UPLOADER, up)
}

// export const editLocation = function ({dispatch, state}, loc, value) {
//   var newLoc = _.clone(loc, true)
//   newLoc.name = value

//   Api.Location.upsert(newLoc
//   , (r) => {
//     dispatch(types.L_UPDATE_LOCATION, loc, value)
//     syncData({dispatch, state})
//   }
//   , (e) => popupErrMsg(e.message))
// }

export const removeUploader = function ({dispatch, state}, up) {
  dispatch(types.U_REMOVE_UPLOADER, up)
}

// export const syncLocData = function ({dispatch, state}) {
//   // fetch all locations
//   Api.Location.allLocations(null
//   , (r) => {
//     dispatch(types.L_SET_LOCATIONS, r.data.list || {})
//   }
//   , (e) => popupErrMsg(e.message))
// }
