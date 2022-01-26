<template>
    <div>
        <!-- 调班申请的选人组件 input点击后打开选人,结果返回给input -->
        <slot name="substitute"> </slot>
        <SelectUsersDialog
            :visible.sync="Dialog"
            :data="datas"
            :users="users"
            model="user"
            :multiple="multiple"
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
            SubstituteUsers: [],
        };
    },
    computed: {
        Dialog: {
            get() {
                return this.SubstituteShowDialog;
            },
            set(value) {
                this.$emit("update:SubstituteShowDialog", value);
            },
        },
        dataValue: {
            set(value) {
                this.$emit("update:SubstituteData", value);
            },
            get() {
                return this.SubstituteData;
            },
        },
    },
    props: {
        SubstituteShowDialog: {
            type: Boolean,
            default: false,
        },
        SubstituteData: {
            type: Object,
            default: () => {},
        },
        type: {
            type: String,
            default: "",
        },
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        // 改变值
        SubstituteGetDatas(e, close) {
            this.$emit("diaobanNameChange");
            this.dataValue = e;
            this.Dialog = false;
            console.log(this.type);
            this.$emit("setValue", this.type, e.user_name);
            close();
        },
    },
};
</script>

<style scoped lang="scss"></style>
