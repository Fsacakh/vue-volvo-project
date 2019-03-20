<!--行动计划用到的表格-->
<!--add by llf-->
<!--2017/6/28-->

<template>
  <div class="form-wrapper">
    <div class='header-border'>
      <div class='form-title'>
        <slot name='form-title'></slot>
      </div>
    </div>
    <div>
      <slot name='form-content'></slot>
    </div>
    <!--<div class='form-btn'>-->
      <!--<slot name='form-btn'></slot>-->
    <!--</div>-->
  </div>
</template>


<script>
  export default {
  }
</script>


<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";
  .form-wrapper {
    @include pr;
    @include bgc(#ffffff);
    @include borderRadius(0.5rem);
    /*<!--@include pd(0.01rem,0.01rem,0.01rem,0.01rem);-->*/
    @include mg(0.3rem, 0.3rem, 0.3rem, 0.3rem);
    border: 0.01rem solid #e5e5e5;
  }

  .header-border {
    /*border-bottom: 0.01rem solid rgba(112, 114, 116, 0.4);*/
    /*border-top: 0.1rem solid white;*/
    border-top: 0.01rem solid white;
    border-bottom: 0.01rem solid #e5e5e5;
  }

  .form-title {
    @include ta(left);
    @include mg(0.5rem, 1rem, 0.5rem, 1rem);
    font-size: 0.8rem;
    @include fc(black);
  }

</style>
