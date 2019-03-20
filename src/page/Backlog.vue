<!--待办事项-->
<!--add by llf-->
<!--2017/6/19-->

<template>
  <!--<div class="page-wrapper" v-touch:left="menuDisappear" v-touch:right="showMenu">-->
  <div class="page-wrapper">
    <div id='backlogDivId'>

      <!--<div class='header-fixed'>-->
      <div class="page-header">
        <div class='header-row'>
          <div v-on:click="showMenu" @click="showMenu">
            <Icon name="bars" class="return-btn" scale="1.5"></Icon>
          </div>
          <div class="table-title">
            <!--VOLVO DCSS-->
            <!--<img src="../assets/backlog-logo.png" class="backlog-pic"/>-->
            <img src="../assets/home-logo.png" class="backlog-pic"/>
          </div>
        </div>
      </div>
      <div class="table-content-header">
        <div class="table-content-title">待办事项</div>
      </div>
      <!--</div>-->

      <div class="table-content" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill='false'>
          <backlog-item v-for="item in items" :data="item" :key="item.id" v-on:click.native='goToLinks(item)'>
            <a slot='item-icon'>
              <Icon :name='getIconName(item.type)' scale="2"></Icon>
            </a>
            <a slot="item-title">{{item|backlogTitle(type)}}</a><br>
            <a slot="item-second-title">{{item|secondTitle(type)}}</a>
            <a slot="item-time">{{item.time}}</a>
          </backlog-item>
        </mt-loadmore>
      </div>
    </div>
    <!--<mynav class="my-nav" v-show="isShow" v-on:mynavClose="receiveClose" onmousewheel="return false" ontouchmove="return false;"></mynav>-->
    <mynav id='myNav' class="my-nav" v-show="isShow" v-on:mynavClose="receiveClose" v-touch:left="menuDisappear"></mynav>
  </div>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import mynav from '../components/NavList.vue'
  import BacklogItem from '../components/BacklogItem'
  import {Loadmore, Toast} from 'mint-ui'
  import router from '../router'
  import {HTTP} from '../common/http'
  export default {
    name: 'backlog',
    components: {
      Icon,
      mynav,
      Loadmore,
      'backlogItem': BacklogItem
    },
    data: function () {
      return {
        type: '',
        isShow: false,
        items: [],
        allLoaded: false,
        currPage: '',
        pageSize: 10,
        wrapperHeight: '',
        scrollTop: ''
      }
    },
    mounted: function () {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
    },
    beforeRouteLeave (to, from, next) {
//      console.log('组件路由勾子：beforeRouteLeave: ' + this.currPage)
      this.$localStorage.set('backlogPage', this.currPage)
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('backlogPage')
      if (!this.currPage || this.currPage === 1) {
        this.currPage = 1
        this.fetchData()
      } else {
        this.fetchDataByPage(this.currPage * this.pageSize)
      }
    },
    watch: {
      isShow: function () {
        if (this.isShow) {
          this.disable_scroll()
        } else {
          this.enable_scroll()
        }
      }
    },
    methods: {
      fetchData: function () {
        this.type = this.$localStorage.get('type')
        HTTP.get('/logs/deal?page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.data
            if (this.items.length === 0) {
              this.allLoaded = true
              Toast('当前项为空')
            }
            if (this.items.length < this.pageSize) {
              this.allLoaded = true
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      fetchDataByPage: function (size) {
        this.type = this.$localStorage.get('type')
        HTTP.get('/logs/deal?page=1&size=' + size)
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.data
            if (response.data.data.length === 0 || response.data.data.length < size) {
              this.allLoaded = true
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goToLinks: function (item) {
        var areaId = this.$localStorage.get('areaId')
        var areaName = this.$localStorage.get('areaName')
        if (item.type === 1) {         // 清单
          router.push({name: 'CheckListSubzone', params: {subzoneId: areaId, subzoneName: areaName}})
//          router.push({name: 'ListDetails', params: { id: item.id }})
        } else if (item.type === 2) {  // 报告
          if (this.type === '3') {
            router.push({name: 'RadarChart', params: {currType: '1', currTitle: '全国', year: item.year, month: item.month}})
          } else if (this.type === '2') {
            router.push({name: 'RadarChart', params: {zoneId: areaId, currType: '2', currTitle: areaName + '大区', year: item.year, month: item.month}})
          } else if (this.type === '1') {
//            router.push({name: 'RadarChart', params: {subzoneId: areaId, currType: '3', currTitle: areaName + '小区', year: item.year, month: item.month}})
            router.push({name: 'RadarChart', params: { planId: item.id, currType: '4', currTitle: item.dealer }})
          } else {
            router.push({name: 'RadarChart', params: { planId: item.id, currType: '4', currTitle: areaName }})
          }
//          router.push({name: 'RadarChart', params: { id: item.id }})
        } else if (item.type === 3) {  // 整改
          if (this.type === '1' && item.state === 3) {
            HTTP.post('/action', {
              'data': {
                'planid': item.id
              }
            }).then(function (response) {
              if (response.status === 201 || response.status === 200) {
                router.push({name: 'ActionDetails', params: {id: response.data.data.id}})
              } else {
                console.log('生成失败' + response.status)
              }
            })
              .catch(e => {
                this.errors.push(e)
              })
          } else {
            router.push({name: 'ActionDetails', params: { id: item.id }})
          }
        }
      },
      getIconName: function (type) {
        return type === 1 ? 'calculator' : type === 2 ? 'clipboard' : 'edit'
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/logs/deal?page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
//            console.log(this.currPage + ': ' + JSON.stringify(response.data))
//            console.log(response.data.data)
            if (response.data.data.length === 0 || response.data.data.length < this.pageSize) {
              this.allLoaded = true
            }
            this.items = this.items.concat(response.data.data)
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
        this.$refs.loadmore.onBottomLoaded()
      },
      showMenu: function () {
        this.isShow = true
      },
      receiveClose: function () {
        this.isShow = false
      },
      menuDisappear: function () {
        this.isShow = false
      },
      disable_scroll: function () {
        this.scrollTop = document.getElementById('backlogDivId').scrollTop
        document.getElementById('backlogDivId').classList.add('modal-show')
        document.getElementById('backlogDivId').style.top = -this.scrollTop + 'px'
      },
      enable_scroll: function () {
        document.getElementById('backlogDivId').classList.remove('modal-show')
        document.getElementById('backlogDivId').scrollTop = this.scrollTop
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";
  .my-nav {
    position: absolute;
    top: 0;
    left: 0;
    /*bottom: 0;*/
    /*overflow: scroll;*/
  }

  .page-wrapper {
    position: relative;
    /*position: absolute;*/
    height: 100%;
    width: 100%;
    background-color: #F6F6F6;
    z-index: 0;
  }

  /*.header-fixed {*/
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*width: 100%;*/
  /*height: 10rem;*/
  /*background-color: white;*/
  /*}*/
  .page-header {
    width: 100%;
    height: 3rem;
    background-color: #ffffff;
    color: #F5F6FE;
    border-bottom: 0.02rem solid #e5e5e5;
  }
  .header-row {
    padding-top: 6%;
    @include fj(space-between, row, center,center);
  }
  .return-btn {
    color: #a2a2a3;
    @include fl;
    /*padding-top: 0.6rem;*/
    padding-left: 0.6rem;
  }
  .table-title {
    color: #F5F6FE;
    /*padding-top: 0.8rem;*/
    @include cl;
  }

  .table-content {
    background-color: #FFFFFF;
    margin-top: 0.5rem;
  }

  .table-content-header {
    background-color: #FFFFFF;
    height: 2.5rem;
    line-height: 2rem;
  }

  .table-content-title {
    @include sc(0.9rem, #5a5a5a, normal);
    padding-top: 0.3rem;
    display: inline-block;
  }
  .backlog-pic {
    width: 85%;
  }
  .modal-show {
    position: fixed;
    width: 100%;
  }


</style>
