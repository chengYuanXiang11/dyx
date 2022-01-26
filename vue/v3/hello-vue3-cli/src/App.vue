<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <button @click="Value = 'ToDo'">Todo例子</button>
  <button @click="Value = 'HelloWorld'">Vue3改动</button>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <!-- <component :is="Value"></component> -->
  <router-link
    to="/xinMne"
    active-class="{color:'red'}"
    exact-active-class="{color:'#000'}"
    >home</router-link
  >
  <router-link to="/todo">todo</router-link>
  <router-link to="/users/12/userstodo">users</router-link>
  <router-link to="/longlist">Longlist</router-link>

  <h3>router-view defaulet</h3>
  <router-view></router-view>

  <h3 :style="{ color: 'red' }">router-view Left</h3>
  <router-view name="Left"></router-view>
  <AppLink
    to="https://juejin.cn/post/6977648747044044814"
    :style="{ color: 'red' }"
  >
    <template #a> AppLink </template>
  </AppLink>
  <!-- <AppLink to="/tslist">  <template #a>
          AppLink2
        </template></AppLink>
    -->
  <TsCom :title="Value"></TsCom>
</template>

<script  lang="ts">
import { ref } from "@vue/runtime-core";
import AppLink from "./components/AppLink.vue";
import TsCom from "./components/TsCom/TsCom.vue";
// import { ref,defineAsyncComponent } from '@vue/runtime-core'
// import HelloWorld from './components/CoreKnowledge/HelloWorld.vue'
// import {RouteLocationRaw } from 'vue-router'
export default {
  name: "App",
  components: {
    AppLink,
    TsCom,
    // HelloWorld: defineAsyncComponent({
    //   loader:()=>import('./components/CoreKnowledge/HelloWorld.vue')
    // }),
    // ToDo:defineAsyncComponent({
    //   loader:()=>import('./components/ToDo/ToDo.vue')
    // }),
  },
  setup() {
    const Value = ref("ToDo");

    return {
      Value,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  color: #2c3e50;
  margin-top: 60px;
  flex-flow: column;
  align-items: center;
}
</style>
