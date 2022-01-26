
    <template>
  <div>
    <el-breadcrumb separator="/">
      <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in rootState.bread"
        :key="index"
        :to="{ path: item.path }"
      >{{ item.name}}</el-breadcrumb-item>  </transition-group>
    </el-breadcrumb>
  
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Navbar2Index",
  data() {
    return {};
  },
  watch: {
    // $route(to, from) {
    //   let arr = [];
    //   to.matched.forEach((v, k, a) => {
    //     let obj = {
    //       id: this.rootState.bread.length,
    //       name: v.meta.title,
    //       paht: v.meta.path
    //     };
    //     arr.push(obj);
    //   });
    //   this.$store.commit("PUSH_BREAD", arr);
    // }

    // const toDepth = to.path.split('/').length
    // const fromDepth = from.path.split('/').length
    // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  },
  computed: {
    ...mapState({
      rootState: state => state
    })
  },
  methods: {}
};
</script>
<style>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}



</style>