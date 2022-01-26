<template>
  <!-- :class="{hideSidebar:!sidebar.opened}" -->
  <div class="app-wrapper">
    <el-container class="dis">
      <transition name="fade">
        <el-aside
          v-show="atim()"
          class="asideClass asideTarn"
          :style="{height:rootState.clientHeight + 'px',width:rootState.asideMleft+rootState.asideMleftB+'px'}"
        >
          <sidebar2 :style="{height:'100%',width:rootState.asideMleft+rootState.asideMleftB+'px'}"></sidebar2>
        </el-aside>
      </transition>
      <el-container
        class="containerClass containerClass"
        :class="{ml0:!rootState.menushow}"
        :style="{marginLeft:rootState.asideMleft+rootState.asideMleftB + 'px',height:rootState.clientHeight + 'px'}"
      >
        <el-header :style="{height:'auto'}">
          <Navbar2></Navbar2>
        </el-header>

        <el-main :style="{height:rootState.clientHeight-196+ 'px',marginRight:'-20px'}">
          <AppMain2></AppMain2>
        </el-main>

        <el-footer>{{rootState}}</el-footer>
      </el-container>
    </el-container>
    <div :class="{mask:!rootState.isCollapse}" v-show="!rootState.menushow" @click="mask"></div>
  </div>
</template>

<script>
import { Navbar2, Sidebar2, AppMain2 } from "@/views/layout/components/index2";
import { mapState } from "vuex";
export default {
  name: "layout",
  data() {
    return {
      lock: false,
      direction: "ltr"
    };
  },
  components: { AppMain2, Navbar2, Sidebar2 },
  computed: {
    ...mapState({
      rootState: state => state
    })
  },
  mounted() {
    this.lock = true;
  },
  methods: {
    atim() {
      if (this.rootState.clientWidth > 700) {
        return this.rootState.menushow;
      } else {
        return !this.rootState.isCollapse;
      }
    },
    mask() {
      this.$store.commit("MODIFR_ISCOLLAPSE");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
.asideClass {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 0.28s;
  overflow-x: hidden;
  z-index: 1000;
}
/* .asideTarn {
  transition: all 1.5s;;
} */
.containerClass {
  width: 100%;
  transition: width 0.28s;
  margin-left: 2px;
}

.dis {
  overflow: hidden;
}
.ml0 {
  margin-left: 0px !important;
}
.mask {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 99;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>