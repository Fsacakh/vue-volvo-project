<!--修改密码-->
<!--add by llf-->
<!--2017/7/10-->

<template>
  <div class="page-wrapper">
      <page-header>
        <!--<a slot="title">VOLVO DCSS</a>-->
        <a slot="title">
          <!--<img src="../assets/backlog-logo.png" style='width: 85%'/>-->
          <img src="static/img/home-logo.png" style='width: 85%;margin-top: 5%'/>
        </a>
      </page-header>

    <div class='form-wrapper'>
      <div class='form-header'>
        <span class='form-title'>修改密码</span>
      </div>
      <div class='form-content'>
        <div class='input-wrapper'>
          <Icon class='user-icon' name="lock" scale="1.5"></Icon>
          <input class='input-email' v-model="oldPass" type="password" placeholder='输入旧密码'/>
        </div>

        <div class='input-wrapper'>
          <Icon class='user-icon' name="lock" scale="1.5"></Icon>
          <input class='input-email' v-model="newPass" type="password" placeholder='输入新密码'/>
        </div>

        <div class='input-wrapper'>
          <Icon class='user-icon' name="lock" scale="1.5"></Icon>
          <input class='input-email' v-model="newPassConfirm" type="password" placeholder='确认新密码'/>
        </div>

        <div class='input-wrapper'>
          <button class='form-btn' @click='changePass'>修改密码</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import {HTTP} from '../common/http'
  import PageHeader from '../components/PageHeader.vue'
  import router from '../router'
  import {Toast} from 'mint-ui'

  export default {
    name: 'changepass',
    components: {
      Icon,
      HTTP,
      'pageHeader': PageHeader
    },
    data: function () {
      return {
        oldPass: '',
        newPass: '',
        newPassConfirm: ''
      }
    },
    methods: {
      changePass: function () {
        if (!this.oldPass || !this.newPass || !this.newPassConfirm) {
          Toast('输入不能为空')
          return
        } else if (this.newPass !== this.newPassConfirm) {
          Toast('两次密码输入不一致')
          return
        }
        HTTP.post('/account/changepass', {
          'username': this.$localStorage.get('userName'),
          'oldpass': this.oldPass,
          'newpass': this.newPass
        })
          .then(function (response) {
            if (response.status === 200) {
              Toast('修改成功')
              window.localStorage.clear()
              router.push('/')
            } else if (response.status === 409) {
              Toast('原密码输入错误')
            }
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";

  .page-wrapper {
    position: relative;
    height: 100%;
    background-color: #F6F6F6;
    z-index: 0;
  }
  .table-header {
    width: 100%;
    height: 2rem;
    background-color: #5D85F3;
    color: #F5F6FE;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .return-btn {
    color: #F5F6FE;
    @include fl;
    /*padding-top: 0.6rem;*/
    padding-left: 0.6rem;
  }
  .table-title {
    color: #F5F6FE;
    @include cl;
  }
  .form-wrapper {
    @include pr;
    @include bgc(#ffffff);
    @include borderRadius(0.5rem);
    @include mg(0.3rem, 0.3rem, 0.3rem, 0.3rem);
    border:0.01rem solid #e5e5e5;
  }
  .form-header {
    border-bottom: 0.01rem solid #e5e5e5;
    border-top: 0.01rem solid white;
    height: 2rem;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  .input-wrapper {
    @include fj(space-between, row, center,center);
    border-radius: 0.25rem;
    border: 0.01rem solid #e5e5e5;
    box-shadow: inset 0.5px 0.5px 0px 0px #e5e5e5;
    @include wh(80%,2.5rem);
    @include mg(1rem,0,1rem,1.5rem);
  }
  .input-email {
    border: none;
    @include wh(85%,2.5rem);
  }
  .user-icon {
    float: left;
    color: #b8bbbf;
    padding-left: 0.5rem;
  }
  .form-btn {
    color: #ffffff;
    border-radius: 0.25rem;
    @include wh(100%,2.5rem);
    font-size: 0.9rem;
    /*border: none;*/
    /*<!--@include bgc(#5684EF);-->*/
    @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
  }
  .form-title {
    color: #3F3F3F;
  }
</style>
