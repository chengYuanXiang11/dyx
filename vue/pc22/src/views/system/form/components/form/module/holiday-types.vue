<template>
    <el-select
        v-model="leaveType"
        placeholder="请选择假期类型"
        @change="selectChange"
        :disabled="disabled"
    >
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.value"
            :value="item.value"
        >
        </el-option>
    </el-select>
</template>

<script>
import { getList } from "@/request/api/personnel/checking/holiday";
export default {
    name: "holiday-types",
    data() {
        return {
            leaveType: this.value,
            options: [],
        };
    },
    props: {
        value: {
            type: String | Number,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        value(newVal) {
            this.leaveType = newVal;
        },
    },
    methods: {
        selectChange(e) {
            this.$emit("input", e);
        },
        getList() {
            getList({
                pageNum: "all",
            }).then((res) => {
                this.options = res.data.map((value, i) => ({
                    value: value.vacation_name,
                    id: value.id,
                }));
            });
        },
    },
    created() {
        this.getList();
    },
};
</script>
