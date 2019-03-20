// src/device/index.js
import { router } from '../main'
import $ from 'jquery'

var u = navigator.userAgent
var isPC = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(u)
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(u)
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端

export default {
  isAndroid: isAndroid,
  isiOS: isiOS,
  isPC: isPC,
  isMobile: isMobile
}