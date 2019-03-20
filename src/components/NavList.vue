<template>
  <div class="nav-bg">
    <div class='items-wrapper'>
      <div class="items">
        <div class="nav-header">
          <img src="static/img/nav-img.jpeg" class="header-pic"/>
          <div>
            <div class='user-name-left'>{{username}}</div>
            <div class='right-icon' @click='goToPass'><Icon name="caret-down" scale="2"></Icon></div>
          </div>
        </div>
        <ul id="nav" class='nav-items'>
          <item v-for="model in navData"
                v-on:selectItem="receiveItem"
                :selectedItem='selectedItem'
                :models="model">
          </item>
        </ul>
      </div>
      <div class="bg-right" @click="closeMenu"></div>
    </div>
  </div>
</template>
<script>
  import item from './Navigation.vue'
  import * as Icon from 'vue-awesome'
  import router from '../router'
  //  var myData = [
  //    {
  //      name: 'download',
  //      item: '运营管理',
  //      link: '',
  //      children: [
  //        {name: 'list-alt', item: '核检清单', link: '/checklists'},
  //        {name: 'calendar', item: '行动计划', link: ''},
  //        {name: 'clipboard', item: '走访报告', link: ''},
  //        {name: 'bar-chart', item: '运营分析会', link: ''}
  //      ]
  //    }, {
  //      name: 'star',
  //      item: '销售管理',
  //      children: [],
  //      link: ''
  //    }, {
  //      name: 'send',
  //      item: '信息反馈',
  //      children: [],
  //      link: ''
  //    }, {
  //      name: 'envelope-open',
  //      item: '业务公告',
  //      children: [],
  //      link: ''
  //    }
  //  ]

  export default {
    name: 'mynav',
    components: {
      item,
      Icon
    },
    data: function () {
      return {
//        navData: this.myData,
        selectedItem: '',
        username: this.$localStorage.get('userName'),
        navData: [
          {
            name: 'download',
            item: '运营管理',
            link: '',
            children: [
//              {name: 'list-alt', item: '核检清单', link: '/checklists'},
              {name: 'list-alt', item: '核检清单', link: this.$localStorage.get('checkUrl')},
              {name: 'clipboard', item: '走访报告', link: this.$localStorage.get('reportUrl')},
              {name: 'calendar', item: '行动计划', link: this.$localStorage.get('actionUrl')},
              {name: 'bar-chart', item: '运营分析会', link: ''}
            ]
          }, {
            name: 'star',
            item: '销售管理',
            children: [
              {name: 'list-alt', item: '批售信息', link: '/m/sale/wholeSale'},
              {name: 'calendar', item: '零售信息', link: '/m/sale/retail'},
              {name: 'clipboard', item: '库存信息', link: '/m/sale/stock'},
              {name: 'bar-chart', item: '重点产品', link: '/m/sale/product'}
            ],
            link: ''
          }, {
            name: 'flag',
            item: 'KPI管理',
            children: [
              {name: 'list-alt', item: '商务政策KPI', link: '/m/kpi/business'},
              {name: 'calendar', item: '部门KPI', link: ''},
              {name: 'clipboard', item: '区域KPI', link: ''},
              {name: 'bar-chart', item: 'PDCA KPI', link: ''}
            ],
            link: ''
          }, {
            name: 'send',
            item: '信息反馈',
            children: [],
            link: ''
          }, {
            name: 'envelope-open',
            item: '业务公告',
            children: [],
            link: ''
          }, {
            name: 'sign-out',
            item: '退出登录',
            children: [],
            link: '/'
          }
        ]
      }
    },
    methods: {
      receiveItem: function (data) {
//        console.log(data)
        this.selectedItem = data
      },
      closeMenu: function () {
        this.$emit('mynavClose')
      },
      goToPass: function () {
        router.push('ChangePass')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/mixin";

  .nav-bg {
    /*position: absolute;*/
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .items-wrapper {
  @include fj(space-between, row, center,center);
  }
  .items {
    z-index: 30;
    background-color: #ffffff;
    width: 80%;
    height: 100vh;
  }
  .bg-right {
    z-index: 30;
    width: 20%;
    height: 100vh;
  }

  .nav-header {
    position: relative;
  }

  .header-pic {
    width: 100%;
  }
  .user-name-left {
    position: absolute;
    left: 1rem;
    bottom: 0.8rem;
  @include sc(0.8rem, #FFFFFF, 500)
  }
  .right-icon {
    position: absolute;
    right: 1rem;
    bottom: 0.4rem;
  @include sc(0.8rem, #FFFFFF, 500)
  }
  .nav-items {
    position: relative;
    height: 70vh;
    overflow: scroll;
  }
</style>


