<!-- 定义页面结构 -->
<template>
  <div>
    <h1>Vue案例</h1>
    <!-- 插值表达式：数据绑定 -->
    {{ course }}
    <!-- 指令 -->
    <input type="text" v-model="course" />
    <!-- 事件处理 -->
    <button @click="toPay">去支付</button>
    <button @click="addM">message</button>
  </div>
</template>

<!-- 定义页面脚本 -->
<script>
// import Message from './components/message';
export default {

  data() {
    return {
      course: '微信支付'
    }
  },
  mounted() {
    // Message.add({
    //   visible: true,
    //   message: '全局弹窗Message2',
    //   duration: 1000,
    //   type: 'info',
    //   iconClass: '',
    //   customClass: '',
    //   onClose: null,
    //   showClose: false,
    //   closed: false,
    //   verticalOffset: 20,
    //   timer: null,
    //   dangerouslyUseHTMLString: false,
    //   center: false
    // })
    this.$message.add({
      visible: true,
      message: '全局弹窗Message',
      duration: 1000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false
    })
  },
  methods: {
    toPay() {
      console.log('去支付....')
    },
    addM() {
      this.$message.add({
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        verticalOffset: 20,
        timer: null,
        dangerouslyUseHTMLString: false,
        center: false
      })
    }
  }
}
</script>
