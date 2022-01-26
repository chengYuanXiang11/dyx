<template>
  虚拟列表
  <children v-model:todo-value="a"></children>
  {{ a }}
  {{ b }}
  {{ c }}
  <div class="warrpDiv" ref="myRef" @scroll="add()">
    <div class="war" :style="{ height: 100000 + 'px' }"></div>
    <div class="warrp" :style="{ top: top + 'px' }">
      <div v-for="(item, index) in arr" :key="index" class="liDiv">
        <img
          src="../../../../../../js/ce/images/IMG_20200206_215014.jpeg"
          alt=""
        />
        <p>{{ item }}</p>
        <input type="text" />
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { defineAsyncComponent, onMounted } from "@vue/runtime-core";
import { debounce, user10000 } from "./1000.ts";
import { ref, reactive } from "vue";
import _ from 'lodash'
export default {
  components: {
    children: defineAsyncComponent(() => import("./chilrend")),
  },
  setup() {
    const { top, data, scrollEvent, myRef } = user10000();
    const a = ref(1);
    const b = ref({ a: 2 });
    let c = reactive(3);
    a.value++;
    b.value.a++;
    c++;
    onMounted(() => {
      console.log(myRef.value);
    });
    console.log(data.value);
    const add =
      // debounce(scrollEvent(event, myRef), 2000);
      _.throttle(scrollEvent,460);
  
  
    return {
      arr: data,
      scrollEvent,
      myRef,
      a,
      b,
      c,
      top,
      debounce,
      add
    };
  },
};
</script>

<style scoped>
.warrp {
  width: 220px;
  height: 500px;
  overflow: auto;
  position: relative;
}
.liDiv {
  height: 100px;
}
img {
  width: 100%;
  height: 50px;
}
.warrpDiv {
  position: relative;
  width: 200px;
  overflow-x: hidden;
}
.war {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
</style>