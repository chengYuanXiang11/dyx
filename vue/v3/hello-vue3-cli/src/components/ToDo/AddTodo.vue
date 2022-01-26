<template>
  <input
    type="text"
    :value="todoValue"
    autofocus
    @input="$emit('update:todoValue', $event.target.value)"
    v-bind="$attrs"
  />
</template>

<script>
// import {useAddTodo} from './addtodo.ts'
export default {
  props: {
    todoValue: {
      type: String,
      default: '',
    },
    todos: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    // const { todo,todoValu,addTodos } = useAddTodo(props.todos,props.todoValue)
    // const addTodo =()=>{
    //   const newTodos = addTodos()
    //   console.log(newTodos)
    // }
    // const addTodos = () => {
    //   const v = todos.value.findIndex((n) => {
    //     return n.title === todoValue.value
    //   })
    //   //解决重复添加
    //   v < 0
    //     ? todos.value.push({
    //         id: todos.value.length,
    //         title: todoValue.value,
    //         completed: false,
    //         edited: true,
    //       })
    //     : ''
    //   //清除输入框
    //   emit('update:todos', todos.value)
    //   emit('update:todoValue', '')
    //   // console.log(todoValue)
    //   // todoValue = '24'
    // }
     
    return {
    }
  },
}
</script>

<style  scoped>
@import url('./todo.css');
</style>>