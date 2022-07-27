<template>
    <el-select v-model="post" placeholder="请选择职务" clearable>
        <el-option
            v-for="item in postOption"
            :key="item.id"
            :label="item.postName"
            :value="item.id"
        >
        </el-option>
    </el-select>
</template>

<script>
import { listPost } from "@/request/api/organization/post";
export default {
    name: "PostSelect",
    data() {
        return {
            post: this.value,
            postOption:[]
        };
    },
    props:['value'],
    watch: {
        value(newVal) {
            this.post = newVal;
        },
        post(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        init(){
            listPost({
                pageNum:"all"
            }).then((res) => {
                this.postOption = res.data;
            })
        }
    },
    created(){
        this.init();
    }
};
</script>