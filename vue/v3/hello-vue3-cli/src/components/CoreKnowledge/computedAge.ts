import { computed } from "vue"

export default function useComputed(age: { value: any }) {
  const respositorAge = computed(() => {
    return age.value
  })
  return {
    respositorAge
  }
}