// /src/vuex/location/actions.js

import * as types from './mutation-types'
import Api from '../../net/api'
import { popupErrMsg } from '../../util/popupMessage'
import { syncData } from '../screen/actions'
import _ from 'lodash'

export const setShowModal = function ({dispatch, state}, bool) {
  dispatch(types.L_SET_SHOW_MODAL, bool)
}

export const addLocation = function ({dispatch, state}, name) {
  Api.Location.upsert({name}
  , (r) => syncData({dispatch, state})
  , (e) => popupErrMsg(e.message))
}

export const editLocation = function ({dispatch, state}, loc, value) {
  var newLoc = _.clone(loc, true)
  newLoc.name = value

  Api.Location.upsert(newLoc
  , (r) => syncData({dispatch, state})
  , (e) => popupErrMsg(e.message))
}

export const removeLocation = function ({dispatch, state}, loc) {
  Api.Location.remove(loc._id
  , (r) => syncData({dispatch, state})
  , (e) => popupErrMsg(e.message))
}

export const syncLocData = function ({dispatch, state}) {
  // fetch all locations
  Api.Location.allLocations(null
  , (r) => {
    dispatch(types.L_SET_LOCATIONS, r.data.list || {})
  }
  , (e) => popupErrMsg(e.message))
}


