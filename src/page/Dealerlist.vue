<!--经销商核检清单-->
<!--add by llf-->
<!--2017/6/20-->

<template>
  <div class="table-wrapper">
    <page-header>
      <a slot="title">{{dealerName}}</a>
      <!--<a slot="right-btn">提交</a>-->
    </page-header>

    <div ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :auto-fill='false'>
        <table-item v-for="item in items" v-bind:data="item" v-bind:key="item.id" v-on:click.native="goDealerList(item)">
          <a slot="title"><span class="item-left">{{item.name}}</span></a>
          <a slot="state">{{item.state|stateFormat}}</a>
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
    name: 'dealerlist',
    data: function () {
      return {
        dealerId: '',
        dealerName: '',
        items: [],
        type: '',
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
      if (to.name === 'ListDetails') {
        this.$localStorage.set('dlPage', this.currPage)
      }
//      console.log('组件路由勾子：beforeRouteLeave: ' + this.currPage)
      next()
    },
    created: function () {
      this.currPage = this.$localStorage.get('dlPage')
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
        HTTP.get('/plan/bydealer/' + this.dealerId + '?page=' + this.currPage + '&size=' + this.pageSize)
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
            this.items = response.data.data
            if (response.data.data.length === 0 || response.data.data.length < size) {
              this.allLoaded = true
              Toast('已加载到底部了')
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goDealerList: function (item) {
        if (item.state === 2 && this.type === '1') {
          HTTP.post('/plan', {
            'data': {
              'paperid': item.paperid,
              'dealerid': this.dealerId
            }
          }).then(function (response) {
            if (response.status === 201) {
              Toast('生成成功')
              router.push({name: 'ListDetails', params: {id: response.data.data.id, name: item.name}})
            } else {
              Toast('生成失败' + response.status)
            }
          })
          .catch(e => {
            this.errors.push(e)
          })
        } else {
          router.push({name: 'ListDetails', params: {id: item.id, name: item.name}})
        }
      },
      loadBottom: function () {
        this.currPage ++
        HTTP.get('/plan/bydealer/' + this.dealerId + '?size=' + this.pageSize + '&page=' + this.currPage)
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
  @include sc(0.9rem, #5a5a5a, nomal);
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
