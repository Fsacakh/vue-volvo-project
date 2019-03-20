<!--行动计划,小区经理审核整改,达标-->
<!--add by llf-->
<!--2017/6/30-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>审核</a>
    </page-header>

    <action-form>
      <a slot='form-title'>审核结果</a>
      <a slot='form-content'>
        <div class='form-item'>
          <span class='item-name'>审核结果</span>
          <div class='item-state'>{{passText}}</div>
        </div>

        <div class='form-item' v-show='ddlShow'>
          <span class='item-name'>截止时间</span>
          <div class='item-state'>
            <mt-datetime-picker :startDate="startDate" :endDate="endDate" ref="picker" type="date"
                                year-format="{value} 年"
                                month-format="{value} 月"
                                date-format="{value} 日"
                                v-model="pickerValue"
                                @confirm="handleConfirm"></mt-datetime-picker>
            <div class='time-picker' v-show='pickerShow'>
            <button class="calendar-btn-type" @click="openPicker">
              <Icon name="calendar" class="calendar-type" scale="1.5"></Icon>
            </button>
            <input disabled='true' class="person-input" v-model="deadlineText" type="text"/>
            </div>
          </div>
        </div>

        <div class='form-item'>
          <span class='item-name'>审核说明(选填)</span>
        </div>
        <textarea class='plan-textarea' v-model='descriptionText'></textarea>
        <button class='form-btn' @click='commitAudit'>提交</button>
      </a>
    </action-form>


  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader'
  import ActionForm from '../components/ActionForm'

  import * as Icon from 'vue-awesome'
  import {DatetimePicker, Toast} from 'mint-ui'

  import {HTTP} from '../common/http'
  import router from '../router'

  export default {
    name: 'auditrectify',
    data: function () {
      return {
        recId: '',
        ispass: '',
        actionDetailId: '',
        detail: '',
        rectification: '',
        responsibleText: '',
        deadlineText: '',
        standardText: '',
        wayText: '',
        passText: '',
        descriptionText: '',
        count: '', // 审核的次数
        pickerShow: '',
        pickerValue: '',
        ddlShow: '',
        type: '',
        startDate: '',
        endDate: ''
      }
    },
    components: {
      Icon,
      HTTP,
      DatetimePicker,
      'pageHeader': PageHeader,
      'actionForm': ActionForm
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.startDate = new Date()
        this.endDate = new Date(new Date().getFullYear() + 10, new Date().getMonth(), new Date().getDay())
//        console.log('startDate: ' + this.startDate)
//        console.log('endDate: ' + this.endDate)
        this.type = this.$localStorage.get('type')
        this.count = this.$route.params.count
        this.recId = this.$route.params.recId
        this.ispass = this.$route.params.ispass
        if (this.type === '1') {
          this.passText = this.ispass === true ? '达标' : '未达标'
          this.pickerShow = !this.ispass
        } else {
          this.passText = this.ispass === true ? '继续整改' : '关闭'
          this.pickerShow = this.ispass
        }
        if (this.type === '1') {
          this.ddlShow = this.count === 1 && this.ispass === false
        } else if (this.type === '2') {
          this.ddlShow = this.ispass
        }
//        console.log(this.count)
//        console.log(this.ddlShow)
      },
      commitAudit: function () {
        if (this.ispass === false && this.count === 1 && !this.pickerValue) {
          Toast('第一次审核需要提交截止日期')
          return
        }
        var myData
        if (this.ispass === true) {
          if (this.type === '1') {
            myData = {
              'data': {
                'rectid': this.recId,
                'ispass': this.ispass,
                'description': this.descriptionText
              }
            }
          } else {
            myData = {
              'data': {
                'rectid': this.recId,
                'isclosed': !this.ispass,
                'description': this.descriptionText,
                'deadline': this.pickerValue
              }
            }
          }
        } else {
          if (this.type === '1') {
            myData = {
              'data': {
                'rectid': this.recId,
                'ispass': this.ispass,
                'description': this.descriptionText,
                'deadline': this.pickerValue
              }
            }
          } else {
            myData = {
              'data': {
                'rectid': this.recId,
                'isclosed': !this.ispass,
                'description': this.descriptionText
              }
            }
          }
        }
        if (this.type === '1') {
          HTTP.post('/audit', myData).then(function (response) {
            if (response.status === 201 || response.status === 200) {
              Toast('提交成功')
              router.go(-1)
            } else {
              Toast('提交失败' + response.status)
            }
          })
            .catch(e => {
              this.errors.push(e)
            })
        } else {
          HTTP.post('/audit/zoneaudit', myData).then(function (response) {
            if (response.status === 201 || response.status === 200) {
              Toast('提交成功')
              router.go(-1)
            } else {
              Toast('提交失败' + response.status)
            }
          })
            .catch(e => {
              this.errors.push(e)
            })
        }
      },
      openPicker () {
        this.$refs.picker.open()
      },
      handleConfirm () {
        this.deadlineText = this.pickerValue.toLocaleDateString()
      }
    }
  }
</script>

<style lang='scss' type="text/scss" scoped>
  @import "../style/mixin.scss";
  .page-wrapper {
    @include pr;
    @include bgc(#F6F6F6);
    height: 100%;
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

  .form-btn {
    border-bottom-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    color: #ffffff;
    border: none;
    /*height: 2rem;*/
    @include wh(100%,2rem);
    margin-top: 0.5rem;
    font-size: 1rem;
    /*<!--@include bgc(#5684EF);-->*/
    @include bgc(rgba(25, 65, 155, 1));
  }

  .plan-textarea {
    /*<!--@include wh(15rem, 5rem);-->*/
    height: 5rem;
    width: 80%;
    @include bgc(#FFFFFF);
    @include pd(0rem, 0.5rem, 0rem, 0.5rem);
    outline: none;
    text-align: left;
    border-radius: 0.15rem;
    /*border: 0.01rem solid rgba(0, 0, 0, 0.08);*/
    border: 0.01rem solid #e5e5e5;
    /*box-shadow: inset 0.5px 0.5px 0px 0px rgba(0, 0, 0, 0.12);*/
    box-shadow: inset 0.5px 0.5px 0px 0px #e5e5e5;
    @include mg(0.1rem,1rem,0.1rem,1rem);
  }

  .calendar-btn-type{
    @include bgc(#FFFFFF);
    border: none;
    height: 1.5rem;
  }
  .person-input {
    margin-left: 0.5rem;
    @include wh(6rem,1.5rem);
    border-radius: 0.15rem;
    /*border: 0.01rem solid rgba(0, 0, 0, 0.08);*/
    border: 0.01rem solid #e5e5e5;
    /*box-shadow: inset 0.5px 0.5px 0px 0px rgba(0, 0, 0, 0.12);*/
    box-shadow: inset 0.5px 0.5px 0px 0px #e5e5e5;
  }

  .calendar-type {
    @include fc(#f2f2f2);
  }
  .time-picker {
    @include fj(space-between, row, center,center);
  }
</style>
