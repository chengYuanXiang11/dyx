<template>
  params: {{ route.params }} query:{{ route.query }}
  <button @click.exact="toRouter">/users/12</button>
  <button @click="back">back</button>

  <router-view></router-view>
  <!-- <router-view name="Left"></router-view> -->
</template>

<script>
import { watch } from '@vue/runtime-core'
// import { onMounted } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    console.log(router)
    console.log(route)
    const toRouter = () => {
      // 返回路由地址的标准化版本
      console.log(
        router.resolve({
          name: 'users',
          params: { users: ['user', 'once'], id: '1' },
        })
      )
      // router.push('/users/12?id=14')
      // router.push({path:'/users/12'})

      // 此时id14会取代params
      // router.push({path:'/users/14',params:{users:['users'],id:"13"},query:{users:['users'],id:'12324'}})
      // 此时无事原因path和name
      // router.push({name:'users',params:{users:['users'],id:"13"},query:{users:['users'],id:'12324'}})

      router.replace({
        name: 'users',
        params: { users: ['users'], id: '13' },
        query: { users: ['users'], id: '12324' },
      })

      // router.push({name:'users',query:{users:['users'],id:'12'}})
      // 带 hash，结果是 /about#team
      // router.push({ path: '/about', hash: '#team' })
    }
    const back = () => {
      // router.back()
      //如果超出，报错则不执行
      router.go(-1)
    }
    watch([() => route.params], (newValue, oldeValue) => {
      console.log(newValue, oldeValue)
    })
    return {
      router,
      route,
      back,
      toRouter,
    }
  },
}
</script>

<style>
</style>