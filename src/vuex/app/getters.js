// /src/vuex/app/getters.js
export const result = ({ app }) => app.result
export const apps = ({ app }) => app.apps
export const page = ({ app }) => app.page

export const isdetail = ({ app }) => app.isdetail
export const creator = ({ app }) => app.creator
export const period = ({ app }) => app.period
export const type = ({ app }) => app.type
export const sort = ({ app }) => app.sort


export const playmode = ({ app }) => app.playmode
export const playmodes = ({ app }) => app.playmodes
export const switchmode = ({ app }) => app.switchmode
export const switchmodes = ({ app }) => app.switchmodes


export const isAddAppModal = ({ app }) => app.isAddAppModal
export const isDeleteAppModal = ({ app }) => app.isDeleteAppModal

export const selectedIDs = ({ app }) => app.selectedIDs
export const selectedLists = ({ app }) => app.selectedLists
export const selectAll = ({ app }) => app.selectAll
export const selectOneAbove = ({ app }) => app.selectOneAbove
export const selected = ({ app }) => app.selected

export const showDetailApp = ({ app }) => app.showDetailApp

// 发布和撤销模态框
export const isAddPublishedModal = ({ app }) => app.isAddPublishedModal
export const isAddCancelModal = ({ app }) => app.isAddCancelModal
export const modalCreator = ({ app }) => app.modalCreator
export const modalPeriod = ({ app }) => app.modalPeriod
export const modalLocation = ({ app }) => app.modalLocation
export const modalSort = ({ app }) => app.modalSort
export const modalResult = ({ app }) => app.modalResult
export const modalScreens = ({ app }) => app.modalScreens
export const modalTotal = ({ app }) => app.modalTotal
export const modalPage = ({ app }) => app.modalPage
export const modalselectIds = ({ app }) => app.modalselectIds
export const modalselectNames = ({ app }) => app.modalselectNames
export const modalselected = ({ app }) => app.modalselected
export const modalselectAll = ({ app }) => app.modalselectAll
export const selectedNum = ({ app }) => app.selectedNum

// 微信
export const check = ({ app }) => app.check
export const pengingList = ({ app }) => app.pengingList
export const pengingCount = ({ app }) => app.pengingCount
export const isAddCheckModal = ({ app }) => app.isAddCheckModal
export const wechatSort = ({ app }) => app.wechatSort
export const wechatSelected = ({ app }) => app.wechatSelected
export const wechatSelectAll = ({ app }) => app.wechatSelectAll
export const wechatSelectIds = ({ app }) => app.wechatSelectIds
export const selectedWechatNum = ({ app }) => app.selectedWechatNum
export const wechatUsers = ({ app }) => app.wechatUsers
export const wechatResult = ({ app }) => app.wechatResult
export const wechatPage = ({ app }) => app.wechatPage
export const isDeleteWechatModal = ({ app }) => app.isDeleteWechatModal

export const total = ({ app }) => app.total
export const wechatTotal = ({ app }) => app.wechatTotal