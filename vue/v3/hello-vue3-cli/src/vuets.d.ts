// import { defineComponent } from 'vue'

// declare module '*.vue' {
//   // vue文件模块声明
//   const Component: ReturnType<typeof defineComponent>
//   export default Component
// }
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.ts'