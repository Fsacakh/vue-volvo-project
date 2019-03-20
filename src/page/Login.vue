<!--登录页面UI重改-->
<!--add by llf-->
<!--2017/7/13-->

<template>
  <div class="page-wrapper">
    <img src="static/img/login-img.png" class='login-img'/>
    <div class='form-wrapper'>
      <div class="login-info">
        <div class="info-item">
          <div class="left-icon">
            <Icon name="user-o" color="#CED9EC"></Icon>
          </div>
          <div class="right-input">
            <input class="r-input" v-model="username" type="text" placeholder="用户名/邮箱"/>
          </div>
        </div>
        <div class="info-item">
          <div class="left-icon">
            <Icon name="lock" color="#CED9EC"></Icon>
          </div>
          <div class="right-input">
            <input class="r-input" v-model="password" type="password" placeholder="密码"/>
          </div>
        </div>
        <div class="info-item-text">
          <div class="item-text" @click='forgetPass'>忘记密码？</div>
          <div class="error-info">{{errorInfo}}</div>
        </div>
        <button class="form-btn" v-on:click="login">登 录</button>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import router from '../router'

  import {HTTP, setAuthorizationToken} from '../common/http'
  import {setLinkUrl} from '../common/myFunctions'

  export default {
    name: 'login',
    components: {
      Icon,
      HTTP
    },
    data: function () {
      return {
        username: '',
        password: '',
        errorInfo: '',
        type: '',
        areaId: '',
        areaName: '',
        checkUrl: '',
        actionUrl: '',
        reportUrl: ''
      }
    },
    methods: {
      login: function () {
        if (this.username === '' || this.password === '') {
          this.errorInfo = '请填写用户名或密码！'
        }
        HTTP.post(`/account/login`, {
          'username': this.username,
          'password': this.password
        })
          .then(response => {
            if (response.data.authorization === undefined) {
              this.errorInfo = '用户名或密码错误！'
            } else {
//              console.log(response.data)
              this.$localStorage.set('authorization', response.data.authorization)
              setAuthorizationToken(response.data.authorization)
              this.$localStorage.set('userName', this.username)
              this.$localStorage.set('type', response.data.type)
              this.$localStorage.set('areaId', response.data.areaId)
              this.$localStorage.set('areaName', response.data.name)
              this.$localStorage.set('region', response.data.region)
              this.$localStorage.set('area', response.data.area)
              this.$localStorage.set('code', response.data.code)
              this.$localStorage.set('name', response.data.name)
              setLinkUrl(response.data.type, response.data.areaId, response.data.name)
              router.push('Backlog')
            }
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      forgetPass: function () {
        router.push('ForgetPass')
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

  .login-img {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    z-index: 10;
  }

  .form-wrapper {
    position: absolute;
    top: 50%;
    left: 1.5rem;
    z-index: 20;
    width: 85%;
    height: 13.5rem;
  }

  .login-info {
    /*<!--@include mg(0.5rem, 1.5rem, 0.5rem, 1.5rem);-->*/
    @include pd(0.5rem, 1.5rem, 0.5rem, 1.5rem);
  }

  .info-item {
    @include border(0.1rem, #F6F9FD, solid);
    height: 2.5rem;
    @include mg(0, 0, 1rem, 0);
    @include pr;
    @include bgc(#FFFFFF);
    border-radius: 0.25rem;
  }

  .info-item-text {
    @include mg(0, 0, 1rem, 0);
    text-align: right;
    /*padding-left: 0.5rem;*/
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .item-text {
    text-decoration: underline;
    @include sc(0.8rem, #ffffff);
  }

  .error-info {
    @include sc(0.8rem, #fa2338);
  }

  .left-icon {
    width: 15%;
    @include ct;

  }

  .fa-icon {
    width: 0.8rem;
    height: 0.8rem; /* or any other relative font sizes */
    line-height: 0.8rem;
  }

  .right-input {
    width: 75%;
    @include ct;
    margin-left: 2rem;
  }

  .r-input {
    @include wh(100%, 1.8rem);
    background-color: #FFFFFF;
    outline: none;
    &::placeholder {
      color: #d7dce9;
    }
    @include sc(0.8rem, #000000);
    border-radius: 0.25rem;
  }

  .login-footer {
    word-spacing: 0.2em;
  }

  .form-btn {
    color: #ffffff;
    border-radius: 0.25rem;
    height: 2.5rem;
    width: 100%;
    font-size: 0.9rem;
    @include bgc(rgba(25, 65, 155, 1));
    border: 0.01rem solid rgba(55, 85, 140, 1);
  }


</style>
