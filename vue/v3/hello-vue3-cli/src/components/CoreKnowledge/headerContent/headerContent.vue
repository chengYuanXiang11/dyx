<template>
  <teleport to="body">
    <div class="modal__mask" v-if="childLoding">
      <div class="modal__main">
        <input
          type="text"
          :value="modelValue"
          placeholder="shuru"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <div class="modal__header">
          <h3 class="modal__title">弹窗标题</h3>
          <span class="modal__close">弹窗标题x</span>
        </div>
        <div class="modal__content">弹窗文本内容</div>
        <div class="modal__footer">
          <!-- v-mode 父子双向绑定 -->
          <button @click="$emit('update:modeshowLoading', !modeshowLoading)">
            <!-- 取消{{title }} -->
          </button>
          <!-- //v2传值 -->
          <button @click="check">{{ age }}{{ str }}确认1</button>
        </div>
      </div>
    </div>
    <!-- 具名插槽 -->
    <slot name="footer2" :dataItem="list"> 23213434 </slot>
  </teleport>
</template>
<script>
import { onMounted, ref } from 'vue'
// import useAge from '../age.ts'
import { emitter } from '../AsyncNext/AsyncNext.vue'
export default {
  name: 'Headercustom',
  // model: {
  //   prop: 'title',
  //   event: 'changeTitle',
  // },
  props: {
    age: {
      type: Number,
      default: 0,
    },
    modeshowLoading: {
      type: Boolean,
      default: true,
    },
    modelModifiers: {
      //使用v-model添加修饰符时候定义
      default: () => ({}),
    },
    modelValue: {
      type: String,
      default: '0',
    },
    title: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    myEvent: (payload) => {
      // 检验只会发出一个警告，不会阻止事件执行
      if (payload == '233') {
        return true
      } else {
        return false
      }
    },
    'update:modeshowLoading': null,
    'update:modelValue': null,
  },

  // v3传值
  setup(props, { emit }) {
    let str = '子组件数据'
    const childLoding = ref(true)
    function check() {
      emit('myEvent', str, props)
    }
    onMounted(() => {
      emitter.on('someEvent', (msg) => {
        console.log(msg, '事件记录')
      })
    })
    let list = [1, 2, 3, 4]
    return {
      str,
      check,
      list,
      childLoding,
    }
  },
}
</script>
<style scoped>
.modal__mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
}
.modal__main {
  display: flex;
  flex-flow: column;
  justify-content: center;
  background-color: aliceblue;
  align-items: center;
  padding: 20px;
}
</style>