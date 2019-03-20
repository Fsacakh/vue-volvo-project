// /src/vuex/screen/getters.js

// screen module

export const creator = ({ screen }) => screen.creator
export const locations = ({ screen }) => screen.locations
export const location = ({ screen }) => screen.location
export const periods = ({ screen }) => screen.periods
export const period = ({ screen }) => screen.period
export const sort = ({ screen }) => screen.sort
export const page = ({ screen }) => screen.page

export const result = ({ screen }) => screen.result
export const screens = ({ screen }) => screen.screens


export const selectAll = ({ screen }) => screen.selectAll
export const selectOneAbove = ({ screen }) => screen.selectOneAbove
export const selected = ({ screen }) => screen.selected
export const selectedLists = ({ screen }) => screen.selectedLists
export const showDetailScreen = ({ screen }) => screen.showDetailScreen
export const selectedIDs = ({ screen }) => screen.selectedIDs

export const showDetail = ({ screen }) => screen.showDetail
export const showModal = ({ screen }) => screen.showModal
export const showRemoveModal = ({ screen }) => screen.showRemoveModal
export const showPushModal = ({ screen }) => screen.showPushModal
export const pushScreen = ({ screen }) => screen.pushScreen

export const isPending = ({ screen }) => screen.isPending

export const isOther = ({ screen }) => screen.isOther

//推送
export const modalApps = ({ screen }) => screen.modalApps
export const modalFilter = ({ screen }) => screen.modalFilter

//mobile 
export const total = ({screen}) => screen.total