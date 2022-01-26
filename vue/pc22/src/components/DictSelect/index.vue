<template>
    <el-select v-model="selectVal" v-bind="$attrs" v-on="$listeners" clearable>
        <el-option v-for="item of stateOption" :key="item.id" :value="item.id" :label="item.label"></el-option>
    </el-select>
</template>

<script>
export default {
    name: "DictSelect",
    data() {
        return {
            stateOption: [],
        };
    },
    props: {
        value: {
            type: String,
            default: "",
        },
        code: {
            type: String,
            default: "",
        },
    },
    computed: {
        selectVal: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    created() {
        this.getDicts(this.code).then((res) => {
            this.stateOption = res.data;
        });
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
</style>
