<template>
    <!-- 选人弹窗 -->
    <div class="select-main">
        <el-dialog
            title="选择成员"
            :visible.sync="promoterVisible"
            width="900px"
            append-to-body
            @open="openDialog"
            @close="closeDialog"
        >
            <div class="su-main">
                <div class="member-main">
                    <div class="header">
                        <el-input
                            placeholder="请输入姓名、邮箱或手机号"
                            prefix-icon="el-icon-search"
                            v-model="searchName"
                        >
                        </el-input>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item
                                v-for="(o, index) in pathInfo"
                                :key="'crumb' + o.id"
                                class="active"
                                @click.native="
                                    getPerson(index > 0 ? o.id : undefined)
                                "
                                >{{ o.deptName }}</el-breadcrumb-item
                            >
                            <el-breadcrumb-item
                                v-if="Object.keys(currentDept).length > 0"
                                >{{ currentDept.deptName }}</el-breadcrumb-item
                            >
                        </el-breadcrumb>
                        <el-checkbox
                            :indeterminate="indeterminate"
                            v-model="isSelectAll"
                            @change="handleCheckAllChange"
                            v-if="showCheckAll"
                            >全选</el-checkbox
                        >
                    </div>
                    <!-- 选择列表 -->
                    <div class="unselected-list" v-loading="loading">
                        <el-empty
                            description="暂无数据"
                            :image-size="100"
                            v-if="
                                deptList.length <= 0 &&
                                userList.length <= 0 &&
                                !loading
                            "
                        ></el-empty>
                        <template v-else>
                            <el-scrollbar style="height: 100%">
                                <div
                                    class="dept"
                                    v-for="o in deptList"
                                    :key="'dept' + o.id"
                                >
                                    <div class="name">
                                        <el-checkbox
                                            :value="isChecked(o, 'dept')"
                                            @change="select($event, o, 'dept')"
                                            v-if="model != 'user'"
                                            ><svg-icon
                                                class="checkbox"
                                                icon-class="branch"
                                            ></svg-icon>
                                            <span>{{
                                                o.deptName
                                            }}</span></el-checkbox
                                        >
                                        <template v-else>
                                            <svg-icon
                                                icon-class="branch"
                                            ></svg-icon>
                                            <span>{{ o.deptName }}</span>
                                        </template>
                                    </div>
                                    <div
                                        class="lower-level"
                                        :class="{
                                            disable: isChecked(o, 'dept'),
                                        }"
                                        @click="
                                            isChecked(o, 'dept')
                                                ? true
                                                : getPerson(o.id)
                                        "
                                    >
                                        <svg-icon
                                            icon-class="mind-map"
                                        ></svg-icon>
                                        <span>下级</span>
                                    </div>
                                </div>
                                <template v-if="model != 'dept'">
                                    <el-checkbox
                                        :label="item"
                                        v-for="item in userList"
                                        :key="'user' + item.user_id"
                                        :value="isChecked(item, 'user')"
                                        @change="select($event, item, 'user')"
                                        ><i class="avatar">{{
                                            generateName(item.user_name)
                                        }}</i
                                        >{{ item.user_name }}</el-checkbox
                                    ></template
                                >
                            </el-scrollbar>
                        </template>
                    </div>
                </div>
                <!-- 已选列表 -->
                <div class="selected-list">
                    <div
                        class="header"
                        v-if="
                            selectedUsers.length != 0 ||
                            selectedDepts.length != 0
                        "
                    >
                        已选：{{ checkedTitle }}
                    </div>
                    <el-scrollbar style="height: 100%">
                        <ul>
                            <li
                                v-for="user in selectedUsers"
                                :key="'user-select' + user.user_id"
                            >
                                <span class="avatar">{{
                                    generateName(user.user_name)
                                }}</span>
                                <div class="userInfo">
                                    <em>{{ user.user_name }}</em>
                                </div>
                                <i
                                    class="el-icon-close close-btn"
                                    @click="delSelected(user, 'user')"
                                ></i>
                            </li>
                            <li v-for="item in selectedDepts" :key="'dept-select' + item.id">
                                <svg-icon icon-class="branch"></svg-icon>
                                <div class="userInfo">
                                    <em>{{ item.deptName }}</em>
                                </div>
                                <i
                                    class="el-icon-close close-btn"
                                    @click="delSelected(item, 'dept')"
                                ></i>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="promoterVisible = false">取 消</el-button>
                <el-button type="primary" @click="surePromoter"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
    <!-- <el-tooltip
class="item"
effect="dark"
content="上海巴黎屯科技有限公司"
placement="bottom"
:open-delay="300"
transition="el-zoom-in-center"
>
<p>上海巴黎屯科技有限公司</p>
</el-tooltip> -->
</template>

<script>
import { getPerson } from "@/request/api/common";
const clone = (val) => {
    return JSON.parse(JSON.stringify(val));
};
export default {
    name: "SelectUsers",
    data() {
        return {
            promoterVisible: this.visible,
            // promoterVisible: true,
            // 弹窗显示
            searchName: "",
            // 搜索名称
            selectedUsers: [],
            // 选择用户列表
            selectedDepts: [],
            // 选择部门列表
            deptList: [],
            // 部门列表
            userList: [],
            // 用户列表
            pathInfo: [],
            // 部门路径集合
            currentDept: {},
            // 当前部门
            loading: false,
            // 加载状态
        };
    },
    props: {
        model: {
            type: String,
            default: "all",
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        // 数据
        data: {
            type: Object | Array,
        },
        // 是否显示
        visible: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        // checkbox是否选中
        isChecked() {
            return function (item, type) {
                if (type == "user") {
                    if (this.selectedUsers.length <= 0) {
                        return false;
                    } else {
                        let userIndex = this.selectedUsers.findIndex(
                            (arrItem) => arrItem.user_id == item.user_id
                        );
                        return userIndex != -1;
                    }
                } else {
                    if (this.selectedDepts.length <= 0) {
                        return false;
                    } else {
                        let deptIndex = this.selectedDepts.findIndex(
                            (arrItem) => arrItem.id == item.id
                        );
                        return deptIndex != -1;
                    }
                }
            };
        },
        // 全选半选效果
        indeterminate() {
            let num = this.selectNum();
            let totalNum = this.totalNum();
            return num > 0 && num < totalNum;
        },
        // 判断是否全选
        isSelectAll: {
            get() {
                let num = this.selectNum();
                let totalNum = this.totalNum();
                return num == totalNum;
            },
            set(newValue) {
                return newValue;
            },
        },
        // 名称截取
        generateName() {
            return function (name) {
                return name.substring(name.length - 2, name.length);
            };
        },
        // 右侧选择框title
        checkedTitle() {
            let userStr =
                this.selectedUsers.length == 0
                    ? ""
                    : `${this.selectedUsers.length}名用户`;
            let deptStr =
                this.selectedDepts.length == 0
                    ? ""
                    : `${this.selectedDepts.length}个部门`;
            let strArr = [userStr, deptStr];
            strArr = strArr.filter((item) => item != "");
            strArr = strArr.join("，");
            return strArr;
        },
        // 是否显示全选
        showCheckAll() {
            if (this.loading) {
                return false;
            } else {
                if (this.multiple) {
                    if (this.model == "all") {
                        return (
                            this.userList.length > 0 || this.deptList.length > 0
                        );
                    } else if (this.model == "user") {
                        return this.userList.length > 0;
                    } else if (this.model == "dept") {
                        return this.deptList.length > 0;
                    }
                } else {
                    return false;
                }
            }
        },
    },
    methods: {
        // 已选择的数量
        selectNum() {
            let self = this;
            let userNum = 0,
                deptNum = 0;
            self.selectedUsers.forEach((item) => {
                self.userList.forEach((subItem) => {
                    if (item.user_id == subItem.user_id) {
                        userNum++;
                    }
                });
            });
            self.selectedDepts.forEach((item) => {
                self.deptList.forEach((subItem) => {
                    if (item.id == subItem.id) {
                        deptNum++;
                    }
                });
            });
            switch (self.model) {
                case "all":
                    return userNum + deptNum;
                case "user":
                    return userNum;
                case "dept":
                    return deptNum;
            }
        },
        // 部门和人员总数
        totalNum() {
            switch (this.model) {
                case "all":
                    return this.userList.length + this.deptList.length;
                case "user":
                    return this.userList.length;
                case "dept":
                    return this.deptList.length;
            }
        },
        // 确定按钮事件
        surePromoter() {
            let result;
            switch (this.model) {
                case "all":
                    result = {
                        depts: this.selectedDepts,
                        users: this.selectedUsers,
                    };
                    break;
                case "dept":
                    if (this.multiple) {
                        result = this.selectedDepts;
                    } else {
                        result = this.selectedDepts[0]
                            ? this.selectedDepts[0]
                            : {};
                    }
                    break;
                case "user":
                    if (this.multiple) {
                        result = this.selectedUsers;
                    } else {
                        result = this.selectedUsers[0]
                            ? this.selectedUsers[0]
                            : {};
                    }
                    break;
            }
            let closeDialog = () => {
                this.promoterVisible = false;
            }
            this.$emit("confirm", result, closeDialog);
        },
        // 接口获取数据
        getPerson(id) {
            this.loading = true;
            let self = this;
            self.deptList = [];
            self.userList = [];
            getPerson(id)
                .then((res) => {
                    this.$nextTick(() => {
                        self.deptList = res.data.dept;
                        self.userList = res.data.users;
                        self.pathInfo = res.data.pathinfo.reverse();
                        self.currentDept = {};
                        if (res.data.id) {
                            self.currentDept = {
                                id: res.data.id,
                                deptName: res.data.deptName,
                            };
                        }
                    });
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        // checkbox change事件
        select(e, item, type) {
            let selectList =
                type == "user" ? this.selectedUsers : this.selectedDepts;
            let key = type == "user" ? "user_id" : "id";
            let index = selectList.findIndex(
                (arrItem) => arrItem[key] == item[key]
            );
            if (e) {
                if (this.multiple) {
                    type == "user"
                        ? this.selectedUsers.push(item)
                        : this.selectedDepts.push(item);
                } else {
                    this.selectedUsers = [];
                    this.selectedDepts = [];
                    if (type == "user") {
                        this.selectedUsers = [item];
                    } else {
                        this.selectedDepts = [item];
                    }
                }
            } else {
                type == "user"
                    ? this.selectedUsers.splice(index, 1)
                    : this.selectedDepts.splice(index, 1);
            }
        },
        // 删除元素
        delSelected(item, type) {
            let selectList =
                type == "user" ? this.selectedUsers : this.selectedDepts;
            let key = type == "user" ? "user_id" : "id";
            let index = selectList.findIndex(
                (arrItem) => arrItem[key] == item[key]
            );
            type == "user"
                ? this.selectedUsers.splice(index, 1)
                : this.selectedDepts.splice(index, 1);
        },
        // 全选点击事件
        handleCheckAllChange(e) {
            let self = this;
            let selectAllUser = () => {
                self.userList.forEach((item) => {
                    var userIndex = self.selectedUsers.findIndex(
                        (arrItem) => arrItem.user_id == item.user_id
                    );
                    if (e) {
                        if (userIndex == -1) {
                            self.selectedUsers.push(item);
                        }
                    } else {
                        if (userIndex != -1) {
                            self.selectedUsers.splice(userIndex, 1);
                        }
                    }
                });
            };
            let selectAllDept = () => {
                self.deptList.forEach((item) => {
                    var deptIndex = self.selectedDepts.findIndex(
                        (arrItem) => arrItem.id == item.id
                    );
                    if (e) {
                        if (deptIndex == -1) {
                            self.selectedDepts.push(item);
                        }
                    } else {
                        if (deptIndex != -1) {
                            self.selectedDepts.splice(deptIndex, 1);
                        }
                    }
                });
            };
            switch (this.model) {
                case "all":
                    selectAllUser();
                    selectAllDept();
                    break;
                case "user":
                    selectAllUser();
                    break;
                case "dept":
                    selectAllDept();
                    break;
            }
        },
        closeDialog() {
            this.$emit("update:visible", false);
        },
        reset() {
            if (this.model == "all" && !this.multiple) {
                throw new Error("model为all时，multiple必须为true");
            } else {
                if (this.model == "all") {
                    this.selectedUsers = clone(this.data.users);
                    this.selectedDepts = clone(this.data.depts);
                } else {
                    let val = this.multiple
                        ? clone(this.data)
                        : Object.keys(this.data).length == 0
                        ? []
                        : [this.data];
                    this.selectedUsers = [];
                    this.selectedDepts = [];
                    if (this.model == "user") {
                        this.selectedUsers = val;
                    } else if (this.model == "dept") {
                        this.selectedDepts = val;
                    }
                }
            }
        },
        openDialog() {
            this.reset();
            this.getPerson();
        },
    },
    watch: {
        visible() {
            this.promoterVisible = this.visible;
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../../assets/styles/selectDialog.scss';
</style>