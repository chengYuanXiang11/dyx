<template>
    <el-cascader
        v-model="provinces"
        :options="options"
        clearable
        ref="Provinces"
        :props="{
            value: 'code',
            label: 'name',
        }"
    ></el-cascader>
</template>

<script>
import area from "@/utils/area";
export default {
    name: "Provinces",
    props: {
        value: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    watch: {
        value(newVal) {
            this.provinces = newVal;
        },
        provinces(newVal) {
            this.$emit("input", newVal);
        },
    },
    data() {
        return {
            options: area,
            provinces: this.value,
        };
    },
    methods:{
        getLabels(){
            let labels = this.$refs['Provinces'].getCheckedNodes()[0] ? this.$refs.Provinces.getCheckedNodes()[0].pathLabels : undefined;
            return labels;
        }
    },
    created() {},
};
</script>

<style scoped>
</style>
