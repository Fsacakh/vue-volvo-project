<!--列表的布局-->
<!--add by llf-->
<!--2017/6/20-->

<template>
  <div>
  <div class="table-item">
    <div class="item-left">
      <slot name="title"></slot>
    </div>
    <div class="item-right">
      <slot name="state"></slot>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
  @import "../style/mixin.scss";
  .table-item {
    @include fj(space-between, row, center,center);
  /*@include fj(flex-start, column, stretch,center);*/
    @include wh(100%,3.5rem);
    /*border-bottom: 0.1rem solid #f5f5f5;*/
    border-bottom: 0.01rem solid #e5e5e5;
  }

  /*.item-left {*/
    /*@include sc(1rem, #5a5a5a, nomal);*/
    /*@include ta(left);*/
    /*@include mg(0.5rem,0,0.5rem,1rem);*/
    /*overflow : hidden;*/
    /*text-overflow: ellipsis;*/
    /*display: -webkit-box;*/
    /*-webkit-line-clamp: 1;*/
    /*-webkit-box-orient: vertical;*/
    /*width: 8rem;*/
  /*}*/

  .item-right {
    @include sc(0.8rem, #888, nomal);
    @include ta(right);
    @include mg(0.5rem,1rem,0.5rem,0);
  }


</style>
