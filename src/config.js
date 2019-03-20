const env = process.env.NODE_ENV
var hostServer = 'https://dcss.volvocars.com.cn/volvo/'
var qiniuDomain = 'http://ob7wh55tb.bkt.clouddn.com/'

if (env === 'testing') {
    hostServer = 'https://dcss.volvocars.com.cn/volvo/'

} else if (env === 'production') {
    hostServer = 'https://dcss.volvocars.com.cn/volvo/'

} else if (env === 'upgrade') {
    hostServer = 'https://dcss.volvocars.com.cn/volvo/'

}

var home = hostServer + 'm/screen/list/1'

module.exports = {
    HOST_SERVER: hostServer
}
