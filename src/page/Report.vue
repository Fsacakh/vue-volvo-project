<!--走访报告,全国-->
<!--add by llf-->
<!--2017/7/4-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>走访报告</a>
    </page-header>
    <table-item v-on:click.native="goReportList">
      <a slot='title'><span class="item-left">走访报告－全国</span></a>
      <a slot='state'>
        <Icon name='angle-right' scale='1.5'></Icon>
      </a>
    </table-item>

    <table-item v-for="item in items" :data="item" :key="item.id" v-on:click.native="goZone(item.id, item.name)">
      <a slot="title"><span class="item-left">{{item.name}}</span></a>
      <a slot="state">
        <Icon name='angle-right' scale='1.5'></Icon>
      </a>
    </table-item>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader'
  import TableItem from '../components/TableItem'
  import * as Icon from 'vue-awesome'

  import {HTTP} from '../common/http'
  import router from '../router'

  export default {
    name: 'report',
    data: function () {
      return {
        items: ''
      }
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        HTTP.get('/zones')
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.data
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goReportList: function () {
        router.push({name: 'Reportlists', params: {currType: '1'}})
      },
      goZone: function (id, name) {
        router.push({name: 'ReportListZone', params: {zoneId: id, zoneName: name}})
      }
    },
    components: {
      Icon,
      HTTP,
      'pageHeader': PageHeader,
      'tableItem': TableItem
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
    width: 8rem;
  }
</style>
