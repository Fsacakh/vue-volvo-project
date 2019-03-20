<!--行动计划，经销商-->
<!--add by llf-->
<!--2017/6/27-->

<template>
  <div class="table-wrapper">
    <page-header>
      <a slot="title">{{dealerName}}</a>
    </page-header>

    <table-item v-show='itemShow' v-on:click.native="postAction">
      <a slot="title"><span class="item-left">{{createdName}}</span></a>
      <a slot="state">未创建</a>
    </table-item>

    <div ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill='false'>
    <table-item v-for="item in items" :data="item" :key="item.actionId" v-on:click.native="goActionDetail(item.actionId)">
      <a slot="title"><span class='item-left'>{{item.actionName}}({{item.sum}})</span></a>
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
    name: 'dealeraction',
    data: function () {
      return {
        dealerId: '',
        dealerName: '',
        items: [],
        type: '',
        itemShow: false,
        createdName: '',
        planId: '',
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
      if (to.name === 'ActionDetails') {
        this.$localStorage.set('daPage', this.currPage)
      }
//      console.log('组件路由勾子：beforeRouteLeave: ' + this.currPage)
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('daPage')
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
        this.type = this.$localStorage.get('type')
        this.dealerId = this.$route.params.dealerId
        this.dealerName = this.$route.params.dealerName
        if (!this.dealerId || !this.dealerName) {
          this.dealerId = this.$localStorage.get('dealerId')
          this.dealerName = this.$localStorage.get('dealerName')
        } else {
          this.$localStorage.set('dealerId', this.dealerId)
          this.$localStorage.set('dealerName', this.dealerName)
        }
        HTTP.get('/actiondetail/bydealer?dealer=' + this.dealerId + '&size=' + this.pageSize + '&page=' + this.currPage)
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
            if (response.data.uncreated) {
              this.itemShow = true
              this.createdName = response.data.uncreated.name
              this.planId = response.data.uncreated.planid
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      fetchDataByPage: function (size) {
        this.type = this.$localStorage.get('type')
        this.dealerId = this.$route.params.dealerId
        this.dealerName = this.$route.params.dealerName
        if (!this.dealerId || !this.dealerName) {
          this.dealerId = this.$localStorage.get('dealerId')
          this.dealerName = this.$localStorage.get('dealerName')
        } else {
          this.$localStorage.set('dealerId', this.dealerId)
          this.$localStorage.set('dealerName', this.dealerName)
        }
        HTTP.get('/actiondetail/bydealer?dealer=' + this.dealerId + '&page=1&size=' + size)
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.data
            if (response.data.data.length === 0 || response.data.data.length < size) {
              this.allLoaded = true
            }
            if (response.data.uncreated) {
              this.itemShow = true
              this.createdName = response.data.uncreated.name
              this.planId = response.data.uncreated.planid
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      postAction: function () {
        HTTP.post('/action', {
          'data': {
            'planid': this.planId
          }
        }).then(function (response) {
          if (response.status === 201 || response.status === 200) {
            Toast('生成成功')
            window.location.reload()
//            router.push({name: 'ActionDetails', params: {id: response.data.data.id}})
          } else {
            Toast('生成失败' + response.status)
          }
        })
          .catch(e => {
            this.errors.push(e)
          })
      },
      goActionDetail: function (id) {
        router.push({name: 'ActionDetails', params: {id: id}})
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/actiondetail/bydealer?dealer=' + this.dealerId + '&size=' + this.pageSize + '&page=' + this.currPage)
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


<style lang="scss" scoped>
  @import "../style/mixin.scss";

  .table-wrapper {
    position: relative;
    height: 100%;
  }

  .item-left {
  @include sc(0.8rem, #5a5a5a, nomal);
  @include ta(left);
  @include mg(0.5rem,0,0.5rem,1rem);
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 9rem;
  }

</style>
