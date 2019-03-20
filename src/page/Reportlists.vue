<!--走访报告,查看具体有哪些月份-->
<!--add by llf-->
<!--2017/7/4-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>走访报告</a>
    </page-header>

    <div class='area-name'>{{currTitle}}</div>

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
        items: '',
        currType: '',
        currTitle: '',
        zoneId: '',
        zoneName: '',
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
      if (to.name === 'RadarChart') {
        this.$localStorage.set('rlPage', this.currPage)
      }
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('rlPage')
      if (!this.currPage || this.currPage === 1) {
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
        this.currType = this.$route.params.currType
        if (!this.currType) {
          this.currType = this.$localStorage.get('currType')
        } else {
          this.$localStorage.set('currType', this.currType)
        }
        this.setTitle()
        HTTP.get('/paper/bypage?page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
            // console.log(response.data)
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
        this.currType = this.$route.params.currType
        if (!this.currType) {
          this.currType = this.$localStorage.get('currType')
        } else {
          this.$localStorage.set('currType', this.currType)
        }
        this.setTitle()
        HTTP.get('/paper/bypage?page=1&size=' + size)
          .then(function (response) {
            // console.log(response.data)
            this.items = response.data.data
            if (response.data.data.length === 0 || response.data.data.length < size) {
              this.allLoaded = true
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      setTitle: function () {
        if (this.currType === '1') {
          this.currTitle = '全国'
        } else if (this.currType === '2') {
          this.zoneId = this.$route.params.zoneId
          this.zoneName = this.$route.params.zoneName
          if (!this.zoneId || !this.zoneName) {
            this.zoneId = this.$localStorage.get('zoneId')
            this.zoneName = this.$localStorage.get('zoneName')
          } else {
            this.$localStorage.set('zoneId', this.zoneId)
            this.$localStorage.set('zoneName', this.zoneName)
          }
          this.currTitle = this.zoneName + '大区'
        } else {
          this.subzoneId = this.$route.params.subzoneId
          this.subzoneName = this.$route.params.subzoneName
          if (!this.subzoneId || !this.subzoneName) {
            this.subzoneId = this.$localStorage.get('subzoneId')
            this.subzoneName = this.$localStorage.get('subzoneName')
          } else {
            this.$localStorage.set('subzoneId', this.subzoneId)
            this.$localStorage.set('subzoneName', this.subzoneName)
          }
          this.currTitle = this.subzoneName + '小区'
        }
      },
      goChart: function (item) {
        if (this.currType === '1') {
          router.push({name: 'RadarChart', params: {currType: '1', currTitle: this.currTitle, year: item.year, month: item.month}})
        } else if (this.currType === '2') {
          router.push({name: 'RadarChart', params: {zoneId: this.zoneId, currType: '2', currTitle: this.currTitle, year: item.year, month: item.month}})
        } else {
          router.push({name: 'RadarChart', params: {subzoneId: this.subzoneId, currType: '3', currTitle: this.currTitle, year: item.year, month: item.month}})
        }
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/paper/bypage?page=' + this.currPage + '&size=' + this.pageSize)
          .then(function (response) {
            // console.log(this.currPage + ': ' + JSON.stringify(response.data))
            // console.log(response.data.data)
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
      width: 13rem;
    }
    .area-name {
        color: #3F3F3F;
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }
</style>
