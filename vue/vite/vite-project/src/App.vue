
<template>
  <HelloWorld
    msg="Hello Vue 3 + TypeScript + Vite"
    autocomplete
    xm
    v-model="optionsVlue"
  >
  </HelloWorld>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref, reactive } from "vue";

const optionsVlue = reactive([
  {
    key: "selectInput",
    title: "更多条件",
    type: "selectInput",
    options: [
      {
        value: "Option1",
        label: "Option1",
      },
      {
        value: "Option2",
        label: "Option2",
      },
      {
        value: "Option3",
        label: "Option3",
      },
      {
        value: "Option4",
        label: "Option4",
      },
      {
        value: "Option5",
        label: "Option5",
      },
    ],
    value: "",
  },
  {
    key: "input",
    title: "用户名",
    type: "input",
    value: "1",
  },
]);
</script>
