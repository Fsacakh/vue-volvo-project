<!-- src/App.vue -->
<template>
  <div id="app">
    <!--登录页的页头-->
    <!--登录页的内容-->
    <!--管理主页的页头-->
    <!--管理主页的左侧菜单-->
    <!--管理主页的内容-->
    <router-view></router-view>
    <!--页脚-->
  </div>
</template>

<script>
  import auth from './auth'
  import store from './vuex/store'

  export default {
    name: 'app',
    data: function () {
      return {
        user: auth.user,
        isMin: false,
        isClick: false
      }
    },
    store,
    mounted: {
    },
    methods: {
      howWidth: function () {
        this.isMin = document.body.clientWidth < 1000
        if (!this.isClick) {
          window.addEventListener('resize', this.howWidth)
        }
      },
      logout: function () {
        auth.logout()
      }
    },
    events: {
    },
    components: {
    }
  }
</script>

<style lang="scss">
  @import "./css/main.scss";
  * {
    margin: 0;
    padding: 0;
  }
</style>
