import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [{
            path: '',
            redirect: '/Login'
        },
        {
            path: '/Login',
            name: 'Login',
            component: require('../page/Login.vue')
        },
        {
            path: '/checklists',
            name: 'Checklists',
            component: require('../page/Checklists.vue')
        },
        {
            path: '/listdetails',
            name: 'ListDetails',
            component: require('../page/Listdetails.vue')
        },
        {
            path: '/checkstandard',
            name: 'Checkstandard',
            component: require('../page/Checkstandard.vue')
        },
        {
            path: '/backlog',
            name: 'Backlog',
            component: require('../page/Backlog.vue')
        },
        {
            path: '/dealerlist',
            name: 'Dealerlist',
            component: require('../page/Dealerlist.vue')
        },
        {
            path: '/checklistzone',
            name: 'CheckListZone',
            component: require('../page/CheckListZone.vue')
        },
        {
            path: '/checklistsubzone',
            name: 'CheckListSubzone',
            component: require('../page/CheckListSubzone.vue')
        },
        {
            path: '/radarchart',
            name: 'RadarChart',
            component: require('../page/RadarChart.vue')
        },
        {
            path: '/actionlists',
            name: 'Actionlists',
            component: require('../page/Actionlists.vue')
        },
        {
            path: '/actionlistzone',
            name: 'ActionListZone',
            component: require('../page/ActionListZone.vue')
        },
        {
            path: '/actionlistsubzone',
            name: 'ActionListSubzone',
            component: require('../page/ActionListSubzone.vue')
        },
        {
            path: '/dealeraction',
            name: 'DealerAction',
            component: require('../page/DealerAction.vue')
        },
        {
            path: '/actiondetails',
            name: 'ActionDetails',
            component: require('../page/ActionDetails.vue')
        },
        {
            path: '/setrectify',
            name: 'SetRectify',
            component: require('../page/SetRectify.vue')
        },
        {
            path: '/auditrectify',
            name: 'AuditRectify',
            component: require('../page/AuditRectify.vue')
        },
        {
            path: '/auditpass',
            name: 'AuditPass',
            component: require('../page/AuditPass.vue')
        },
        {
            path: '/report',
            name: 'Report',
            component: require('../page/Report.vue')
        },
        {
            path: '/reportlists',
            name: 'Reportlists',
            component: require('../page/Reportlists.vue')
        },
        {
            path: '/reportlistzone',
            name: 'ReportListZone',
            component: require('../page/ReportListZone.vue')
        },
        {
            path: '/reportlistsubzone',
            name: 'ReportListSubzone',
            component: require('../page/ReportListSubzone.vue')
        },
        {
            path: '/dealerreport',
            name: 'DealerReport',
            component: require('../page/DealerReport.vue')
        },
        {
            path: '/forgetpass',
            name: 'ForgetPass',
            component: require('../page/ForgetPass.vue')
        },
        {
            path: '/changepass',
            name: 'ChangePass',
            component: require('../page/ChangePass.vue')
        },
        {
            path: '/m/kpi/business',
            name: 'business',
            component: require('../components/kpi/business/index.vue')
        },
        {
            path: '/m/kpi/business/dealer',
            name: 'business-dealer',
            component: require('../components/kpi/business-dealer/index.vue')
        },
        {
            path: '/m/sale/product',
            name: 'product',
            component: require('../components/sale/product/index.vue')
        },
        {
            path: '/m/sale/product/dealer',
            name: 'product-dealer',
            component: require('../components/sale/product-dealer/index.vue')
        },
        {
            path: '/m/sale/retail',
            name: 'retail',
            component: require('../components/sale/retail/index.vue')
        },
        {
            path: '/m/sale/retail/dealer',
            name: 'retail-dealer',
            component: require('../components/sale/retail-dealer/index.vue')
        },
        {
            path: '/m/sale/wholeSale',
            name: 'wholeSale',
            component: require('../components/sale/wholeSale/index.vue')
        },
        {
            path: '/m/sale/wholeSale/dealer',
            name: 'wholeSale-dealer',
            component: require('../components/sale/wholeSale-dealer/index.vue')
        },
        {
            path: '/m/sale/stock',
            name: 'stock',
            component: require('../components/sale/stock/index.vue')
        },
        {
            path: '/m/sale/stock/dealer',
            name: 'stock-dealer',
            component: require('../components/sale/stock-dealer/index.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(savedPosition.x, savedPosition.y)
            }, 200)
        }
    }
})