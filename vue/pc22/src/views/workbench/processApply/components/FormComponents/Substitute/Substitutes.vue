<template>
    <div>
        <!-- 调班申请的选人 -->
        <el-input @click.native="changeDialog" v-model="value" readonly>
        </el-input>
        <SelectUsersDialog
            :visible.sync="SubstituteShowDialog"
            :data="datas"
            :users="users"
            model="user"
            :multiple="false"
            placeholder="请选择人员"
            @confirm="SubstituteGetDatas"
        ></SelectUsersDialog>
    </div>
</template>
<script>
export default {
    name: "Substitute",
    data() {
        return {
            datas: [],
            users: [],
            SubstituteShowDialog: false,
        };
    },
    props: {
        value: {
            type: String,
            default: "",
        },
    },
    methods: {
        changeDialog() {
            this.SubstituteShowDialog = true;
        },
        // 改变值
        SubstituteGetDatas(e, close) {
            this.$emit("input", e.user_name);
            close();
        },
    },
};
</script>

<style scoped lang="scss"></style>
