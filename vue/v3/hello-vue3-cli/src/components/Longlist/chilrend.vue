<template>
    <div>
        'todoValu'
{{ todoValue}}
    </div>
</template>

<script>
export default {
  props: {
    todoValue: {
      type: String,
      default:'',
    },
  },
    setup (props) {
        // eslint-disable-next-line vue/no-mutating-props
        console.log(props.todoValue= props.todoValue+1)

        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>