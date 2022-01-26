import { onMounted, ref, watch, } from 'vue'

export default function useAge(){
    const name = ref('zs');
    const age = ref(18);
    const modeshow = ref(true)

    const sayHello=()=>{
      ++(age.value);
      modeshow.value = !modeshow.value
      console.log(age.value)
    }
    onMounted(sayHello)
    watch(age,(newValue,oldValue)=>{
        console.log(newValue,oldValue)
      })
      return{
        name,
        age,
        sayHello,
        modeshow 
      }
}