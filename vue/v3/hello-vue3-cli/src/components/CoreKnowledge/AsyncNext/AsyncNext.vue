<template>
  this is next Async
  <div @click="userPro">
    {{ userLocation }}
    {{ userGeolocation }}
  </div>
  <button @click="show = !show">Toggle</button>
  <!--  :duration="{enter:5000,leave:8000}" 进入和离开的时间   mode out-in  in-out-->
  <transition
    name="guoDu"
    :duration="{ enter: 5000, leave: 8000 }"
    mode="out-in"
  >
    <!-- 自定义指令 v-gloablHig-->
    <h3 v-gloablHig="'green'" v-show="show">自定义指令</h3>
  </transition>

  -----列表过度-----
  <transition-group name="guoDu">
    <span v-for="(item, index) in itemValue" :key="index">
      {{ item }}
    </span>
  </transition-group>
  <button @click="addValue">add</button>
  <button @click="removeValue">remove</button>

  -----事件派发和监听-----
  <button @click="sendMitt">事件派发mitt</button>
</template>

<script>
import { ref, inject, reactive } from 'vue'
//事件派发和监听(mitt为vue官方推荐)
import mitt from 'mitt'
export const emitter = mitt()
export default {
  setup() {
    const userLocation = inject('location')
    const userGeolocation = inject('geolocation')
    const userPro = () => {
      userGeolocation.longitude += 1
    }
    const item = reactive([1, 2, 3, 4])
    const show = ref(true)
    let itemNumber = 4
    const addValue = () => {
      item.unshift(itemNumber + 1)
      itemNumber += 1
    }
    const removeValue = () => {
      item.splice(Math.floor(Math.random() * item.length), 1)
    }
    const sendMitt = () => {
      emitter.emit('someEvent', 'mitt派发出的值')
    }
    return {
      userLocation,
      userGeolocation,
      userPro,
      show,
      itemValue: item,
      addValue,
      removeValue,
      sendMitt,
    }
  },
}
</script>

<style>
/* .guoDu-enter-active {
 animation: bounce-in 0.5s;
}
.guoDu-leave-active {
  animation: bounce-in 0.5s reverse;
}
 @keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
} */
/* enter 0-1
    leave 1-0
  /* transition: opacity 0.5s ease; */

.guoDu-enter-active,
.guoDu-leave-active {
  transition: opacity 1.5s ease;
}
.guoDu-enter-from,
.guoDu-leave-to {
  opacity: 0;
}
/* 针对移动过渡 */
.guDu-move {
  transition: all 0.8s ease;
}
</style>