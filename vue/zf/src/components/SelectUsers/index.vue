<template>
    <!-- 选人弹窗 -->
    <div class="select-main">
        <div class="select-body">
            <div
                class="select-tags-main"
                :class="[size, { disabled,verification }]"
                @click="
                    () => {
                        if (disabled) return false;
                        promoterVisible = true;
                    }
                "
            >
                <div class="placeholder" v-if="total == 0">{{ placeholder }}</div>
                <div class="tags-list" v-else>
                    <el-tag
                        effect="dark"
                        v-for="dept in datas.depts"
                        :key="dept.id"
                    >{{ dept.deptName }}</el-tag>
                    <el-tag v-for="user in datas.users" :key="user.user_id">
                        {{
                            user.user_name
                        }}
                    </el-tag>
                </div>
            </div>
        </div>
        <el-dialog
            title="选择成员"
            :visible.sync="promoterVisible"
            width="900px"
            append-to-body
            @open="openDialog"
        >
            <div class="su-main">
                <div class="member-main">
                    <div class="header">
                        <el-input
                            placeholder="请输入姓名、邮箱或手机号"
                            prefix-icon="el-icon-search"
                            v-model="searchName"
                        ></el-input>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item
                                v-for="(o, index) in pathInfo"
                                :key="'crumb' + o.id"
                                class="active"
                                @click.native="
                                    getPerson(index > 0 ? o.id : undefined)
                                "
                            >{{ o.deptName }}</el-breadcrumb-item>
                            <el-breadcrumb-item
                                v-if="Object.keys(currentDept).length > 0"
                            >{{ currentDept.deptName }}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <el-checkbox
                            :indeterminate="indeterminate"
                            v-model="isSelectAll"
                            @change="handleCheckAllChange"
                            v-if="showCheckAll"
                        >全选</el-checkbox>
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
                                <div class="dept" v-for="o in deptList" :key="'dept' + o.id">
                                    <div class="name">
                                        <el-checkbox
                                            :value="isChecked(o, 'dept')"
                                            @change="select($event, o, 'dept')"
                                            v-if="type != 'user'"
                                        >
                                            <svg-icon class="checkbox" icon-class="branch"></svg-icon>
                                            <span>
                                                {{
                                                    o.deptName
                                                }}
                                            </span>
                                        </el-checkbox>
                                        <template v-else>
                                            <svg-icon icon-class="branch"></svg-icon>
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
                                        <svg-icon icon-class="mind-map"></svg-icon>
                                        <span>下级</span>
                                    </div>
                                </div>
                                <template v-if="type != 'dept'">
                                    <el-checkbox
                                        :label="item"
                                        :disabled="whetherFalse(item)"
                                        v-for="item in userList"
                                        :key="'user' + item.user_id"
                                        :value="isChecked(item, 'user')"
                                        @change="select($event, item, 'user')"
                                    >
                                        <i class="avatar">
                                            {{
                                                generateName(item.user_name)
                                            }}
                                        </i>
                                        {{ item.user_name }}
                                    </el-checkbox>
                                </template>
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
                    >已选：{{ checkedTitle }}</div>
                    <el-scrollbar style="height: 100%">
                        <ul>
                            <li v-for="user in selectedUsers" :key="'user-select' + user.user_id">
                                <span class="avatar">
                                    {{
                                        generateName(user.user_name)
                                    }}
                                </span>
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
                <el-button type="primary" @click="surePromoter">确 定</el-button>
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
    </el-tooltip>-->
</template>

<script>
import { getPerson } from "@/request/api/common";
import { getUserProfile } from "@/request/api/organization/user.js";
import { mapGetters } from "vuex";
export default {
    name: "SelectUsers",
    data() {
        return {
            // promoterVisible: this.visible,
            promoterVisible: false,
            datas: null,
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
            // 加载状态,
            //当前用户
            selfUser: {},
        };
    },
    props: {
        type: {
            type: String,
            default: "all",
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        // 数据
        value: {
            type: Object | Array,
            required: true,
        },
        // 是否限制选中当前用户(false为可以选择,true为不可选中)
        oneself: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: "请选择成员",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        verification: {
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
                    if (this.type == "all") {
                        return (
                            this.userList.length > 0 || this.deptList.length > 0
                        );
                    } else if (this.type == "user") {
                        return this.userList.length > 0;
                    } else if (this.type == "dept") {
                        return this.deptList.length > 0;
                    }
                } else {
                    return false;
                }
            }
        },
        total() {
            return this.datas.users.length + this.datas.depts.length;
        },
        dateType() {
            return {
                type: this.type,
                multiple: this.multiple,
            };
        },
        ...mapGetters(["size"]),
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
            switch (self.type) {
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
            switch (this.type) {
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
            switch (this.type) {
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
            this.$emit("input", result);
            this.promoterVisible = false;
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
            switch (this.type) {
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
        openDialog() {
            this.selectedUsers = this.deepClone(this.datas.users);
            this.selectedDepts = this.deepClone(this.datas.depts);
            this.getPerson();
        },
        // 是否禁止选中
        whetherFalse(item) {
            // 如果开启禁止选中当前用户
            if (this.oneself) {
                if (
                    item.user_id === this.selfUser.user_id &&
                    item.user_name === this.selfUser.user_name
                ) {
                    return true;
                }
            } else {
                return false;
            }
        },
        formatValue(value) {
            let data = {
                users: [],
                depts: [],
            };
            if (this.type == "all") {
                data = value;
            } else {
                console.log(Object.keys(this.value).length)
                let val = this.multiple
                    ? value
                    : Object.keys(value).length == 0
                        ? []
                        : [value];

                if (this.type == "user") {
                    data.users = val;
                } else {
                    data.depts = val;
                }
            }
            return data;
        },
        checkError() {
            if (this.type == "all") {
                if (
                    Object.prototype.toString.call(this.value) !=
                    "[object Object]"
                ) {
                    throw new Error("type为all时，v-model类型必须为对象");
                } else if (
                    Object.keys(this.value).indexOf("users") == -1 ||
                    Object.keys(this.value).indexOf("depts") == -1
                ) {
                    throw new Error(
                        "type为all时，v-model对象必须包含users和depts属性"
                    );
                } else if (!this.multiple) {
                    throw new Error("type为all时，multiple必须为true");
                }
            } else {
                if (
                    !this.multiple &&
                    Object.prototype.toString.call(this.value) !=
                    "[object Object]"
                ) {
                    throw new Error(
                        "type为user或dept且multiple为false时，v-model类型必须为对象"
                    );
                } else if (
                    this.multiple &&
                    Object.prototype.toString.call(this.value) !=
                    "[object Array]"
                ) {
                    throw new Error(
                        "type为user或dept且multiple为true时，v-model类型必须为数组"
                    );
                }
            }
        },
    },
    watch: {
        dateType: {
            handler() {
                this.checkError();
            },
            immediate: true,
        },
        value: {
            handler(val) {
                this.datas = this.formatValue(val);
            },
            immediate: true,
        },
    },
    created() {
        //获取当前用户
        if (this.oneself) {
            getUserProfile().then((res) => {
                this.selfUser = {
                    user_id: res.data.id,
                    user_name: res.data.username,
                };
            });
        }
    },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/selectDialog.scss";
.select-body {
    display: flex;
    .select-tags-main {
        border: solid 1px #e4e7ed;
        border-radius: 4px;
        display: flex;
        align-items: center;
        flex: 1;
        padding: 0 12px;
        cursor: text;
        &.disabled {
            background-color: #f5f7fa;
            border-color: #e4e7ed;
            color: #c0c4cc;
            cursor: not-allowed;
        }
        &.disabled:hover {
            border-color: #e4e7ed;
        }
        &.default {
            min-height: 44px;
        }
        &.medium {
            min-height: 38px;
        }
        &.small {
            min-height: 34px;
        }
        &.mini {
            min-height: 30px;
        }
        &:hover {
            border-color: var(--default-color);
        }
        .placeholder {
            color: #c0c4cc;
            font-size: 14px;
        }
        .tags-list {
            flex: 1;
            height: 100%;
            overflow: hidden;
            .el-tag {
                margin: 5px 5px 5px 0;
            }
        }
    }
    .el-button {
        border-radius: 0 4px 4px 0;
    }
    .verification {
        border-color: #f56c6c!important;
    }
}
</style>
