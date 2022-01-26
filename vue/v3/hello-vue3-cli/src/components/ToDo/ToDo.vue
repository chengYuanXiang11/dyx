<template>
  {{ state }}
  <AddTodo
    v-model:todo-value="newTodo"
    v-model:todos="todos"
    @keydown.enter="addTodos"
    placeholder="新增今日代办"
    autocomplete="off"
  ></AddTodo>
  <TodoItem v-model:state="state"></TodoItem>
</template>

<script>
import { toRefs } from "@vue/reactivity";
import { defineAsyncComponent } from "@vue/runtime-core";
import { useAddTodo } from "./addtodo.ts";

export default {
  components: {
    AddTodo: defineAsyncComponent(() => import("./AddTodo.vue")),
    TodoItem: defineAsyncComponent(() => import("./TodoItem.vue")),
  },
  directives: {
    "auto-focus": {
      mounted(el, { value }) {
        if (value) {
          el.focus();
        }
      },
    },
    focus: {
      // 指令的定义
      mounted(el) {
        el.focus();
      },
    },
  },
  setup() {
    const { addTodos, state } = useAddTodo();

    return {
      ...toRefs(state),
      state,
      addTodos,
    };
  },
};
</script>

<style>
li {
  list-style: none;
  padding: 10px;
}
li label {
  padding: 0 10px;
  display: inline-block;
  min-width: 50px;
}
.del {
  text-decoration: line-through;
  opacity: 0.5;
}
.labaelIput {
  top: 11px;
  left: 0px;
  z-index: 100;
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>