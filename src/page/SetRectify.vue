<!--行动计划,小区经理设置整改的负责人,经销商填写行动计划,经销商整改-->
<!--add by llf-->
<!--2017/6/28-->

<template>
  <div class='page-wrapper'>
    <page-header>
      <a slot='title'>{{pageTitle}}</a>
    </page-header>

    <div v-if='setShow'>
      <action-form>
        <a slot='form-title'>整改内容</a>
        <a slot='form-content'>
          <div class='content-border'>
            <div class='question-content'>{{response.plandetail.question.content}}</div>
          </div>
          <div class='form-item'>
            <span class='item-name'>负责人</span>
            <div class='item-state'>
              <input :disabled='setDisable' class="person-input" v-model="responsibleText" type="text"/>
            </div>
          </div>

          <div class='form-item'>
            <span class='item-name'>截止时间</span>
            <div class='item-state'>
              <mt-datetime-picker :startDate="startDate" :endDate="endDate" ref="picker" type="date"
                                  year-format="{value} 年"
                                  month-format="{value} 月"
                                  date-format="{value} 日"
                                  v-model="pickerValue"
                                  @confirm="handleConfirm" @cancel='handleCancel'>
              </mt-datetime-picker>
              <div class='time-picker'>
                <button class="calendar-btn-type" @click="openPicker">
                  <Icon name="calendar" class="calendar-type" scale="1.5"></Icon>
                </button>
                <input disabled='true' class="deadline-input" v-model="deadlineText" type="text"/>
              </div>
            </div>
          </div>

          <div class='form-item'>
            <span class='item-name'>整改方式</span>
            <div class='item-state'>
              <div class='standard-type'>{{standardText}}<br>
                <span class='reference-type' v-show='isstandard'>*{{wayText}}</span>
              </div>
            </div>
          </div>
          <div class='form-item' v-show='!dealerWrite'>
            <span class='item-name'>整改措施</span>
            <div class='item-state' v-show='!dealerWrite'><mt-switch v-model="isfill" @change.native="fillChange"></mt-switch></div>
          </div>
          <div class='form-item' v-show='dealerWrite'>
            <span class='item-name'>请填写行动计划</span>
          </div>
          <textarea v-show='dealerWrite' class='plan-textarea' v-model='wayText'></textarea>
          <button class='form-btn' @click='saveSet'>保存</button>
        </a>
      </action-form>
    </div>

    <div v-else>
      <action-form>
        <a slot='form-title'>添加整改后图片</a>

        <a slot='form-content'>
          <div v-show='!uploadpic' style='height: 4.5rem'>
            <input class="file-input" type="file" accept="image/*" @change="picChange"/>
            <Icon name="camera" class="take-photo-btn" scale="4"></Icon><br>
          </div>
          <div v-show='uploadpic' style='height: 10rem'>
            <img class="rectify-img" :src="uploadpic" @click="preview"/>
            <div @click="deletePic"><Icon name="times-circle-o" class="img-delete" scale="2"></Icon></div>
          </div>
          <div class='form-item'>
            <span class='item-name'>整改措施({{fillText}})</span>
          </div>
          <textarea class='plan-textarea' v-model='rectifyText'></textarea>
          <button class='form-btn' @click='saveRectify'>保存</button>
        </a>
      </action-form>
    </div>

  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader'
  import ActionForm from '../components/ActionForm'
  import {HTTP} from '../common/http'
  import router from '../router'

  import * as Icon from 'vue-awesome'
  import {DatetimePicker, Switch, Indicator, Toast} from 'mint-ui'

  export default {
    name: 'setrectify',
    data: function () {
      return {
        pageTitle: '',
        type: '',
        state: '',
        actionDetailId: '',
        response: '',
        responsibleText: '',
        deadlineText: '',
        wayText: '',
        isstandard: '',
        standardText: '',
        pickerValue: '',
        isfill: false,
        dealerWrite: false,
        fillText: '选填',
        rectifyText: '',
        uploadpic: '',
        policy: {},
        setShow: false,
        picPrew: false,
        setDisable: true,
        startDate: '',
        endDate: ''
      }
    },
    components: {
      Icon,
      HTTP,
      DatetimePicker,
      Switch,
      'pageHeader': PageHeader,
      'actionForm': ActionForm
    },
    created: function () {
      this.fetchData()
      HTTP.get('/file/policy')
        .then(function (response) {
          this.policy = response.data
//          console.log(response.data)
        }.bind(this))
        .catch(function () {
          Toast('网络连接错误')
        })
    },
    methods: {
      fetchData: function () {
        this.startDate = new Date()
        this.endDate = new Date(new Date().getFullYear() + 10, new Date().getMonth(), new Date().getDay())
        this.type = this.$localStorage.get('type')
        this.actionDetailId = this.$route.params.actionDetailId
        if (!this.actionDetailId) {
          this.actionDetailId = this.$localStorage.get('actionDetailId')
        } else {
          this.$localStorage.set('actionDetailId', this.actionDetailId)
        }
        HTTP.get('actiondetail/' + this.actionDetailId)
          .then(function (response) {
//            console.log(response.data)
            this.response = response.data.data
            this.responsibleText = this.response.responsible
            this.isfill = this.response.fill
            this.deadlineText = this.response.deadline
            this.wayText = this.response.way
            this.isstandard = this.response.isstandard
            this.standardText = this.response.isstandard === true ? '标准整改' : '非标准整改'
            this.state = this.response.state
            this.fillText = this.isfill === true ? '必填' : '选填'
            if (this.type === '0' && this.response.isstandard === false && (this.state === 2 || this.state === 3)) {
              this.pageTitle = '请填写行动计划'
              this.dealerWrite = true
              this.setShow = true
              this.setDisable = true
            } else if (this.type === '1' && (this.state === 1 || this.state === 2 || this.state === 3)) {
              this.pageTitle = '整改项'
              this.setShow = true
              this.setDisable = false
            } else if (this.type === '0' && (this.state === 4 || this.state === 5)) {
              this.pageTitle = '整改方案'
            } else {
              this.pageTitle = '整改项'
              this.setShow = true
            }
//            console.log(this.dealerWrite)
//            console.log(this.fillText)
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      openPicker () {
        if (this.type === '0') {
          return
        }
        this.$refs.picker.open()
      },
      handleConfirm () {
        this.deadlineText = this.pickerValue.toLocaleDateString()
      },
      handleCancel () {
        this.deadlineText = ''
      },
      fillChange () {
        if (this.setDisable === true) {
          this.isfill = !this.isfill
        }
      },
      fillClick () {
//        console.log('this.setDisable2:' + this.setDisable)
//        console.log('click1: ' + this.isfill)
        if (this.setDisable === true) {
//          console.log('click2: ' + this.isfill)
          return
        }
      },
      saveSet: function () {
        if (!(this.state === 1 || this.state === 2 || this.state === 3)) {
          Toast('已提交，不能修改！')
//          console.log('小区经理且action未提交的时候可以修改')
          return
        } else if (this.type === '1') {
          if (!this.responsibleText) {
            Toast('请填写负责人')
            return
          } else if (!this.pickerValue) {
            Toast('请填写截止日期')
            return
          }
          HTTP.patch('/actiondetail/' + this.actionDetailId, {
            'data': {
              'deadline': this.pickerValue,
              'responsible': this.responsibleText,
              'fill': this.isfill
            }
          }).then(function (response) {
//            console.log(response.data)
            if (response.status === 200) {
              Toast('保存成功')
            } else {
              Toast('保存失败' + response.status)
            }
          })
            .catch(e => {
              this.errors.push(e)
            })
        } else if (this.type === '0' && this.dealerWrite === true && this.setShow === true && (this.state === 2 || this.state === 3)) {
          if (!this.wayText) {
            Toast('请填写行动计划')
            return
          }
          HTTP.patch('/actiondetail/' + this.actionDetailId + '/complete', {
            'way': this.wayText
          }).then(function (response) {
//            console.log(response.data)
            if (response.status === 200) {
              Toast('完善成功')
            } else {
              Toast('完善失败' + response.status)
            }
          })
            .catch(e => {
              this.errors.push(e)
            })
        } else if (this.type === '0' && this.setShow === true && this.dealerWrite === false && this.state === 3) {
          Toast('您没有权限修改')
//          console.log('setShow: ' + this.setShow + ';state: ' + this.state + ';type: ' + this.type + ';this.dealerWrite: ' + this.dealerWrite)
        } else {
//          console.log('setShow: ' + this.setShow + ';state: ' + this.state + ';type: ' + this.type + ';this.dealerWrite: ' + this.dealerWrite)
        }
      },
      saveRectify: function () {
//        console.log('isfill: ' + this.isfill)
//        console.log('rectifyText: ' + this.rectifyText)
        if (this.isfill && !this.rectifyText) {
          Toast('请填写整改措施')
          return
        }
        HTTP.post('/rectification', {
          'data': {
            'actionid': this.actionDetailId,
            'picurl': this.uploadpic,
            'strategy': this.rectifyText
          }
        }).then(function (response) {
          if (response.status === 201) {
            Toast('整改成功')
            router.go(-1)
          } else if (response.status === 400) {
            Toast('整改失败，整改措施必须填写！')
          } else {
            Toast('保存失败' + response.status)
          }
        })
          .catch(e => {
            this.errors.push(e)
          })
      },
      calculate_object_name: function (filename) {
        var policy = this.policy
        var suffix = this.get_suffix(filename)
        var key = policy.dir
        var gobjectname = key + this.random_string(10) + suffix
        return gobjectname
      },
      random_string: function (len) {
        len = len || 32
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
        var maxPos = chars.length
        var pwd = ''
        for (var i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
      },
      get_suffix: function (filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = filename.substring(pos)
        }
        return suffix
      },
      deletePic: function () {
        this.uploadpic = ''
      },
      picChange: function () {
        var data = new FormData()
        var input = document.querySelector('.file-input')
        var file = input.files[0]
        var key = this.calculate_object_name(file.name)
        data.append('key', key)
        data.append('policy', this.policy.policy)
        data.append('OSSAccessKeyId', this.policy.accessid)
        data.append('success_action_status', 200)
        data.append('signature', this.policy.signature)
        data.append('file', file)
        var config = {header: {'content-type': false}}
        Indicator.open('上传中...')
        HTTP.post(this.policy.host, data, config)
          .then(function (response) {
            if (response.status === 200) {
              Indicator.close()
              Toast('上传成功')
              this.uploadpic = this.policy.host + '/' + key
            } else {
              Indicator.close()
              Toast('上传失败')
            }
          }.bind(this))
          .catch(function (error) {
            Indicator.close()
            console.log(error)
          })
      },
      preview: function () {
        this.picPreview = true
      },
      closePreview: function () {
        this.picPreview = false
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

  .content-border {
    border-bottom: 0.01rem solid #e5e5e5;
  }

  .question-content {
    @include fc(black);
    @include sc(0.8rem, black, normal);
    @include ta(left);
    @include mg(0.5rem, 1rem, 0.5rem, 1rem);

  }

  .form-item {
    /*<!--@include fj(flex-start, row, stretch,center);-->*/
    @include fj(space-between, row, center,center);
    height: 2rem;
    /*width: 16rem;*/
    /*border-bottom: 0.1rem solid #f5f5f5;*/
    /*width: 80%*/
  }

  .item-name {
    @include sc(0.8rem, black, nomal);
    @include ta(left);
    @include mg(0.5rem,1rem,0.5rem,1rem);
  }

  .item-state {
    @include ta(left);
    @include mg(0.5rem,1rem,0.5rem,0);
  }

  .time-picker {
    @include fj(space-between, row, center,center);
  }

  .calendar-type {
    @include fc(#f2f2f2);
  }
  .calendar-btn-type{
    @include bgc(#FFFFFF);
    border: none;
    height: 1.5rem;
  }

  .standard-type {
    border-color: #b8bbbf;
    @include wh(8rem,1.5rem);
    font-size: 0.6rem;
    @include mg(0.5rem,0,0,-9rem);
  }

  .reference-type {
    @include sc(0.6rem, red, nomal);
    @include mg(-1rem,0,0,0rem);
  }

  .person-input {
    @include wh(8rem,1.5rem);
    @include bgc(#FFFFFF);
    outline: none;
    @include pd(0rem, 0.5rem, 0rem, 0.5rem);
    text-align: left;
    border-radius: 4px;
    border: 0.01rem solid #e5e5e5;
    box-shadow: inset 0.5px 0.5px 0px 0px #e5e5e5;
    margin-bottom: 0.1rem;
    margin-top: 0.1rem;
  }
  .deadline-input {
    @include wh(6.5rem,1.5rem);
    @include bgc(#FFFFFF);
    outline: none;
    @include pd(0rem, 0.5rem, 0rem, 0.5rem);
    text-align: left;
    border-radius: 4px;
    border: 0.01rem solid #e5e5e5;
    box-shadow: inset 0.5px 0.5px 0px 0px #e5e5e5;
    @include mg(0.1rem, 0, 0.1rem, 0.5rem);
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
    border: 0.01rem solid #e5e5e5;
    box-shadow: inset 0.5px 0.5px 0px 0px #e5e5e5;
    @include mg(0.1rem,1rem,0.1rem,1rem);
  }


  .file-input {
    @include wh(3rem, 3rem);
    opacity: 0;
    position: absolute;
    z-index: 10;
    transform: translate(-1.5rem,1rem);
    /*<!--@include mg(2rem,0,2rem,0);-->*/
  }

  .take-photo-btn {
    color:#9D9D9D;
    position: absolute;
    transform: translate(-1.5rem,1rem);
  }
  .rectify-img {
    position: absolute;
    @include wh(6rem,8rem);
    left: 5rem;
    top: 3rem;
    /*<!--@include pd(1rem,0,1rem,0);-->*/
  }
  .img-delete {
    position: absolute;
    left: 10.5rem;
    top: 2.5rem;
    /*color: red;*/
    /*background-color: white;*/
    color: #dedede;
    background-color: transparent;
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

</style>
