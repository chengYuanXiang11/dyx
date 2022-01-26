<template>
 <!-- v-show="closed" -->
  <transition name="el-message-fade"  @after-leave="handleAfterLeave">
    <div v-show="visible">
      <div class="hello">{{ message }}{{ id }}</div>
      <button @click="handleAfterLeave">去除弹窗</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MessageCom',
  data() {
    return {
      instances: []
    }
  },
  props:{
    visible:{
      type:Boolean,
    }
  },
  created() {
    console.log(this.props)
  },
  mounted() {
    // setTimeout(() => {
      // this.visible = false;
    // }, 3000)
  },
  methods: {
    handleAfterLeave() {
      console.log('触发删除')
      this.visible = false
      // this.$destroy(true);
      // this.$el.parentNode.removeChild(this.$el);
    },
  }
  // this.$message.info({ visible: false,
  //     message: '',
  //     duration: 3000,
  //     type: 'info',
  //     iconClass: '',
  //     customClass: '',
  //     onClose: null,
  //     showClose: false,
  //     closed: false,
  //     verticalOffset: 20,
  //     timer: null,
  //     dangerouslyUseHTMLString: false,
  //     center: false})
}
</script>

<style scoped>
.hello {
  position: fixed;
  top: 20px;
  left: 50%;
  padding: 20px;
  background: greenyellow;
  transform: translateX(-50%);
}
</style>
