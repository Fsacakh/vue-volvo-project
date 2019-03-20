<!--行动计划，总部查看大区页-->
<!--add by llf-->
<!--2017/6/27-->

<template>
  <div class="page-wrapper">
    <page-header>
      <a slot="title">行动计划</a>
    </page-header>

    <table-item v-for="item in items" v-bind:data="item" v-bind:key="item.zoneId" v-on:click.native="goZone(item.zoneId, item.zoneName)">
      <a slot="title"><span class='item-left'>{{item.zoneName}}({{item.sum}})</span></a>
      <a slot="state">
        <a v-for="state in item.states">
          {{state.stateName}}
          <span style='float:right; margin-left: 0.5rem;width: 1.5rem;'>{{state.count}}</span>
          <br>
        </a>
      </a>
    </table-item>
  </div>
</template>

<script>
  import TableItem from '../components/TableItem'
  import PageHeader from '../components/PageHeader'

  import {HTTP} from '../common/http'
  import router from '../router'
  import {Toast} from 'mint-ui'

  export default {
    name: 'actionlists',
    data: function () {
      return {
        items: []
      }
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        HTTP.get('/actiondetail/all')
          .then(function (response) {
//            console.log(response.data)
            this.items = response.data.data
            if (this.items.length === 0) {
              Toast('当前项为空')
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goZone: function (id, name) {
        router.push({name: 'ActionListZone', params: {zoneId: id, zoneName: name}})
      }
    },
    components: {
      HTTP,
      'pageHeader': PageHeader,
      'tableItem': TableItem
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
