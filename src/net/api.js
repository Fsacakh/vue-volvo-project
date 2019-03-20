// /src/net/api.js

import $ from 'jquery'
import { popupErrMsg } from '../util/popupMessage'
import { router } from '../main'
import auth from '../auth'
import _ from 'lodash'
import config from '../config'

const L = config.HOST_SERVER

var ajax = function(url, data, type, sc, fc, msgSwitch) {
    if (_.isUndefined(msgSwitch)) {
        msgSwitch = true
    }

    var token = {}

    // 访问限制的URL，需要检查token
    if (_.startsWith(url, 'm/')) {
        if (!auth.checkAuth()) { // 本地没有toekn，未授权的访问
            popupErrMsg('未被授权的访问，请您登录。')
            router.go('login')
        } else { // 本地有token
            token = auth.getAuthHeader()
        }
    }

    // 准备ajax请求的参数
    var ajaxOptions = {
        url: L + url,
        headers: token,
        type: type,
        contentType: 'application/json',
        timeout: 10 * 1000
    }

    // POST请求，需要添加三个额外参数
    if (type === 'POST') {
        ajaxOptions.data = JSON.stringify(data)
        ajaxOptions.dataType = 'json'
        ajaxOptions.processData = false
    }

    $.ajax(ajaxOptions)
        .done((r) => {
            // console.log('[SUCCESS][%s][%s]\r\n%s', type.toUpperCase(), url, JSON.stringify(r))
            sc(r)
        })
        .fail((xhr, status, error) => {
            console.log('[FAIL][%s][%s]\r\n%s --- %s --- %s --- %s --- %s --- %s',
                type.toUpperCase(),
                url,
                status,
                error,
                xhr.readyState,
                xhr.status,
                xhr.statusText,
                xhr.responseText)

            if (xhr.responseText) { // 服务器有返回信息
                var e = JSON.parse(xhr.responseText)
                var code = e.code

                if (code === 401) { // 未授权，token错误，token过期，无token，user被删除等，路由到登录页面
                    if (msgSwitch)
                        popupErrMsg(e.message)
                    auth.logout()

                } else if (code === 501 || code === 503) { // 服务器发生系统严重错误，需要提示，并且不执行回调函数
                    if (msgSwitch)
                        popupErrMsg(e.message)
                } else { // 服务器发生常规应用错误，执行回调函数
                    fc(e)
                }
            } else { // 服务器没有返回任何信息，网络出现问题
                if (msgSwitch)
                    popupErrMsg('网络出现问题啦，尝试很久都无法连接服务，要不去喝杯咖啡后再试试看吧～～', 10 * 1000)
            }
        })
}

var _post = function(url, data, sc, fc, msgSwitch) {
    ajax(url, data, 'POST', sc, fc, msgSwitch)
}

var _get = function(url, sc, fc, msgSwitch) {
    ajax(url, null, 'GET', sc, fc, msgSwitch)
}


var Api = {

    //商务政策kpi
    kpi: {
        /*******过滤区域，时间，零附件*******/
        //获取大区
        getAllRegion: function(sc, fc) {
            _get('kpi/getAllRegion', sc, fc, false)
        },
        //获取小区
        getAllAreaByRegion: function(data, sc, fc) {
            _get('kpi/getAllAreaByRegion/' + data.region, sc, fc, false)
        },
        //获取经销商
        getAllDealerByArea: function(data, sc, fc) {
            _get('kpi/getAllDealerByArea/' + data.region + '/' + data.area, sc, fc, false)
        },
        getYearList: function(sc, fc) {
            _get('kpi/getYearList', sc, fc, false)
        },
        getQuarter: function(sc, fc) {
            _get('kpi/getQuarter', sc, fc, false)
        },
        getMonthByQuarter: function(data, sc, fc) {
            _get('kpi/getMonthByQuarter/' + data.quarter, sc, fc, false)
        },
        getRateOfTime: function(data, sc, fc) {
            _get('kpi/getRateOfTime/' + data.year + '/' + data.quarter + '/' + data.month, sc, fc, false)
        },
        //总部权限
        getAllRegionBusinessPolicyKpi: function(data, sc, fc) {
            _get('kpi/getAllRegionBusinessPolicyKpi/' + data.year + '/' + data.quarter + '/' + data.month, sc, fc, false)
        },
        //大区权限
        getAllAreaBusinessPolicyKpiByRegion: function(data, sc, fc) {
            _get('kpi/getAllAreaBusinessPolicyKpiByRegion/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region, sc, fc, false)
        },
        //小区权限
        getAllDealerBusinessPolicyKpiByArea: function(data, sc, fc) {
            _get('kpi/getAllDealerBusinessPolicyKpiByArea/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area, sc, fc, false)
        },
        //经销商权限
        getDealerBusinessPolicyKpiByDealerCode: function(data, sc, fc) {
            _get('kpi/getDealerBusinessPolicyKpiByDealerCode/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.dealer, sc, fc, false)
        }
    },
    //销售
    sale: {
        product: {
            getAllRegionMajorProductKpi: function(data, sc, fc) {
                _get('majorProduct/getAllRegionMajorProductKpi/' + data.year + '/' + data.quarter + '/' + data.month, sc, fc, false)
            },
            getAllAreaMajorProductKpiByRegion: function(data, sc, fc) {
                _get('majorProduct/getAllAreaMajorProductKpiByRegion/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region, sc, fc, false)
            },
            getAllDealerMajorProductKpiByArea: function(data, sc, fc) {
                _get('majorProduct/getAllDealerMajorProductKpiByArea/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area, sc, fc, false)
            },
            getDealerMajorProductKpiByDealerCode: function(data, sc, fc) {
                _get('majorProduct/getDealerMajorProductKpiByDealerCode/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.dealer, sc, fc, false)
            }
        },
        wholeSale: {
            getAllRegionWholeSaleKpi: function(data, sc, fc) {
                _get('wholeSale/getAllRegionWholeSaleKpi/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.statisticType, sc, fc, false)
            },
            getAllAreaWholeSaleKpiByRegion: function(data, sc, fc) {
                _get('wholeSale/getAllAreaWholeSaleKpiByRegion/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.statisticType, sc, fc, false)
            },
            getAllDealerWholeSaleKpiByArea: function(data, sc, fc) {
                _get('wholeSale/getAllDealerWholeSaleKpiByArea/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.statisticType, sc, fc, false)
            },
            getDealerWholeSaleKpiByDealerCode: function(data, sc, fc) {
                _get('wholeSale/getDealerWholeSaleKpiByDealerCode/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.dealer + '/' + data.statisticType, sc, fc, false)
            }
        },
        retail: {
            getAllRegionRetailSaleKpi: function(data, sc, fc) {
                _get('retailSale/getAllRegionRetailSaleKpi/' + data.year + '/' + data.quarter + '/' + data.month, sc, fc, false)
            },
            getAllAreaRetailSaleKpiByRegion: function(data, sc, fc) {
                _get('retailSale/getAllAreaRetailSaleKpiByRegion/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region, sc, fc, false)
            },
            getAllDealerRetailSaleKpiByArea: function(data, sc, fc) {
                _get('retailSale/getAllDealerRetailSaleKpiByArea/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area, sc, fc, false)
            },
            getDealerRetailSaleKpiByDealerCode: function(data, sc, fc) {
                _get('retailSale/getDealerRetailSaleKpiByDealerCode/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.dealer, sc, fc, false)
            }
        },
        stock: {
            getAllRegionStockKpi: function(data, sc, fc) {
                _get('stock/getAllRegionStockKpi/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.statisticType, sc, fc, false)
            },
            getAllAreaStockKpiByRegion: function(data, sc, fc) {
                _get('stock/getAllAreaStockKpiByRegion/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.statisticType, sc, fc, false)
            },
            getAllDealerStockKpiByArea: function(data, sc, fc) {
                _get('stock/getAllDealerStockKpiByArea/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.statisticType, sc, fc, false)
            },
            getDealerStockKpiByDealerCode: function(data, sc, fc) {
                _get('stock/getDealerStockKpiByDealerCode/' + data.year + '/' + data.quarter + '/' + data.month + '/' + data.region + '/' + data.area + '/' + data.dealer + '/' + data.statisticType, sc, fc, false)
            }
        }
    }
}

module.exports = Api