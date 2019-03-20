<!--走访报告，小区-->
<!--add by llf-->
<!--2017/7/4-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>走访报告</a>
    </page-header>
    <table-item v-on:click.native="goReportList">
      <a slot='title'><span class='item-left'>走访报告－{{subzoneName}}小区</span></a>
      <a slot='state'>
        <Icon name='angle-right' scale='1.5'></Icon>
      </a>
    </table-item>

    <div ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill='false'>
    <table-item v-for="item in items" :data="item" :key="item.id" v-on:click.native="goDealer(item.id, item.name)">
      <a slot="title"><span class='item-left'>{{item.name}}</span></a>
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
    name: 'reportlistsubzone',
    data: function () {
      return {
        items: '',
        subzoneId: '',
        subzoneName: '',
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
      if (to.name === 'DealerReport' || to.name === 'Reportlists') {
        this.$localStorage.set('rlszPage', this.currPage)
      }
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('rlszPage')
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
        HTTP.get('/dealer/bysubzone?subzone=' + this.subzoneId + '&page=' + this.currPage + '&size=' + this.pageSize)
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
        this.subzoneId = this.$route.params.subzoneId
        this.subzoneName = this.$route.params.subzoneName
        if (!this.subzoneId || !this.subzoneName) {
          this.subzoneId = this.$localStorage.get('subzoneId')
          this.subzoneName = this.$localStorage.get('subzoneName')
        } else {
          this.$localStorage.set('subzoneId', this.subzoneId)
          this.$localStorage.set('subzoneName', this.subzoneName)
        }
        HTTP.get('/dealer/bysubzone?subzone=' + this.subzoneId + '&page=1&size=' + size)
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
      goReportList: function () {
        router.push({name: 'Reportlists', params: {currType: '3', subzoneId: this.subzoneIid, subzoneName: this.subzoneName}})
      },
      goDealer: function (id, name) {
        router.push({name: 'DealerReport', params: {dealerId: id, dealerName: name}})
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/dealer/bysubzone?subzone=' + this.subzoneId + '&page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
//            console.log(this.currPage + ': ' + JSON.stringify(response.data))
//            console.log(response.data.data)
            if (response.data.data.length === 0 || response.data.data.length < this.pageSize) {
              this.allLoaded = true
              Toast('已加载到底部了')
            }
            this.items = this.items.concat(response.data.data)
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
    width: 12rem;
  }

</style>
