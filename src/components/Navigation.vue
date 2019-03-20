<template>
  <li id="item-template" @click="selectItem(models.item)">
    <!--<router-link :to="models.link">-->
   <div v-on:click="goToLink(models)">
      <div @click="toggle(models)" :class="{ 'is-selected': this.$parent.selectedItem === models.item }">
        <Icon :name='models.name'></Icon>
        <div class="item-text">{{models.item}}</div>
        <div class="caret-area" v-if="isFolder">
          <Icon v-show="open" name="chevron-up" class="caret"></Icon>
          <Icon v-show="!open" name="chevron-down" class="caret"></Icon>
        </div>
      </div>
   </div>
    <!--</router-link>-->
    <ul v-show="open" v-if="isFolder" class="border">
      <item
        class="item"
        v-for="model in models.children"
        v-on:selectItem="receiveItem"
        :models="model">
      </item>
    </ul>
  </li>
</template>

<script>
  import * as Icon from 'vue-awesome'
  import router from '../router'

  export default {
    name: 'item',
    template: '#item-template',
    components: {
      Icon
    },
    props: {
      models: Object
    },
    data: function () {
      return {
        open: false,
        selectedItem: ''
      }
    },
    computed: {
      isFolder: function () {
        return this.models.children &&
          this.models.children.length
      }
    },
    methods: {
      toggle: function (item) {
        if (item.children && item.children.length) {
          this.open = !this.open
        }
      },
      selectItem: function (item) {
//        console.log(item)
        event.stopPropagation()
        this.$emit('selectItem', item)
      },
      receiveItem: function (data) {
//        console.log(data)
        this.selectedItem = data
      },
      goToLink: function (models) {
        if (models.item === '退出登录') {
          window.localStorage.clear()
        }
//        console.log(models.link)
        if (models.link && (this.$localStorage.get('type') === '0' || this.$localStorage.get('type') === '1' || this.$localStorage.get('type') === '2')) {
          if(this.isJson(models.link)) {
            router.push(JSON.parse(models.link))
          } else {
            if(this.$localStorage.get('type') === '0') {
               router.push(models.link + '/dealer')
            } else {
               router.push(models.link)
            }
          }
        } else if (models.link) {
          router.push(models.link)
        } else {

        }
      },
      isJson: function (str) {
        if (typeof str == 'string') {
         try {
             JSON.parse(str);
             return true;
         } catch(e) {
             return false;
         }
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../style/mixin.scss";

  .item {
    cursor: pointer;
    @include sc(0.8rem, #7d7d7d);
    background-color: #f6f6f6;
    color: #bbbbbb;
  }

  .border {
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
  }

  ul {
    line-height: 1rem;
    cusor: pointer;
  }

  li {
    list-style-type: none;
    text-align: left;
    @include sc(0.9rem, #7d7d7d);
  }

  a {
    color: #7d7d7d;
    text-decoration: none;
  }

  .fa-icon {
    width: 1rem;
    height: 1rem; /* or any other relative font sizes */
    line-height: 1rem;
    vertical-align: baseline;
    @include mg(1rem, 1rem, 0rem, 1rem)
  }

  .is-selected {
    color: #6a96f8;
  }

  .item .fa-icon {
    width: 0.8rem;
    height: auto; /* or any other relative font sizes */
    line-height: 1rem;
    vertical-align: baseline;
    @include mg(0.8rem, 0.5rem, 0rem, 2rem)
  }

  .caret-area {
    @include display-inline-block;
    float: right;
  }

  .caret {
    margin-left: 0.2rem;
    width: 0.7rem;
    height: auto;
  }

  .item-text {
    @include display-inline-block;
    line-height: 1rem;
  }
</style>
