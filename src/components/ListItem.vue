<!--详情页列表布局-->
<!--add by llf-->
<!--2017/6/22-->

<template>
<div class="table-item">
<div class="list-detail">
  <div class="list-name"><slot name="type-name"></slot></div>
  <div>
    <slot name="type-count"></slot>
  </div>&nbsp;&nbsp;
  <div v-on:click="btnShow" class="toggle-icon-wrapper">
    <Icon :name="toggleBtnClass" class="toggle-icon" scale="2"></Icon>
  </div>
</div>
<ul v-if="open" v-for="item in questions" :data="item" :key="item.id" @click="goItemDetails(item.id)">
  <div class="item-detail">
  <div class="item-name">{{item.question.content}}</div>
  <div class="item-state">{{item.ispass|itemState(item.isinspected)}}</div>
  </div>
</ul>
</div>
</template>


<script>
  import * as Icon from 'vue-awesome'
  import {HTTP} from '../common/http'
  import router from '../router'
  export default {
    name: 'listitem',
    props: {
      models: Object,
      itemOpen: String,
      itemIndex: Number,
      listId: {
        type: Number,
        required: true
      }
    },
    data: function () {
      return {
        open: '',
        openArray: [],
        questions: []
      }
    },
    created: function () {
      this.openArray = this.itemOpen.split(',')
      this.open = this.openArray[this.itemIndex] === '2'
      if (this.open) {
        this.fetchData(this.models.id)
      }
    },
    computed: {
      toggleBtnClass: function () {
        return this.open ? 'angle-up' : 'angle-down'
      }
    },
    methods: {
      btnShow: function () {
        this.open = !this.open
        this.$emit('listItemOpen', this.itemIndex, this.open ? 2 : 1)
        if (this.open) {
          this.fetchData(this.models.id)
        }
      },
      fetchData: function (id) {
        HTTP.get('/plandetail/byplanAndtype/' + this.listId + '/' + id)
          .then(function (response) {
//            console.log(response.data)
            this.questions = response.data.data
          }.bind(this))
          .catch(function (error) {
            console.log(error)
          })
      },
      goItemDetails: function (id) {
        router.push({name: 'Checkstandard', params: {detailId: id}})
      }
    },
    components: {
      Icon,
      HTTP
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../style/mixin.scss";

.table-item{
  @include bgc(#FFFFFF);
}

.list-detail {
  /*<!--@include fj(flex-start, row, stretch,center);-->*/
  @include fj(space-between, row, center,center);
  @include mg(0.5rem,0,0,0);
  height: 3rem;
  border-bottom: 0.01rem solid #e5e5e5;
}

.list-name {
  @include sc(0.9rem, #5a5a5a, nomal);
  @include ta(left);
  @include mg(0,0,0,1rem);
  width: 5.5rem;
}

.list-state {
  @include sc(0.9rem, #5F86F4, nomal);
  /*<!--@include ta(right);-->*/
  /*<!--@include mg(0,-12rem,0,0);-->*/
  @include mg(0,0,0,2rem);
}

.toggle-icon-wrapper {
  @include ta(right);
  @include mg(0,1rem,0,0);
}

.toggle-icon {
  color: #b8bbbf;
}

.item-detail {
  /*<!--@include fj(flex-start, row, stretch,center);-->*/
  @include fj(space-between, row, center,center);
  height: 1.5rem;
  border-bottom: 0.01rem solid #e5e5e5;
  /*width: 80%*/
}

.item-name {
  @include sc(0.8rem, #b8bbbf, nomal);
  @include ta(left);
  width: 9rem;
  @include mg(0,0,0,1rem);
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.item-state {
  @include sc(0.7rem, #5F86F4, nomal);
  @include ta(right);
  @include mg(0,1rem,0,0);
}



</style>
