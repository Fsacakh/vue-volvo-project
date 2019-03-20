<!--行动计划，大区查看小区页-->
<!--add by llf-->
<!--2017/6/27-->

<template>
  <div class="table-wrapper">
    <page-header>
      <a slot="title">{{zoneName}}</a>
    </page-header>

    <table-item v-for="item in items" v-bind:data="item" v-bind:key="item.subzoneId" v-on:click.native="goSubzone(item.subzoneId, item.subzoneName)">
      <a slot="title"><span class="item-left">{{item.subzoneName}}({{item.sum}})</span></a>
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
    name: 'actionlistzone',
    data: function () {
      return {
        zoneId: '',
        zoneName: '',
        items: []
      }
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.zoneId = this.$route.params.zoneId
        this.zoneName = this.$route.params.zoneName
        if (!this.zoneId || !this.zoneName) {
          this.zoneId = this.$localStorage.get('zoneId')
          this.zoneName = this.$localStorage.get('zoneName')
        } else {
          this.$localStorage.set('zoneId', this.zoneId)
          this.$localStorage.set('zoneName', this.zoneName)
        }
        HTTP.get('/actiondetail/byzone?zone=' + this.zoneId)
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
      goSubzone: function (id, name) {
        router.push({name: 'ActionListSubzone', params: {subzoneId: id, subzoneName: name}})
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
    width: 8rem;
  }

</style>
