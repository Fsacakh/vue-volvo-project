<!--找回密码-->
<!--add by llf-->
<!--2017/7/10-->

<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class='header-row'>
      <router-link to='/'>
        <Icon name="bars" class="return-btn" scale="1.5"></Icon>
      </router-link>
      <!--<div class="table-title">VOLVO DCSS</div>-->
      <div class="table-title">
        <!--<img src="../assets/backlog-logo.png" style='width: 85%'/>-->
        <img src="static/img/home-logo.png" style='width: 85%'/>
      </div>
    </div>
    </div>

    <div class='form-wrapper'>
      <div class='form-header'>
        <span class='form-title'>忘记密码</span>
      </div>
      <div class='form-content'>
        <div class='input-wrapper'>
          <Icon class='user-icon' name="user-o" scale="1.5"></Icon>
          <input class='input-email' v-model="emailText" type="text" placeholder='输入邮箱获取随机密码'/>
        </div>

        <div class='input-wrapper'>
          <button class='form-btn' @click='forgetPass'>找回密码</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import {HTTP} from '../common/http'
  import router from '../router'
  import { Toast } from 'mint-ui'

  export default {
    name: 'forgetpass',
    components: {
      Icon,
      HTTP
    },
    data: function () {
      return {
        emailText: ''
      }
    },
    methods: {
      forgetPass: function () {
        if (!this.emailText) {
          Toast('输入不能为空')
          return
        }
        HTTP.post('/account/forgetpass', {
          'username': this.emailText
        })
        .then(function (response) {
//          console.log(response.data.data)
          Toast(response.data.data)
          if (response.data.data === '发送成功') {
            router.push('/')
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
  .page-header {
    width: 100%;
    height: 3rem;
    background-color: #ffffff;
    color: #F5F6FE;
  }
  .header-row {
    padding-top: 6%;
    @include fj(space-between, row, center,center);
  }
  .return-btn {
    color: #a2a2a3;
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
    @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
  }
  .form-title {
   color: #3F3F3F;
  }
</style>
