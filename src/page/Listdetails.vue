<!--核检清单，小区经理查看某一月份清单页-->
<!--add by llf-->
<!--2017/6/16-->

<template>
  <div class="table-wrapper">
    <page-header>
      <a slot="title">{{response.plan.paper.name}}</a>
    </page-header>

    <detail-header>
      <a slot="item-number">编号:{{response.plan.code}}</a><br>
      <a slot="item-name">{{response.plan.paper.name}}</a>
      <a slot="end-time">{{timeContent}}</a>
    </detail-header>

    <list-item v-for="(item, index) in response.type" :models="item" v-on:listItemOpen="updateOpenArray" :item-index='index' :item-open="sendArray" :list-id="response.plan.id">
      <a slot="type-name">{{item.name}}</a>
      <a v-if='item.count !== 0' slot="type-count">
        <!--<span class='item-state'>{{item.count}}项待检核</span>-->
        <span class='state-name'>{{item.count}}项待检核</span>
      </a>
      <a v-else slot="type-count">
        <div class='state-row'>
          <span class='state-name'>达标</span>
          <span class='state-number'>{{item.standard}}</span>
        </div>
        <div class='state-row'>
          <span class='state-name'>不达标</span>
          <span class='state-number'>{{item.unstandard}}</span>
        </div>
        </a>
      </a>
    </list-item>
    <button class="commit-btn" v-show="btnShow" @click="btnHandler">{{btnText}}</button>
  </div>
</template>


<script>
  import PageHeader from '../components/PageHeader'
  import DetailHeader from '../components/DetailHeader'
  import ListItem from '../components/ListItem'
  import * as Icon from 'vue-awesome'

  import {HTTP} from '../common/http'
  import router from '../router'
  import {Toast} from 'mint-ui'

  export default {
    name: 'listdetails',
    data: function () {
      return {
        listId: '',
        dealerName: '',
        response: '',
        planState: '',
        btnText: '',
        btnShow: '',
        timeContent: '',
        openArray: [],
        sendArray: ''
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'Checkstandard' || to.name === 'RadarChart') {
        this.$localStorage.set('ldOpenArray', JSON.stringify(this.openArray))
      } else {
        this.$localStorage.remove('ldOpenArray')
      }
      next()
    },
    created: function () {
      this.fetchData()
    },
    components: {
      Icon,
      HTTP,
      'pageHeader': PageHeader,
      'listItem': ListItem,
      'detailHeader': DetailHeader
    },
    methods: {
      fetchData: function () {
        this.listId = this.$route.params.id
        if (!this.listId) {
          this.listId = this.$localStorage.get('listId')
        } else {
          this.$localStorage.set('listId', this.listId)
        }
        HTTP.get('/plan/' + this.listId)
          .then(function (response) {
//            console.log(response.data)
            this.response = response.data
            this.setPlanState(this.response.plan.state)
            this.dealerName = response.data.plan.dealer.name
            this.setBtn()
            this.setOpenArray()
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      setPlanState: function (state) {
        if (state === 0) {
          this.planState = state
          this.timeContent = '提交时间:' + this.response.plan.commitTime
        } else if (state === 1) {
          this.planState = state
        } else {
          this.timeContent = '提交截止:' + this.response.plan.paper.endTime
          var mul = 0
          this.response.type.forEach(function (obj) {
            mul += obj.count
          })
          if (mul === 0) {
            this.planState = 3
          }
        }
      },
      setBtn: function () {
        if (this.planState === 0) {
          this.btnText = '查看走访报告'
          this.btnShow = true
        } else if (this.planState === 3) {
          this.btnText = '提交'
          this.btnShow = true
        } else {
          this.btnShow = false
        }
      },
      setOpenArray: function () {
        this.openArray = JSON.parse(this.$localStorage.get('ldOpenArray'))
        if (!this.openArray) {
          this.openArray = new Array(this.response.type.length)
          for (var i = 0; i < this.openArray.length; i++) {
            this.openArray[i] = 1
          }
        }
        this.sendArray = this.openArray.toString()
      },
      updateOpenArray: function (index, open) {
        this.openArray[index] = open
        this.openArray.splice(index, 1, open)
        this.sendArray = this.openArray.toString()
      },
      btnHandler: function () {
        if (this.planState === 3) {
          HTTP.post('/plan/' + this.listId + '/commit')
            .then(function (response) {
              if (response.status === 200) {
                Toast('提交成功')
                window.location.reload()
              } else if (response.status === 409) {
                Toast('尚有未检核项')
              } else {
                Toast('网络连接错误')
              }
            })
            .catch(e => {
              this.errors.push(e)
            })
        } else {
          router.push({name: 'RadarChart', params: { planId: this.listId, currType: '4', currTitle: this.dealerName }})
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../style/mixin.scss";

  .table-wrapper {
    @include pr;
    @include bgc(#F6F6F6);
    height: 100%;
  }
  .commit-btn {
    color: #ffffff;
    font-size: 1rem;
    @include wh(12rem,2.5rem)
    border-radius: 0.5rem;
    @include mg(1.5rem,0,0,0)
    @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
  }
  .item-state {
  @include sc(0.7rem, #5F86F4, nomal);
  @include ta(right);
  @include mg(0,1rem,0,0);
  }
  .state-row {
  @include fj(space-between, row, center,center);
  }
  .state-name {
  @include sc(0.7rem, #5F86F4, nomal);
  @include ta(left);
  @include mg(0,0,0,2.5rem);
  }
  .state-number{
  @include sc(0.7rem, #5F86F4, nomal);
  @include ta(right);
  @include mg(0,0,0,1rem);
  }
</style>

