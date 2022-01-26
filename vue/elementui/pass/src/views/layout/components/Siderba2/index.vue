<template >
    <ScrollBar></ScrollBar>

</template>
<script>
import {mapGetters, mapState} from 'vuex'
import ScrollBar from './SIdebar'
import SidebarItem from "./SidebarItem";
export default {
  // components: {SidebarItem, ScrollBar},
  components: { SidebarItem,ScrollBar },
   computed: {
    ...mapState({
      rootState: state => state
    })
  }  // computed: {
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
<style >
[v-cloak] {
  display: none !important;
}
html,body{
  height: 100%;
}
</style>
