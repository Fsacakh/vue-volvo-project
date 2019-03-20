<!--核检清单，小区查看经销商页-->
<!--add by llf-->
<!--2017/6/21-->

<template>
  <div class="page-wrapper">
    <page-header>
      <a slot="title">{{subzoneName}}</a>
    </page-header>

<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill='false'>
      <table-item v-for="item in items" v-bind:data="item" v-bind:key="item.text" v-on:click.native="goDealer(item.dealerId, item.dealerName)">
        <a slot="title"><span class="item-left">{{item.dealerName}}</span></a>
      <a slot="state">
      <a v-for="state in item.states">
      {{state.stateName}}
      <span style='float:right; margin-left: 0.5rem;width: 1.5rem;'>{{state.count}}</span>
      <br>
      </a>
      </a>
      </table-item>
    </mt-loadmore>
</div>

  </div>
</template>

<script>
  import TableItem from '../components/TableItem'
  import PageHeader from '../components/PageHeader'

  import {HTTP} from '../common/http'
  import router from '../router'

  import { Loadmore, Toast } from 'mint-ui'

  export default {
    name: 'checklistsubzone',
    data: function () {
      return {
        subzoneId: '',
        subzoneName: '',
        items: [],
        allLoaded: false,
        currPage: 1,
        pageSize: 10,
        wrapperHeight: ''
      }
    },
    components: {
      HTTP,
      Loadmore,
      'pageHeader': PageHeader,
      'tableItem': TableItem
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'Dealerlist') {
        this.$localStorage.set('clszPage', this.currPage)
      }
//      console.log('组件路由勾子712：beforeRouteLeave: ' + this.currPage)
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('clszPage')
      if (!this.currPage || this.currPage === 1 || this.$route.params.subzoneId !== this.$localStorage.get('subzoneId')) {
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
        this.subzoneId = this.$route.params.subzoneId
        this.subzoneName = this.$route.params.subzoneName
        if (!this.subzoneId || !this.subzoneName) {
          this.subzoneId = this.$localStorage.get('subzoneId')
          this.subzoneName = this.$localStorage.get('subzoneName')
        } else {
          this.$localStorage.set('subzoneId', this.subzoneId)
          this.$localStorage.set('subzoneName', this.subzoneName)
        }
        HTTP.get('/plan/bysubzone?subzone=' + this.subzoneId + '&page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.results
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
        this.subzoneId = this.$route.params.subzoneId
        this.subzoneName = this.$route.params.subzoneName
        if (!this.subzoneId || !this.subzoneName) {
          this.subzoneId = this.$localStorage.get('subzoneId')
          this.subzoneName = this.$localStorage.get('subzoneName')
        } else {
          this.$localStorage.set('subzoneId', this.subzoneId)
          this.$localStorage.set('subzoneName', this.subzoneName)
        }
        HTTP.get('/plan/bysubzone?subzone=' + this.subzoneId + '&page=1&size=' + size)
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.results
            if (response.data.results.length === 0 || response.data.results.length < size) {
              this.allLoaded = true
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goDealer: function (id, name) {
        router.push({name: 'Dealerlist', params: {dealerId: id, dealerName: name}})
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/plan/bysubzone?subzone=' + this.subzoneId + '&page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
//            console.log(this.currPage + ': ' + JSON.stringify(response.data))
//            console.log(response.data.results)
            if (response.data.results.length === 0 || response.data.results.length < this.pageSize) {
              this.allLoaded = true
              Toast('已加载到底部了')
            }
            this.items = this.items.concat(response.data.results)
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
        this.$refs.loadmore.onBottomLoaded()
      }
    }
  }

</script>

<style lang="scss" type="text/scss" scoped>
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
  width: 8rem;
  }

</style>
