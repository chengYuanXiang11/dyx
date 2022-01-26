<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { menuList } from '@/data'
export default {
  name: 'App'
  // mounted() {
  //   // 页面刷新，重新添加路由
  //   this.$store.commit('user/PARENT_ROUTE', menuList)
  // }
}
</script>
