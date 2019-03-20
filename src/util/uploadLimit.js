var ImageSize = 1024 * 1024 * 20 //图片限制：20M
var VideoSize = 1024 * 1024 * 500 //视频限制：500M
var Size = 1024 * 1024 * 500 //默认：500M

var ext = 'jpg,jpeg,png,mp4,avi,mov,rmvb,rm,asf,wmv'

module.exports = {
  extensions: ext,
  size: Size,

  fileLimit(value) {
    var i = value.lastIndexOf(".") + 1
    var file = value.substring(i)
    var type
    switch (file) {
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'rmvb':
      case 'asf':
      case 'wmv':
        type = 'VIDEO'
        return VideoSize
        break
      case 'jpg':
      case 'jpeg':
      case 'png':
        type = 'IMAGE'
        return ImageSize
        break
      case 'zip':
      case 'rar':
        type = 'COMPRESS' //压缩文件
        return Size
        break
      default:
        type = ''
        return Size

    }
  }

}