<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse"
             background-color="#304156" text-color="#fff" active-text-color="#409EFF">
        <router-link to="/home">
          <el-submenu index="/home" id="navHome">
            <template slot="title">
              <span>首页</span>
            </template>
          </el-submenu>
      </router-link>
      <sidebar-item :routes="rootState.menuParent"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>
<script>
  import {mapGetters, mapState} from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    components: {SidebarItem, ScrollBar},
    computed: {
      ...mapState({
        rootState: state=>state
      }),
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
