<!--待办事项表头-->
<!--add by llf-->
<!--2017/7/6-->

<template>
  <div class="table-item">
    <div class='item-icon'><slot name='item-icon'></slot></div>
    <div class="item-inner">
      <div class="item-title"><slot name="item-title"></slot></div>
      <div class="date-info">
        <div class="item-left"><slot name="item-second-title"></slot></div>
        <div class="item-right"><slot name="item-time"></slot></div>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
  }
</script>


<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";
  .table-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    height: 3.9rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    /*border-bottom: 1.5px solid rgba(239, 239, 239, 0.8);*/
    border-bottom: 0.01rem solid #e5e5e5;
  }

  .date-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }

  .item-icon {
    /*color: #658cf8;*/
    color: rgba(25, 65, 155, 1);
  }

  .item-title {
    @include sc(0.8rem, #5a5a5a, nomal);
  }

  .item-inner {
    @include sc(0.7rem, #888, nomal);
    text-align: left;
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
    flex-basis: 100%;
  }

</style>
