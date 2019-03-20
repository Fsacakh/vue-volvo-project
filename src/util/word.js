// src/word/index.js
import {router} from '../main'
import $ from 'jquery'

//输入字长限制
export default  {

  mobileSize: 11,     // 手机号
  passwordSize: 8,    // 密码
  emailSize: 64,      // 邮箱
  memoSize: 128,      // 备注

  account: {
    nameSize: 24      // 个人资料-姓名
  },
  org: {
    nameSize: 24,     // 组织信息-组织名称
    contactSize: 24   // 组织信息-联系人
  },
  screen: {
    nameSize: 32,     // 新建屏幕-屏幕名称
    codeSize: 6,      // 新建屏幕-屏幕识别码
  },
  location:{
    nameSize: 24,     // 位置管理-位置
  },
  content: {
    nameSize: 32,     // 素材中心-素材名称
    codeSize: 6,      // 新建屏幕-屏幕识别码
  },
  app:{
    nameSize: 32,     // 应用市场-应用名称
    actnameSize: 32,  // 应用市场-活动名称
  },

  user: {
    nameSize: 32,     // 新建子账号-姓名
  }



}
