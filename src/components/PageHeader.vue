<!--页面头部-->
<!--add by llf-->
<!--2017/6/20-->

<template>
  <div class="page-header">
    <div class='header-row'>
    <div class="left-btn">
      <!--<a v-on:click="goback"><Icon name="arrow-left" class="return-icon" scale="1.5"></Icon></a>-->
      <i class="icon icon-back pull-left" @click.prevent="goback"></i>
    </div>
    <div class="page-title">
      <slot name="title"></slot>
    </div>
    <div class="right-btn">
      <slot name="right-btn"></slot>
    </div>
    </div>
    </div>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import router from '../router'

  export default {
    methods: {
      goback: function () {
        router.go(-1)
      }
    },
    components: {
      Icon
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/mixin.scss";
  .page-header {
    @include wh(100%, 3rem);
    background-color: #ffffff;
    color:#3F3F3F;
    /*@include fj(space-between, row, center,center);*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: space-between;*/
    /*align-content: center;*/
    /*align-items: center;*/
    /*border-bottom: 0.1rem solid rgba(239, 239, 239, 0.8);*/
    border-bottom: 0.02rem solid #e5e5e5;
  }
  .header-row {
    @include fj(space-between, row, center,center);
    padding-top: 5%;
  }
  .left-btn {
    color:#3F3F3F;
    @include fl;
    /*padding-top: 0.5rem;*/
    padding-left: 0.6rem;
  }
  .return-icon {
  @include fc(#a2a2a3);
  @include fl;
    padding-left: 0.5rem;
  }
  .page-title {
    color:#3F3F3F;
    /*padding-top: 0.6rem;*/
    font-size: 0.9rem;
    @include cl;
  }
  .right-btn {
    color:#3F3F3F;
    @include fr;
    /*padding-top: 0.6rem;*/
    padding-right: 0.5rem;
    font-size: 0.9rem;
  }

  .icon {
    background-size: 100% auto;
    background-position: center;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-back:before {
    font-family: "iconfont" !important;
    font-style: normal;
    display: inline-block;
    content: "\e605";
  }
  .pull-left {
    float: left;
  }
</style>
