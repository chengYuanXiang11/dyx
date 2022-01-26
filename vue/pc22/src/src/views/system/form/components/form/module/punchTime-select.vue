<template>
    <el-select v-model="punchTimeVal" placeholder="请原打卡时间">
        <el-option v-for="item in options" :key="item.id" :label="item.text" :value="item.id"></el-option>
    </el-select>
</template>

<script>
// import { getList } from "@/request/api/personnel/checking/holiday";
export default {
    name: "punchTime-select",
    data() {
        return {
            punchTimeVal: this.value,
            options: [
                {
                    id: 1,
                    text:'[早退]2020-20-20早班上班'
                },
                {
                    id: 2,
                    text:'[缺卡]2020-20-20早班下班'
                },
            ],
        };
    },
    props: {
        value: {
            type: String,
            default:"",
        },
    },
    watch: {
        value(newVal) {
            this.punchTimeVal = newVal;
        },
        punchTimeVal(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        // getList() {
        //     getList({
        //         pageNum: "all",
        //     }).then((res) => {
        //         this.options = res.data.map((value, i) => ({
        //             value: value.id,
        //             label: value.vacation_name,
        //         }));
        //     });
        // },
    },
    created() {
        // this.getList();
    },
};
</script>
