<!--详情页列表表头-->
<!--add by llf-->
<!--2017/6/22-->
<template>
  <div class="table-item">
    <div class="item-number"><slot name="item-number"></slot></div>
    <!--<hr class="split-line"/>-->
    <div class="item-detail">
      <div class="item-name"><slot name="item-name"></slot></div>
      <div class="item-time"><slot name="end-time"></slot></div>
    </div>
  </div>
</template>


<script>
  export default {
  }
</script>


<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";

  .table-item{
    @include bgc(#FFFFFF);
    @include mg(0.5rem,0,0,0);
  }

  .item-number {
    @include sc(0.9rem, #5a5a5a, nomal);
    @include ta(left);
    @include mg(0,1rem,0,1rem);
    border-bottom: 0.01rem solid #e5e5e5;
  }

  .item-detail {
    @include fj(space-between, row, center,flex-start);
    /*<!--@include fj(flex-start, row, stretch,center);-->*/
    height: 1.5rem;
  }

  .item-name {
    @include sc(0.7rem, #b8bbbf, nomal);
    @include ta(left);
    @include mg(0,0,0,1rem);
  }

  .item-time {
    @include sc(0.7rem, #5a5a5a, nomal);
    @include ta(right);
    @include mg(0,1rem,0,0)
  }

</style>
