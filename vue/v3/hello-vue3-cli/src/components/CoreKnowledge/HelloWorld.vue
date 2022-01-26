<template>
  <comp></comp>
  {{ inputValue }}
  <input
    type="text"
    v-model.lazy.trim="inputValue"
    style="width: 200px; height: 20px"
  />

  <button @click="clickLoading()">加载</button>
  <div class="hello">姓名:{{ zsname }}{{ age }}岁了</div>
  <button @click="sayHello()">启动传送门(teleport)</button>
  <teleport to="body">
    <div v-if="modeshow" class="modal" @click="modeshow = false">
      {{ respositorAge }}

      <!-- v-model 父子双向绑定 -->
      <Headercustom
        @my-event="sayHello2"
        ref="sonRef"
        v-model="age"
        :title="loading"
        v-model:modeshowLoading="modeshow"
      >
        <!-- 具名插槽 -->
        <!-- //dataItem重命名  子组件插槽未传递数据时默认数据  -->
        <template #footer2="{ dataItem: doit = ['243255325'] }">
          <h3 :style="{ position: 'fixed', top: '0px', left: '0px' }">
            {{ doit }}
          </h3>
          'doit'
        </template>
      </Headercustom>
    </div>
    <div></div>
  </teleport>
  <div>
    {{ refValue }}
    {{ refValue2.name }}
    {{ names }}
    age:{{ age }}
  </div>
  <div v-show="loading">加载中....</div>
  <!-- 渲染函数 -->
  <RenderTest v-model:counter="age">
    默认插槽
    <template v-slot:content>content具名插槽</template>
  </RenderTest>
  <!-- 异步组件 -->
  <!-- <AsyncCom ></AsyncCom> -->
  <!-- 动态组件 -->
  <component :is="AssemblyName"></component>
  修改动态组件的值
</template>

<script>
import { useRouter, useRoute } from "vue-router";
// import { h } from 'vue'
import {
  ref,
  reactive,
  onMounted,
  provide,
  toRefs,
  onBeforeUnmount,
  watch,
  watchEffect,
  h,
  defineAsyncComponent,
  readonly,
} from "vue";
import useAge from "./age.ts";
import useComputed from "./computedAge.ts";
import useLoading from "./loading.ts";
import Headercustom from "./headerContent/headerContent.vue";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  // mixins: [Headercustom],
  components: {
    Headercustom,
    //vue3渲染函数
    RenderTest: {
      props: {
        counter: {
          type: String,
          default: "0",
        },
      },
      render() {
        // 默认插槽
        // this.$slots.default()
        // 具名插槽
        // this.$slots.content()
        //保存内部emit
        const emit = this.$emit;
        const counter = this.counter;
        return h("div", [
          h(
            "div",
            {
              onClick() {
                emit("update:counter", Number(counter) + 1);
              },
            },
            `I an RenderTest:${counter}`,
            this.$slots.default(),
            this.$slots.content()
          ),
        ]);
      },
    },
    // 异步组件
    AsyncCom: defineAsyncComponent({
      loader: () => import("./AsyncNext/AsyncNext.vue"),
      delay: 2000,
      timeout: 3000,
    }),
  },
  setup() {
    const sonRef = ref();
    const router = useRouter();
    const route = useRoute();
    console.log(router, route);
    //name,age处理监听
    let { name, age, sayHello, modeshow } = useAge();

    //commpued
    const { respositorAge } = useComputed(age);
    const { loading, setLoading } = useLoading();
    const refValue = ref(1);
    const refValue2 = ref({ name: "ref", age: "1" });
    const reacrtiveValue2 = reactive({ names: "reactive", age: "10" });
    //添加路由
    router.addRoute({
      path: "/:pathMatch(.*)*",
      name: "not-found",
      redirect: "/",
    });
    //添加子路由
    router.addRoute("not-found", {
      path: "settings",
      redirect: "/",
      name: "nodeChild",
    });

    router.removeRoute("nodeChild");
    //  router.replace(router.currentRoute.value.fullPath)
    onMounted(weSet);
    let timer = null;
    watchEffect(() => {
      console.log(refValue, refValue2, reacrtiveValue2);
    });

    function weSet() {
      timer = setTimeout(() => {
        ++refValue.value;
        reacrtiveValue2.name += 1;
        refValue2.value.name += refValue.value;
      }, 2000);

      //vue获取dom元素使用ref，类似于react dom节点绑定ref='xxx' setup返回ref,onMounted之后才会有节点数据
      console.log(sonRef.value);
      //10s后停止监听，停止定时器
      // setTimeout(() => {
      //    clearInterval(timer);
      //    stopWatch()
      // }, 10000);
    }

    function clickLoading() {
      setLoading();
      setTimeout(() => {
        setLoading();
      }, 2000);
    }
    const items = ["Feed a cat", "Buy milk"];
    const stopWatch = watch(
      // 多值监听，监听复杂数据时应开启deep深度监听
      [
        () => refValue.value,
        () => refValue2.value.name,
        () => reacrtiveValue2.names,
      ],
      (newValue, oldValue) => {
        console.log(newValue, oldValue);
      },
      {
        deep: true,
      }
    );
    onBeforeUnmount(() => {
      clearTimeout(timer);
      stopWatch();
    });
    const sayHello2 = (a, b) => {
      console.log(a, b);
    };
    let inputValue = ref("");
    let AssemblyName = "AsyncCom";
    const providValue = ref("只读provide依赖注入");
    const providValue2 = reactive({
      longitude: 90,
      latitude: 135,
    });
    provide("location", providValue);
    // provide('geolocation',providValue2)
    // 只读provide
    provide("geolocation", readonly(providValue2));
    return {
      zsname: name, //修改命名name改为zsname
      age,
      sayHello,
      respositorAge,
      modeshow,
      sayHello2,
      refValue,
      refValue2,
      ...toRefs(reacrtiveValue2), //同名变量后面会替换前面的
      loading,
      setLoading,
      clickLoading,
      items,
      inputValue,
      AssemblyName,
      sonRef,
    };

    //或者返回一个渲染函数(会替换掉模版中的内容)
    // return()=>{
    //   //h为渲染函数
    //   return h('h1','2424')
    // }
  },
  beforeRouteEnter() {
    console.log("beforeRouteEnter");
    return true || undefined;
  },
  beforeRouteUpdate() {
    console.log("beforeRouteUpdate");
    return true || undefined;
  },
  beforeRouteLeave() {
    console.log("beforeRouteLeave");
    return true || undefined;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.modal {
  transform: translate(20%, 20%);
  background-color: azure;
}
</style>


