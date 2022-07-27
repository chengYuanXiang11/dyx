<template>
    <div>
        <!-- 设置审批人 -->
        <el-drawer
            :append-to-body="true"
            title="设置审批人"
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
                        <el-form-item label="审批人类型">
                            <el-radio-group
                                v-model="form.assigneeType"
                                @change="userTypeChange"
                            >
                                <el-radio label="user">指定人</el-radio>
                                <el-radio label="director">上级领导</el-radio>
                                <el-radio label="optional">发起人自选</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="" v-if="form.assigneeType == 'user'">
                            <el-button
                                type="primary"
                                @click="openSelectUserDialog"
                                >{{
                                    `${
                                        form.users.length > 0 ? "修改" : "添加"
                                    }审批人`
                                }}</el-button
                            >
                        </el-form-item>
                        <el-form-item label="审批方式">
                            <el-radio-group v-model="form.counterSign">
                                <el-radio :label="true">会签</el-radio>
                                <el-radio :label="false">或签</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            label="超时提醒"
                        >
                            <div class="residenceTime">
                                <p>滞留时间超过</p>
                                <el-input-number
                                    v-model="form.residenceTime"
                                    controls-position="right"
                                    :min="0"
                                ></el-input-number>
                                <p>小时</p>
                            </div>
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
            this.form.users = e;
            this.form.content = this.arrToStr(e);
            this.selectUserShow = false;
        },
        userTypeChange(e) {
            switch (e) {
                case 'user':
                    this.form.content = this.arrToStr(this.form.users) ? this.arrToStr(this.form.users) : '请设置审批人'
                    break;
                case 'director':
                    this.form.content = "上级领导"
                    break;
                case 'optional':
                    this.form.content = "发起人自选"
                    break;
            }
        },
        saveStartUser(){
            if(this.form.assigneeType == 'user' && this.form.users.length <= 0){
                this.$toastError("请选择审批人！")
            }
            else{
                let data = this.form;
                data.users = data.assigneeType == 'user' ? data.users.users.concat(data.users.depts) : [];
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