<template>
  <div>
    <el-row class="navber_header">
      <el-col :span="24" class="navber">
        <div @click="modify_aml">
          <img src="../../../../assets/a1.gif" class="image" />
        </div>
        <div class="navberright">
          <div class="bottom clearfix navberrcon">
            <span class="valicenter" @click="modify_aml2">451定额版</span>
            <el-link type="primary">| 更换定额版本</el-link>
            <el-link type="primary">| 导入Excel模板下载</el-link>
            <el-link type="primary">| 导入工程量Excel模板下载</el-link>
            <el-link type="primary">| 退出系统</el-link>
          </div>
          <span class="FR">温馨提示:编制完成后请进入汇总计算页面查看各项费用金额</span>
        </div>
      </el-col>
    </el-row>
    <transition name="bread">
      <Bread v-show="this.$store.state.breadshow"></Bread>
    </transition>
    <Navbar2></Navbar2>
  </div>
</template>
<script>
import Navbar2 from "./Navbar2";
import Bread from "./bread";
export default {
  name: "Navbar2Index",
  components: { Navbar2, Bread },
  data() {
    return {
      currentDate: new Date()
    };
  },
  methods: {
    modify_aml() {
      if (!this.$store.state.isCollapse) {
        this.modify_aml1();
      } else {
        this.modify_aml2();
      }
    },

    async modify_aml1() {
      await this.$store.commit("MODIFR_AML71");
      await this.$store.commit("MODIFR_ISCOLLAPSE");
    },
    async modify_aml2() {
      await this.$store.commit("MODIFR_AML200");
      await this.$store.commit("MODIFR_ISCOLLAPSE");
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
<style>
.navber_header {
  font-size: 14px;
}
.navber {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.FR {
  font-size: 12px;
  color: red;
}
.navberright {
  padding: 14px;
  height: 45px;
  display: flex;
  flex-flow: column;
  align-items: flex-end;
}
.valicenter {
  vertical-align: middle;
}
.el-link--inner {
  margin-left: 5px;
}
.bread-enter-active, .bread-leave-active {
  transition: opacity 1.5s;
}
.bread-enter, .bread-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>