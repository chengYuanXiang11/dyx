<template>
    <el-select
        v-model="leaveType"
        placeholder="请选择假期类型"
        @change="selectChange"
    >
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item"
        >
        </el-option>
    </el-select>
</template>

<script>
import { getList } from "@/request/api/personnel/checking/holiday";
export default {
    name: "leaveTypeSelect",
    data() {
        return {
            leaveType: this.value,
            options:[]
        };
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        value(newVal) {
            this.leaveType = newVal;
        },
        leaveType(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        selectChange(e){
            // console.log(e)
        },
        getList() {
            getList({
                pageNum: "all",
            }).then((res) => {
                this.options = res.data.map((value, i) => ({
                    value: value.id,
                    label: value.vacation_name,
                }));
            });
        },
    },
    created() {
        this.getList();
    },
};
</script>
<style lang="scss" scoped>
.area-select{
    display: flex;
    justify-content: space-between;
    min-width: 300px;
    .el-select{
        width: 30%;
    }
}
</style>