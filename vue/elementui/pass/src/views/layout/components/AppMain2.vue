<template v-if="true">
  <section class="app-main">
    <!-- <transition name="sidebarLogoFade"> -->
    <!-- <router-view :key="key"></router-view> -->
    <!-- <keep-alive> -->
    <router-view />
    <!-- </transition> -->
    <!-- </keep-alive> -->
  </section>
</template>

<script>
export default {
  name: "AppMain2",
  data() {
    return {
      loading: false
    };
  },

  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  // mounted(){
  //   this.loading = true;
  // },

};
</script>
<style>
.el-scrollbar__thumb {
  display: none;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: auto;
}
.sidebarLogoFade-enter-active {
  transition: opacity 0.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
