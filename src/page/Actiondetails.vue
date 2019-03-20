<!--行动计划，小区经理查看某一月份清单页-->
<!--add by llf-->
<!--2017/6/27-->

<template>
  <div class="page-wrapper">
    <page-header>
      <a slot="title">{{response.action.name}}</a>
    </page-header>

    <action-item :isItem="false">
      <a slot="type-name">编号:{{response.action.plan.code}}</a>
      <a slot="type-count">{{response.action.dealer.name}}</a>
    </action-item>

    <action-item :isItem="true" v-for="(item,index) in response.type" :models="item" :action-id="response.action.id" v-on:actionItemOpen="updateOpenArray" :item-index='index' :item-open="sendArray">
      <a slot="type-name">{{item.name}}({{item.unstandard}})</a>
      <!--<a slot="type-count">{{item.count|actionState(item.state)}}</a>-->

      <a v-if='(item.state !== 4 && item.state !== 5)' slot="type-count">
        <!--<span class='item-state'>{{item.count}}项待检核</span>-->
        <span class='state-name'>{{item.count|actionState(item.state)}}</span>
      </a>
      <a v-else slot="type-count">
        <div class='state-row'>
          <span class='state-name'>待整改</span>
          <span class='state-number'>{{item.unrect}}</span>
        </div>
        <div class='state-row'>
          <span class='state-name'>待审核</span>
          <span class='state-number'>{{item.unaudit}}</span>
        </div>
      </a>
    </action-item>

    <button :disabled='commitDisable' class="commit-btn" v-show="myBtnShow" @click="btnHandler">提交</button>
  </div>
</template>


<script>
  import * as Icon from 'vue-awesome'
  import { Toast } from 'mint-ui'
  import ActionItem from '../components/ActionItem'
  import PageHeader from '../components/PageHeader'

  import {HTTP} from '../common/http'

  export default {
    name: 'actiondetails',
    data: function () {
      return {
        type: '',
        actionId: '',
        response: '',
        myBtnShow: false,
        commitDisable: '',
        isCommit: '',
        openArray: [],
        sendArray: ''
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'SetRectify' || to.name === 'AuditRectify') {
        this.$localStorage.set('adOpenArray', JSON.stringify(this.openArray))
      } else {
        this.$localStorage.remove('adOpenArray')
      }
      next()
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.type = this.$localStorage.get('type')
        this.commitDisable = this.type !== '1'
        this.actionId = this.$route.params.id
        if (!this.actionId) {
          this.actionId = this.$localStorage.get('actionId')
        } else {
          this.$localStorage.set('actionId', this.actionId)
        }
        HTTP.get('/action/' + this.actionId)
          .then(function (response) {
//            console.log(response.data)
            this.response = response.data
            this.isCommit = response.data.action.iscommit
            this.setOpenArray()
            this.setBtn()
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      setOpenArray: function () {
        this.openArray = JSON.parse(this.$localStorage.get('adOpenArray'))
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
      setBtn: function () {
        if (this.type !== '1') {
          this.myBtnShow = false
          return
        }
        if (this.isCommit) {
          this.myBtnShow = false
          return
        }
        this.response.type.forEach(function (obj) {
          if (!(obj.state === 2 || obj.state === 3)) {
            this.myBtnShow = false
            return
          }
        })
        this.myBtnShow = true
      },
      btnHandler: function () {
        if (this.type !== '1') {
          return
        }
        var r = confirm('确认提交行动计划表吗？')
        if (r === true) {
          HTTP.post('/action/' + this.actionId + '/commit')
            .then(function (response) {
              if (response.status === 200) {
                Toast('提交成功')
                // 提交成功，强制刷新页面
                window.location.reload()
              } else if (response.status === 409) {
                Toast('尚有未确认或待完善项')
              } else {
                Toast('网络连接错误')
              }
            })
            .catch(e => {
              this.errors.push(e)
            })
        } else {
          console.log('no')
        }
      }
    },
    components: {
      Icon,
      HTTP,
      'pageHeader': PageHeader,
      'actionItem': ActionItem
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/mixin.scss";

  .page-wrapper {
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
    /*border: none;*/
    /*@include bgc(#5c83f3);*/
    @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
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
  @include mg(0,0,0,0.5rem);
  }

</style>

