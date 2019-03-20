// /src/util/popupMessage.js

import toastr from 'toastr'
import device from './device'

var mobileOptions = {
  'closeButton': false,
  'debug': true,
  'newestOnTop': false,
  'progressBar': false,
  'positionClass': 'toast-top-center bz-mobile-toast',
  'preventDuplicates': true,
  'onclick': null,
  'showDuration': '300',
  'hideDuration': '1000',
  'timeOut': '1000',
  'extendedTimeOut': '2000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
}

exports.popupMsg = function(msg, t = 3000) {
  toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': t,
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  }
  if (device.isMobile) {
    toastr.options = mobileOptions
  }

  toastr['success'](msg)
}

exports.popupErrMsg = function(msg, t = 5000) {
  toastr.options = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': t,
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  }
  if (device.isMobile) {
    toastr.options = mobileOptions
  }
  toastr['error'](msg)
}

exports.popupInfoMsg = function(msg, t = 3000) {
  toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': t,
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  }
  if (device.isMobile) {
    toastr.options = mobileOptions
  }
  toastr['info'](msg)
}