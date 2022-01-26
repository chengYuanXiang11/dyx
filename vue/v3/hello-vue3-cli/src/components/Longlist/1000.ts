import { ref, reactive, computed, onMounted } from 'vue'

export function user10000() {
    //存在问题，滑动时会强制5个满，可通过%scrollTop查到高度不固定(也就是高度不固定-)
    const start = ref(0);
    const end = ref(0);
    const length = ref(5);
    const top = ref(0);
    const myRef = ref(null)
    onMounted(() => {
        start.value = Math.floor(myRef.value.scrollTop / 100)
        end.value += start.value + length.value;
    })
    const arr = reactive(Array.from(Array(10000).keys()));

    const data = computed(() => {
        return arr.slice(start.value, end.value)
    })
    const scrollEvent = () => {
            top.value = myRef.value.scrollTop;
            // let scrollTop = this.$refs.list.scrollTop;
            // myers.startOffset = 100*end.value;
            start.value = Math.floor( myRef.value.scrollTop / 100)
            end.value = start.value + length.value;
    }
    return {
        myRef,
        data,
        scrollEvent,
        top
    }
}

export function debounce(fn: any, time: number | undefined) {
    let timer = null;
    
    return () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            let arg = arguments
            // eslint-disable-next-line prefer-rest-params
            console.log(arguments)
            fn.apply(this,arg)
        }, time);
    }
}