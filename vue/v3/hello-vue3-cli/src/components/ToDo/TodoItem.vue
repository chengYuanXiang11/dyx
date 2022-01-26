<template>
  <ul>
    <li v-for="todo in state.filterData" :key="todo.id">
      <div v-show="todo.edited" @dblclick="dbClickEdit(todo.id)">
        <input
          type="checkbox"
          v-model="todo.completed"
          @click="setCheck(todo.id)"
        />
        <label :class="{ del: todo.completed }">{{ todo.title }}</label>
        <button @click="removeTodo(todo.id)">X</button>
      </div>
      <!-- v-focus -->

      <input
        v-auto-focus="!todo.edited"
        type="text"
        v-if="!todo.edited"
        :class="{ labaelIput: todo.completed }"
        v-model="todo.title"
        @blur="setEdit(todo.id)"
      />
    </li>
  </ul>
  <button @click="All">所有</button>
  <button @click="Filter">已完成</button>
  <button @click="Reverse">未完成</button>
</template>

<script>
import { toRefs } from '@vue/reactivity'
export default {
  props: {
    state: {
      type: Object,
    },
  },
  directives: {
    'auto-focus': {
      mounted(el, { value }) {
        if (value) {
          el.focus()
        }
      },
    },
    focus: {
      // 指令的定义
      mounted(el) {
        el.focus()
      },
    },
  },

  setup(props, { emit }) {
    const { state } = toRefs(props)
    const { todos } = toRefs(state.value)
      console.log(state)

    const All = () => {
      state.value.condition = 'screenAll'
    }
    const Filter = () => {
      state.value.condition = 'screenFilter'
    }
    const Reverse = () => {
      state.value.condition = 'screenReverse'
    }

    const removeTodo = (index) => {
      todos.value.splice(
        todos.value.findIndex((n) => {
          return n.id === index
        }),
        1
      )
    }
    const setCheck = (index) => {
      const num = todos.value.findIndex((n) => n.id === index)
      todos.value[num].completed = !todos.value[num].completed
      emit('update:state', state.value)
    }
    const setEdit = (index) => {
     const num = todos.value.findIndex((n) => n.id === index)
      todos.value[num].edited = !todos.value[num].edited
    }
    const dbClickEdit = (index) => {
      setEdit(index)
    }

    return {
      ...toRefs(state.value),
      removeTodo,
      setCheck,
      setEdit,
      dbClickEdit,
      All,
      Filter,
      Reverse,
    }
  },
}
</script>

<style>
</style>