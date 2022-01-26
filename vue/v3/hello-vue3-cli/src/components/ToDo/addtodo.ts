import { reactive, computed, watch, onBeforeUnmount } from "vue";
interface filterTodo{
  screenFilter(todos:any[]):Array<object>
  screenAll(todos:any):Array<object>
  screenReverse(todos:any[]):Array<object>
}
export function useAddTodo() {
  const filterTodos:filterTodo = {
    screenFilter(todos: any[]) {
      return todos.filter((v) => v.completed === true)
    },
    screenAll(todos: any) {
      return todos
    },
    screenReverse(todos: any[]) {
      return todos.filter((v) => v.completed === false)
    },
  }

  const todoStorage = {
    fetch() {
      //拿
      const data = JSON.parse(localStorage.getItem('ToDos')! ) || []
      return data
    },
    save(todos: { [x: string]: any; }) {
      //存
      localStorage.setItem('ToDos', JSON.stringify(todos))
    },
  }
  const state:any = reactive({
    newTodo: 'newTodo',
    todos: todoStorage.fetch(),
    condition: 'screenAll',
    filterData: computed(() => {
      return filterTodos[state.condition as keyof filterTodo](state.todos)
    }),
  })

  const addTodos = () => {
    const v = state.todos.findIndex((n: { title: any; }) => {
      return n.title === state.newTodo
    })
    //解决重复添加
    v < 0
      ? state.todos.push({
        id: state.todos.length,
        title: state.newTodo,
        completed: false,
        edited: true,
      })
      : ''
  }
  const stopWatch = watch(state.todos, (newValue) => {
    todoStorage.save(newValue);
  });
  onBeforeUnmount(() => {
    stopWatch();
  });
  return {
    addTodos,
    state,
    todoStorage
  }
}