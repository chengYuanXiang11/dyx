<template>
    <div class="app-container">
        <el-input v-model="value"></el-input>
    </div>
</template>

<script>
export default {
    name: "To-do",
    data() {
        return {
            value:""
        };
    },
    methods: {
    },
    created() {
        console.log(this.$route)
    },
};
</script>

<style scoped lang="scss">
</style>

