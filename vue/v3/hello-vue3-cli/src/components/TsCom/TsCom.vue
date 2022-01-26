<template>
  {{ title }} {{ titleState }} {{ modulea }}
  <button @click="setTitle">setTitle</button>
  <button @click="setTimeTitles">setTimeTitles</button>
  <button @click="setMaTitle">MasetTimeTitles</button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { useStore } from '../../store/index'
import { MODIFY_TITLE } from '../../store/mutation-type'
// export default defineComponent({
// })
const store = useStore()
const setTitle = () => store.commit(MODIFY_TITLE)
console.log(store)
const setMaTitle = () => store.commit('a/setModule')

const props = defineProps({
  title: String
})
const titleState = computed(() => store.state.title)
const modulea = computed(() => store.state.a.modulea)

const emit = defineEmits()
console.log(props.title, emit)
const setTimeTitles = () => store.dispatch('setTimeTitle')
</script>

<style>
</style>