<!--走访报告,查看具体有哪些月份-->
<!--add by llf-->
<!--2017/7/6-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>走访报告</a>
    </page-header>

    <div class='area-name'>{{dealerName}}</div>

    <div ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill='false'>
        <table-item v-for="item in items" :data="item" :key="item.id" v-on:click.native='goChart(item)'>
          <a slot="title"><span class='item-left'>走访报告－{{item.name}}</span></a>
          <a slot="state">
            <Icon name='angle-right' scale='1.5'></Icon>
          </a>
        </table-item>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader'
  import TableItem from '../components/TableItem'
  import * as Icon from 'vue-awesome'

  import {HTTP} from '../common/http'
  import router from '../router'
  import { Loadmore, Toast } from 'mint-ui'

  export default {
    name: 'reportlists',
    data: function () {
      return {
        items: [],
        currType: '',
        currTitle: '',
        planId: '',
        dealerId: '',
        dealerName: '',
        allLoaded: false,
        currPage: 1,
        pageSize: 10,
        wrapperHeight: ''
      }
    },
    components: {
      Icon,
      Loadmore,
      HTTP,
      'pageHeader': PageHeader,
      'tableItem': TableItem
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'RadarChart') {
        this.$localStorage.set('drPage', this.currPage)
      }
//      console.log('组件路由勾子：beforeRouteLeave: ' + this.currPage)
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('drPage')
      if (!this.currPage || this.currPage === 1 || this.$route.params.dealerId !== this.$localStorage.get('dealerId')) {
        this.currPage = 1
        this.fetchData()
      } else {
        this.fetchDataByPage(this.currPage * this.pageSize)
      }
    },
    mounted: function () {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
    },
    methods: {
      fetchData: function () {
        this.dealerId = this.$route.params.dealerId
        this.dealerName = this.$route.params.dealerName
        if (!this.dealerId || !this.dealerName) {
          this.dealerId = this.$localStorage.get('dealerId')
          this.dealerName = this.$localStorage.get('dealerName')
        } else {
          this.$localStorage.set('dealerId', this.dealerId)
          this.$localStorage.set('dealerName', this.dealerName)
        }
        HTTP.get('/plan/bydealer/' + this.dealerId + '?size=' + this.pageSize + '&page=' + this.currPage)
          .then(function (response) {
//            console.log(response.data)
            if (response.data.data.length === 0) {
              this.allLoaded = true
              Toast('当前项为空')
            }
            if (response.data.data.length < this.pageSize) {
              this.allLoaded = true
            }
            var tmpArr = []
            response.data.data.forEach(function (obj) {
              if (obj.state === 0) {
                tmpArr.push(obj)
              }
            })
            this.items = tmpArr
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      fetchDataByPage: function (size) {
        this.dealerId = this.$route.params.dealerId
        this.dealerName = this.$route.params.dealerName
        if (!this.dealerId || !this.dealerName) {
          this.dealerId = this.$localStorage.get('dealerId')
          this.dealerName = this.$localStorage.get('dealerName')
        } else {
          this.$localStorage.set('dealerId', this.dealerId)
          this.$localStorage.set('dealerName', this.dealerName)
        }
        HTTP.get('/plan/bydealer/' + this.dealerId + '?page=1&size=' + size)
          .then(function (response) {
//            console.log(response.data)
            if (response.data.data.length === 0 || response.data.data.length < size) {
              this.allLoaded = true
            }
            var tmpArr = []
            response.data.data.forEach(function (obj) {
              if (obj.state === 0) {
                tmpArr.push(obj)
              }
            })
            this.items = tmpArr
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goChart: function (item) {
        router.push({name: 'RadarChart', params: { planId: item.id, currType: '4', currTitle: this.dealerName }})
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/plan/bydealer/' + this.dealerId + '?size=' + this.pageSize + '&page=' + this.currPage)
          .then(function (response) {
//            console.log(this.currPage + ': ' + JSON.stringify(response.data))
//            console.log(response.data.data)
            var tmpArr = []
            if (response.data.data.length === 0 || response.data.data.length < this.pageSize) {
              this.allLoaded = true
              Toast('已加载到底部了')
            }
            response.data.data.forEach(function (obj) {
              if (obj.state === 0) {
                tmpArr.push(obj)
              }
            })
            this.items = tmpArr
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
        this.$refs.loadmore.onBottomLoaded()
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../style/mixin.scss";
  .page-wrapper {
    position: relative;
    height: 100%;
  }
  .item-left {
  @include sc(0.9rem, #5a5a5a, nomal);
  @include ta(left);
  @include mg(0.5rem,0,0.5rem,1rem);
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 13rem;
  }
  .area-name {
    color: #3F3F3F;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
</style>
