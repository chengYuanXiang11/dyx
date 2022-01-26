<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  watch:{ $route(to, from){ } },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  mounted(){
    $(window).resize(()=>{  
      this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", {$}); // 动态设置表格高度
     })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
