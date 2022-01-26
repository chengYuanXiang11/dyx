import { ref } from 'vue'
export default function useLoading(){
    const loading = ref(false);
    const setLoading = ()=>{
        loading.value = !loading.value
    }
    return{
        loading,
        setLoading
    }
}