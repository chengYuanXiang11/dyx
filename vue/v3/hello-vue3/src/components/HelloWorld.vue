<template>
  <div>
    <div
    @click.native="setShowJ()"
      v-for="(item, index) in 8"
      :key="index"
      :ref="setItemRef"
      class="a"
      :data-set=" 'data-out' + index"
    >{{item}}</div>
    <div ref="single" v-if="showJ">
      <img :src="imgSrc"  alt="">
    </div>
  </div>
</template>

<script>
import {
  defineProps,
  defineComponent,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  ref,
  reactive,
} from "vue";
import imgSrc from '../assets/logo.png'
import json from '../assets/json/index'
import { shuJu } from "../server/api";
// defineProps({
//   msg: String
// })
export default {
  data() {
    return {
      itemRefs: [],
      showJ:false,
      imgSrc
    };
  },
  setup(props) {
    console.log(json)
    let repositories = [];
    const getUserRepositories = async () => {
      repositories = await shuJu({ uid: "232424" });
      console.log(import.meta.env.VITE_TOKEN)
    };
    getUserRepositories();
    return {
      repositories,
      getUserRepositories, // 返回的函数与方法的行为相同
    };
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el);
      }
    },
    setShowJ(){
      console.log(this.showJ)
      this.showJ = !this.showJ
    }
  },
  beforeUpdate() {
    this.itemRefs = [];
    console.log(this.itemRefs);
  },
  updated() {
    console.log(this.itemRefs);
  },
};
</script>

<style scoped lang="less">
@import url("./hello.module.less");
.a {
  color: @primary-color;
}
</style>
