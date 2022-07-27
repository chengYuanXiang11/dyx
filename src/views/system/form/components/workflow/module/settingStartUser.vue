<template>
    <div>
        <!-- 设置发起人 -->
        <el-drawer
            :append-to-body="true"
            title="设置发起人"
            :visible.sync="showDrawer"
            direction="rtl"
            class="set_promoter"
            size="550px"
            @close="closeDialog"
        >
            <div class="drawer-main">
                <div class="drawer-form">
                    <el-form label-width="100px">
                        <el-form-item label="已选择">
                            <p>{{ form.content }}</p>
                        </el-form-item>
                        <el-form-item label="发起人类型">
                            <el-radio-group
                                v-model="form.type"
                                @change="userTypeChange"
                            >
                                <el-radio label="1">所有人</el-radio>
                                <el-radio label="2">指定人</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="" v-if="form.type == '2'">
                            <el-button
                                type="primary"
                                @click="openSelectUserDialog"
                                >{{
                                    `${
                                        form.users.length > 0 ? "修改" : "添加"
                                    }发起人`
                                }}</el-button
                            >
                        </el-form-item>
                    </el-form>
                </div>
                <div class="drawer-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="saveStartUser"
                        >确 定</el-button
                    >
                </div>
            </div>
        </el-drawer>
        <SelectUsersDialog
            :visible.sync="selectUserShow"
            model="all"
            :data="userList"
            @confirm="selectUsersConfirm"
        ></SelectUsersDialog>
    </div>
</template>
<script>
export default {
    name: "settingStartUser",
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        // 发起人表单
        datas: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        show(newVal) {
            this.showDrawer = newVal;
        },
        datas(newVal) {
            this.form = newVal;
        },
    },
    data() {
        return {
            showDrawer: this.show,
            form: this.datas,
            selectUserShow: false,
            userList: {
                users:[],
                depts:[]
            },
        };
    },
    methods: {
        closeDialog() {
            this.$emit("update:show", false);
        },
        // 人员列表转文字
        arrToStr(arr) {
            let userList = arr.users.map((user) => {
                return user.user_name;
            });
            let deptList = arr.depts.map((dept) => {
                return dept.deptName;
            });
            let namelist = userList.concat(deptList).join(",");
            return namelist;
        },
        // 显示选人组件
        openSelectUserDialog() {
            this.selectUserShow = true;
            this.userList = this.form.users;
        },
        selectUsersConfirm(e) {
            let users = e.users.concat(e.depts);
            this.form.users = users;
            this.form.content = this.arrToStr(e);
            this.selectUserShow = false;
        },
        userTypeChange(e) {
            this.form.content = e == '1' ? '所有人' : this.arrToStr(this.form.users) ? this.arrToStr(this.form.users) : '请设置发起人'
        },
        saveStartUser(){
            if(this.form.type == '2' && this.form.users.length <= 0){
                this.$toastError("请选择发起人！")
            }
            else{
                let data = this.form;
                data.users = data.type == '1' ? [] : data.users;
                this.$emit('confirm', data);
                this.closeDialog();
            }
        }
    },
};
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
    margin-bottom: 0;
    span {
        font-size: 16px;
        color: #010621;
    }
}
.drawer-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    .drawer-form {
        flex: 1;
        padding: 20px 20px 0;
        overflow-y: auto;
        .conditionForm {
            .el-form-item {
                margin-bottom: 10px;
            }
            .el-select,
            .el-input-number {
                width: 100%;
            }
        }
    }
    .drawer-footer {
        display: flex;
        justify-content: flex-end;
        padding: 20px;
        border-top: solid 1px #ddd;
    }
    .residenceTime {
        display: flex;
        align-items: center;
    }
    .residenceTime .el-input-number {
        width: 150px;
        margin: 0 20px;
    }
}
.select-userAndDept {
    display: flex;
    align-items: center;
    .left-content {
        border: solid 1px #ddd;
        border-right: none;
        flex: 1;
        display: flex;
        align-items: center;
        border-radius: 4px 0 0 4px;
        padding: 0 10px;
        .tags-main {
            flex: 1;
            overflow: hidden;
            height: 38px;
            .el-tag {
                margin-right: 10px;
            }
        }
    }
    .el-button {
        border-radius: 0 4px 4px 0;
        height: 38px;
    }
}
</style>