// /src/vuex/user/getters.js
export const isdetail = ({user}) => user.isdetail
export const other = ({user}) => user.other
export const currUser = ({user}) => user.currUser
export const result = ({user}) => user.result
export const users = ({user}) => user.users
export const page = ({user}) => user.page
export const allUsers = ({user}) => user.allUsers
export const showModal = ({user}) => user.showModal
export const chooseUsers = ({user}) => user.chooseUsers
//单选,多选
export const selected = ({user}) => user.selected
export const selectAll = ({user}) => user.selectAll
export const selectedIDs = ({user}) => user.selectedIDs
export const selectOneAbove = ({user}) => user.selectOneAbove

export const showDetailUser = ({user}) => user.showDetailUser

//删除
export const showRemoveModal = ({user})=>user.showRemoveModal

export const total = ({user}) => user.total