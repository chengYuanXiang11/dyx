<template>
    <div>
        <!-- 设置抄送人 -->
        <el-drawer
            :append-to-body="true"
            title="设置抄送人"
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
                        <el-form-item label="">
                            <el-button
                                type="primary"
                                @click="openSelectUserDialog"
                                >{{
                                    `${
                                        form.menbers && form.menbers.length > 0 ? "修改" : "添加"
                                    }抄送人`
                                }}</el-button
                            >
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox v-model="form.userOptional"
                                >是否允许发起人自选</el-checkbox
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
            this.userList = this.form.menbers;
        },
        selectUsersConfirm(e) {
            let users = e.users.concat(e.depts);
            this.form.menbers = users;
            this.form.content = this.arrToStr(e) == '' ? '所有人' : this.arrToStr(e);
            this.selectUserShow = false;
        },
        saveStartUser(){
            this.$emit('confirm', this.form);
            this.closeDialog();
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