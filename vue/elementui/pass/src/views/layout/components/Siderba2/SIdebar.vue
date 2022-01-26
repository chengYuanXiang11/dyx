<template>
  <transition name="sidebarItem">
    <!-- :style="{height: rootState.clientHeight + 'px',width:rootState.asideMleft+20+'px'}" -->

    <el-menu
      :style="{height: rootState.clientHeight+10 + 'px'}"
      :collapse="rootState.isCollapse"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleselect"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <SidebarItem></SidebarItem>
    </el-menu>
  </transition>
</template>
<script>
import { mapGetters, mapState } from "vuex";
// import ScrollBar from '@/components/ScrollBar'
import SidebarItem from "./SidebarItem";
export default {
  // components: {SidebarItem, ScrollBar},
  components: { SidebarItem },
  computed: {
    ...mapState({
      rootState: state => state
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleselect(key, keyPath) {
      if (this.rootState.clientWidth < 700) {
        this.$store.commit("MODIFR_ISCOLLAPSE");
      }
    }
  }

  // computed: {
  //   ...mapState({
  //     rootState: state=>state
  //   }),
  //   ...mapGetters([
  //     'permission_routers',
  //     'sidebar'
  //   ]),
  //   isCollapse() {
  //     return !this.sidebar.opened
  //   }
  // }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
  display: none;
}
/*隐藏 > */
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
.el-menu {
  height: 100%;
}
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>