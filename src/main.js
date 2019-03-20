// src/main.js
import Vue from 'vue'
import VueResource from 'vue-resource'
import moment from 'moment'
import router from './router'
import { configRouter } from './route-config'
import auth from './auth'
import device from './util/device'
import VueLazyload from 'vue-lazyload'
import VueLocalStorage from 'vue-localstorage'
import MintUI from 'mint-ui'
import touch from 'vue-directive-touch'
import VueTabs from 'vue-nav-tabs'
import VueCharts from 'vue-chartjs'

Vue.use(MintUI)
Vue.use(VueResource)
Vue.use(VueLazyload)
Vue.use(touch)
Vue.use(VueTabs)
Vue.use(VueCharts)
Vue.use(VueLocalStorage)

Vue.config.debug = true
Vue.config.devtools = true

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: 'dist/error.png',
    loading: 'dist/loading.gif',
    attempt: 1
})

// 滚动条 v-scroll
Vue.directive('scroll', function() {
    var value = location.href
    var i = value.lastIndexOf('!')
    if (i > -1) {
        value = value.substring(i + 1)
        var dotSave = window.sessionStorage.getItem('dot:' + value)
    }
    Vue.nextTick(() => {
        if (this.el) { this.el.scrollTop = dotSave }
        if (this.el.firstChild && this.el.firstChild.nextElementSibling) {
            this.el.firstChild.nextElementSibling.scrollTop = dotSave
        }
    })
})

Vue.filter('dateFormat', function(value) {
    if (value !== '' && value !== null && value !== undefined) {
        return moment(value).fromNow()
    } else {
        return moment().format('YYYY/MM/DD')
    }
})

Vue.filter('progressFormat', function(value) {
    return moment().format('DD') + '/' + moment().endOf('month').format('DD')
})

Vue.filter('dateFormatabsolute', function(value) {
    if (value !== '' && value !== null && value !== undefined) {
        return moment(value).format('YYYY-MM-DD HH:mm  ')
    } else {
        return ''
    }
})

Vue.filter('stateFormat', function(value) {
    switch (value) {
        case 0:
            return '已完成'
        case 1:
            // 已经创建完成，但是还没有核检完
            return '检核中'
        case 2:
            // 尚未创建
            return '检核中'
        default:
            return '已过期'
    }
})

Vue.filter('itemState', function(ispass, isinspected) {
    if (ispass) {
        return '达标'
    } else if (isinspected) {
        return '未达标'
    } else {
        return '待检核'
    }
})

Vue.filter('actionState', function(count, state) {
    if (state === 1) {
        return count + '项待确认'
    } else if (state === 2) {
        return '确认完毕'
    } else if (state === 3) {
        return '全部合格'
    } else if (state === 4) {
        return count + '项待整改'
    } else if (state === 5) {
        return count + '项待审核'
    } else {
        return '整改完毕'
    }
})

Vue.filter('actionDetailState', function(state) {
    if (state === 1) {
        return '待确认'
    } else if (state === 2) {
        return '待完善'
    } else if (state === 3) {
        return '已确认'
    } else if (state === 4) {
        return '待整改'
    } else if (state === 5) {
        return '待审核'
    } else if (state === 6) {
        return '已整改'
    } else if (state === 7) {
        return '未达标'
    } else if (state === 8) {
        return '已关闭'
    } else if (state === 9) {
        return '已超时'
    } else {
        return '待审核'
    }
})

Vue.filter('backlogTitle', function(item, type) {
    if (type === '0') {
        if (item.state === 2) {
            return '走访报告已生成'
        } else if (item.state === 4) {
            return '行动计划已生成'
        } else if (item.state === 6) {
            return '行动计划已完成'
        } else if (item.state === 7) {
            return '行动计划-整改项已驳回'
        } else if (item.state === 9) {
            return '行动计划-整改项已关闭'
        } else if (item.state === 10) {
            return ' 行动计划-整改项已驳回'
        } else if (item.state === 12) {
            return '行动计划-整改项快到期'
        } else if (item.state === 13) {
            return '行动计划-整改项未整改'
        }
    } else if (type === '1') {
        if (item.state === 1) {
            return '检核清单已下发'
        } else if (item.state === 2) {
            return '走访报告'
        } else if (item.state === 3) {
            return item.dealer
        } else if (item.state === 5) {
            return item.dealer + '-整改项待审核'
        } else if (item.state === 9) {
            return item.dealer + '-未达标项已关闭'
        } else if (item.state === 10) {
            return item.dealer + '-未达标项已驳回'
        } else if (item.state === 13) {
            return item.dealer + '-整改项待审核'
        }
    } else if (type === '2') {
        if (item.state === 2) {
            return '大区走访报告'
        } else if (item.state === 4) {
            return '行动计划已生成'
        } else if (item.state === 8) {
            return '行动计划-两次整改未达标'
        }
    } else if (type === '3') {
        if (item.state === 2) {
            return '全国走访报告'
        } else if (item.state === 4) {
            return '行动计划已生成'
        } else if (item.state === 11) {
            return '行动计划-三次整改未达标'
        }
    }
})

Vue.filter('secondTitle', function(item, type) {
    if (type === '0') {
        if (item.state === 2) {
            return item.plan
        } else if (item.state === 4) {
            return item.unrectify + '项待整改'
        } else if (item.state === 6) {
            return item.rectify + '项已整改，' + item.closed + '项已关闭'
        } else if (item.state === 7 || item.state === 9 || item.state === 10 || item.state === 12 || item.state === 13) {
            return item.unrectify + '项待整改，' + item.closed + '项已关闭'
        }
    } else if (type === '1') {
        if (item.state === 1) {
            return item.plan
        } else if (item.state === 2) {
            return item.dealer
        } else if (item.state === 3) {
            return item.unstandard + '项未达标'
        } else if (item.state === 5 || item.state === 9 || item.state === 10 || item.state === 13) {
            return item.unstandard + '项未达标，' + item.rectify + '项已整改'
        }
    } else if (type === '2') {
        if (item.state === 2) {
            return item.plan
        } else if (item.state === 4 || item.state === 8) {
            return item.dealer
        }
    } else if (type === '3') {
        if (item.state === 2) {
            return item.plan
        } else if (item.state === 4 || item.state === 11) {
            return item.dealer
        }
    }
})

//将大区的英文转化为中文
Vue.filter('swithRegion', function(value) {
    //if(value === '总计'||'平均'||'EAST'||'NORTH'||'SOUTH')

    if (value === '总计') {
        return '总计'
    } else if (value === '平均') {
        return '平均'
    } else if (value === 'EAST') {
        return '东区'
    } else if (value === 'NORTH') {
        return '北区'
    } else if (value === 'SOUTH') {
        return '南区'
    } else if (value === 'WEST') {
        return '西区'
    } else {
        return value
    }
})

// 设置moment语言
moment.defineLocale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
        LT: 'Ah点mm分',
        LTS: 'Ah点m分s秒',
        LTT: 'YYYY/MM/DD',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MMMD日',
        LLL: 'YYYY年MMMD日Ah点mm分',
        LLLL: 'YYYY年MMMD日ddddAh点mm分',
        l: 'YYYY-MM-DD',
        ll: 'YYYY年MMMD日',
        lll: 'YYYY年MMMD日Ah点mm分',
        llll: 'YYYY年MMMD日ddddAh点mm分',
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function(hour, meridiem) {
        if (hour === 12) {
            hour = 0
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
            meridiem === '上午') {
            return hour
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12
        }
    },
    meridiem: function(hour, minute, isLower) {
        var hm = hour * 100 + minute
        if (hm < 600) {
            return '凌晨'
        } else if (hm < 900) {
            return '早上'
        } else if (hm < 1130) {
            return '上午'
        } else if (hm < 1230) {
            return '中午'
        } else if (hm < 1800) {
            return '下午'
        } else {
            return '晚上'
        }
    },
    calendar: {
        sameDay: function() {
            return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT'
        },
        nextDay: function() {
            return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT'
        },
        lastDay: function() {
            return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT'
        },
        nextWeek: function() {
            var startOfWeek, prefix
            startOfWeek = moment().startOf('week')
            prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]'
            return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm'
        },
        lastWeek: function() {
            var startOfWeek, prefix
            startOfWeek = moment().startOf('week')
            prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]'
            return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm'
        },
        sameElse: 'LL'
    },
    ordinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function(number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日'
            case 'M':
                return number + '月'
            case 'w':
            case 'W':
                return number + '周'
            default:
                return number
        }
    },
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d 年'
    },
    week: {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
})

//auth.checkAuthWithBackend()


// configure router


// Start the app on the #app div
import App from './App.vue'

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
