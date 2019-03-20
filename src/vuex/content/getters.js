// /src/vuex/content/getters.js
export const result = ({ content }) => content.result

export const queueStatus = ({ content }) => content.queueStatus
export const contents = ({ content }) => content.contents

export const page = ({ content }) => content.page
export const allcontent = ({ content }) => content.allcontent
export const creator = ({ content }) => content.creator
export const period = ({ content }) => content.period
export const type = ({ content }) => content.type
export const sort = ({ content }) => content.sort

// 模态框-素材添加和删除,确认离开
export const isAddContentModal = ({ content }) => content.isAddContentModal
export const isLeaveContentModal = ({ content }) => content.isLeaveContentModal
export const isDeleteContentModal = ({ content }) => content.isDeleteContentModal

export const isview = ({ content }) => content.isview
export const isdetail = ({ content }) => content.isdetail
export const ispreview = ({ content }) => content.ispreview
export const isLeave = ({ content }) => content.isLeave

export const selectedIDs = ({ content }) => content.selectedIDs
export const selectedLists = ({ content }) => content.selectedLists
export const selectAll = ({ content }) => content.selectAll
export const selectOneAbove = ({ content }) => content.selectOneAbove
export const selected = ({ content }) => content.selected
export const showDetailContent = ({ content }) => content.showDetailContent
export const previewShowDetailContent = ({ content }) => content.previewShowDetailContent
export const previewContent = ({ content }) => content.previewContent
export const currentIndex = ({ content }) => content.currentIndex

export const removeContentCodes = ({ content }) => content.removeContentCodes
export const screenContentCodes = ({ content }) => content.screenContentCodes

//推送
export const modalContents = ({ content }) => content.modalContents
export const modalFilter = ({ content }) => content.modalFilter

export const total = ({content}) => content.total
export const preList = ({ content }) => content.preList