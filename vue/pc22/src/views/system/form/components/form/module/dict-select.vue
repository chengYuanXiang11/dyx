<template>
    <el-select v-model="dict" :placeholder="placeholder">
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="String(item.id)"
        ></el-option>
    </el-select>
</template>

<script>
export default {
    name: "dict-select",
    data() {
        return {
            dict: this.value,
            options: [],
        };
    },
    props: {
        value: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
        dictCode: {
            type: String,
            default: "",
        },
    },
    watch: {
        value(newVal) {
            this.dict = newVal;
        },
        dict(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        getList() {
            this.getDicts(this.dictCode).then((res) => {
                this.options = res.data;
            });
        },
    },
    created() {
        this.getList();
    },
};
</script>
