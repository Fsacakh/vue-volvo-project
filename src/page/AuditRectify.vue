<!--行动计划,小区经理审核整改-->
<!--add by llf-->
<!--2017/6/30-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>整改项</a>
    </page-header>
    <action-form>
      <a slot='form-title'>整改内容</a>
      <a slot='form-content'>
        <div class='content-border'>
          <div class='question-content'>{{detail.plandetail.question.content}}</div>
        </div>

        <div class='form-item'>
          <span class='item-name'>负责人</span>
          <div class='item-state'>{{responsibleText}}</div>
        </div>

        <div class='form-item'>
          <span class='item-name'>截止时间</span>
          <div class='item-state'>{{deadlineText}}</div>
        </div>

        <div class='form-item'>
          <span class='item-name'>整改方式</span>
          <div class='item-state'>{{standardText}}</div>
        </div>

        <div class='form-item'>
          <span class='item-name'>整改目标</span>
          <!--<div class='item-state'>{{wayText}}</div>-->
        </div>
        <div class='content-border'>
          <div class='question-content'>{{wayText}}</div>
        </div>

        <div v-for="(item, index) in rectification" class='my-div-border-color'>
          <div class='form-item'>
            <span class='item-name'>整改人</span>
            <div class='item-state'>{{item.dealer.name}}</div>
          </div>
          <div class='form-item'>
            <span class='item-name'>整改次数</span>
            <div class='item-state'>{{index + 1}}次</div>
          </div>
          <div class='form-item' v-show='item.strategy'>
            <span class='item-name'>过程管控</span>
            <div class='item-state'>{{item.strategy}}</div>
          </div>
          <div class='form-item'>
            <span class='item-name'>整改结果</span>
          </div>
          <img v-show='item.picurl' class='rectify-pic' :src= 'item.picurl'/>

          <div v-show='item.audits' v-for="myAudit in item.audits" class='my-div-border-color'>
            <div class='form-item'>
            <span class='item-name'>审核人</span>
            <div class='item-state'>{{myAudit.user.trueName}}</div>
          </div>
            <div class='form-item'>
            <span class='item-name'>审核结果</span>
            <div class='item-state'>{{myAudit.result}}</div>
          </div>
            <div class='form-item'>
            <span class='item-name'>整改时间</span>
            <div class='item-state'>{{myAudit.createTime}}</div>
          </div>
            <div class='form-item'>
            <span class='item-name'>驳回理由</span>
            <div class='item-state'>{{myAudit.description}}</div>
          </div>
          </div>

        </div>

        <button v-show='rectifyBtnShow' class="form-btn" @click='recBtnHandler'>整改</button>

        <div v-show='auditBtnShow' class='my-btn-row'>
          <button class='left-btn'@click='btnHandler(true)'>达标</button>
          <button class='right-btn' @click='btnHandler(false)'>不达标</button>
        </div>

        <div v-show='zoneAuditShow' class='my-btn-row'>
          <button class='zone-left-btn'@click='zoneBtnHandler(true)'>继续整改</button>
          <button class='zone-right-btn' @click='zoneBtnHandler(false)'>关闭</button>
        </div>
      </a>
    </action-form>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader'
  import ActionForm from '../components/ActionForm'

  import {HTTP} from '../common/http'
  import router from '../router'

  export default {
    name: 'auditrectify',
    data: function () {
      return {
        actionDetailId: '',
        detail: '',
        rectification: '',
        responsibleText: '',
        deadlineText: '',
        standardText: '',
        wayText: '',
        rectifyBtnShow: false,
        auditBtnShow: false,
        type: '',
        state: '',
        zoneAuditShow: ''
      }
    },
    components: {
      HTTP,
      'pageHeader': PageHeader,
      'actionForm': ActionForm
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.type = this.$localStorage.get('type')
        this.actionDetailId = this.$route.params.actionDetailId
        if (!this.actionDetailId) {
          this.actionDetailId = this.$localStorage.get('actionDetailId')
        } else {
          this.$localStorage.set('actionDetailId', this.actionDetailId)
        }
        HTTP.get('/actiondetail/' + this.actionDetailId + '/rectification')
          .then(function (response) {
//            console.log(response.data)
            this.detail = response.data.detail
            this.state = response.data.detail.state
            if (this.type === '0' && this.state === 4) {
              this.rectifyBtnShow = true
            } else if (this.type === '1' && this.state === 5) {
              this.auditBtnShow = true
            } else if (this.type === '1' && this.state === 9) {
              this.auditBtnShow = true
            } else if (this.type === '2' && this.state === 10) {
              this.zoneAuditShow = true
            } else {
              this.rectifyBtnShow = false
              this.auditBtnShow = false
              this.zoneAuditShow = false
            }
            this.rectification = response.data.rectification
            this.responsibleText = this.detail.responsible
            this.deadlineText = this.detail.deadline
            this.standardText = this.detail.isstandard === false ? '非标准整改' : '标准整改'
            this.wayText = this.detail.way
//            console.log(this.rectification.length)
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      btnHandler: function (pass) {
        if (this.state === 9 && pass === true) {
          return
        }
        var id = this.rectification[this.rectification.length - 1].id
        router.push({ name: 'AuditPass', params: {count: this.rectification.length, recId: id, ispass: pass} })
      },
      recBtnHandler: function () {
        router.push({name: 'SetRectify', params: {actionDetailId: this.actionDetailId}})
      },
      zoneBtnHandler: function (pass) {
        var id = this.rectification[this.rectification.length - 1].id
        router.push({name: 'AuditPass', params: {recId: id, ispass: pass}})
      }

    }
  }
</script>

<style lang='scss' type="text/scss" scoped>
  @import "../style/mixin.scss";
  .page-wrapper {
    @include pr;
    @include bgc(#F6F6F6);
    padding-bottom: 0.1rem;
    /*height: 100%;*/
  }
  .content-border {
    /*border-bottom: 0.01rem solid rgba(112, 114, 116, 0.4);*/
    border-bottom: 0.01rem solid #e5e5e5;
  }
  .question-content {
    @include fc(black);
    @include sc(0.8rem, black, normal);
    @include ta(left);
    @include mg(0.5rem, 1rem, 0.5rem, 1rem);

  }
  .form-item {
    @include fj(space-between, row, center,center);
    height: 2rem;
  }

  .item-name {
    @include sc(0.8rem, black, nomal);
    @include ta(left);
    @include mg(0.5rem,1rem,0.5rem,1rem);
  }

  .item-state {
    @include sc(0.8rem, black, nomal);
    @include ta(left);
    @include mg(0.5rem,1rem,0.5rem,0);
  }

  .rectify-pic {
    @include wh(6rem,8rem);
    @include ta(left);
    @include mg(0.5rem,0,0.5rem,-10rem);
  }
  .my-btn-row {
    @include fj(space-between, row, center,center);
  }
  .left-btn {
    border-bottom-left-radius: 0.5rem;
    color: black;
    border: none;
    border-right: 0.01rem solid  #e5e5e5;
    border-top: 0.01rem solid  #e5e5e5;
    border-bottom: 0.01rem solid #e5e5e5;
    @include wh(50%,2rem);
    font-size: 1rem;
    @include bgc(#ffffff);
  }
  .right-btn {
    border-bottom-right-radius: 0.5rem;
    color: black;
    border: none;
    border-top: 0.01rem solid  #e5e5e5;
    border-bottom: 0.01rem solid #e5e5e5;
    /*border-top: 0.01rem solid rgba(112, 114, 116, 0.4);*/
    @include wh(50%,2rem);
    font-size: 1rem;
    @include bgc(#ffffff);
  }

  .form-btn {
    border-bottom-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    color: #ffffff;
    /*height: 2rem;*/
    @include wh(100%,2rem);
    margin-top: 0.5rem;
    font-size: 1rem;
    /*border: none;*/
    /*<!--@include bgc(#5684EF);-->*/
    @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
  }

  .zone-left-btn {
    border-bottom-left-radius: 0.5rem;
    color: #ffffff;
    border: none;
    border-right: 0.01rem solid #e5e5e5;
    /*border-top: 0.01rem solid rgba(112, 114, 116, 0.4);*/
    @include wh(50%,2rem);
    font-size: 1rem;
    @include bgc(#547ced);
  }
  .zone-right-btn {
    border-bottom-right-radius: 0.5rem;
    color: #ffffff;
    border: none;
    /*border-top: 0.01rem solid rgba(112, 114, 116, 0.4);*/
    @include wh(50%,2rem);
    font-size: 1rem;
    @include bgc(#db4a51);
  }

  .my-div-border-color {
    border-top: 0.1rem solid  #e5e5e5;
  }

  .item-way-class {
    @include sc(0.8rem, black, nomal);
    @include ta(left);
    @include mg(0.5rem,1rem,0.5rem,1rem);
    width: 100%;
    height: 3rem;
  }
</style>
