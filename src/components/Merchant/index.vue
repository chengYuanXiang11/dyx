<template>
    <!-- 经销商(待优化) -->
    <div class="select-main">
        <el-dialog
            title="选择商户范围"
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
                            v-if="model == 'user'"
                            placeholder="请输入姓名、邮箱或手机号"
                            prefix-icon="el-icon-search"
                            v-model="searchName"
                        >
                        </el-input>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item
                                v-for="o in currentDept"
                                :key="'currentDept' + o.index"
                                class="active"
                                @click.native="getCurrentDept"
                                >{{ o.name }}</el-breadcrumb-item
                            >
                            <el-breadcrumb-item></el-breadcrumb-item>
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
                    <div
                        class="unselected-list"
                        v-loading="loading"
                        v-infinite-scroll="load"
                        infinite-scroll-distance="10"
                        :infinite-scroll-disabled="disabled"
                        infinite-scroll-delay="200"
                    >
                        <template v-if="model == 'dept'">
                            <div
                                class="dept"
                                v-for="o in deptList"
                                :key="'dept' + o.id"
                            >
                                <div class="name">
                                    <el-checkbox
                                        :value="isChecked(o)"
                                        @change="select($event, o)"
                                        ><svg-icon
                                            class="checkbox"
                                            icon-class="branch"
                                        ></svg-icon>
                                        <span>{{ o.name }}</span></el-checkbox
                                    >
                                </div>
                                <div
                                    class="lower-level"
                                    :class="{
                                        disable: isChecked(o),
                                    }"
                                    @click="isChecked(o) ? true : getPerson(o)"
                                >
                                    <svg-icon icon-class="mind-map"></svg-icon>
                                    <span>下级</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <el-empty
                                description="暂无数据"
                                :image-size="100"
                                v-if="userList.length <= 0"
                            ></el-empty>

                            <el-checkbox
                                :label="item.storeName"
                                v-for="item in userList"
                                :key="'user' + item.id"
                                :value="isChecked(item)"
                                @change="select($event, item)"
                            >
                                <i class="avatar">
                                    {{ generateName(item.storeName) }}</i
                                >
                                <i>{{ item.storeName }}</i>
                            </el-checkbox>
                            <div class="name" v-if="busy">
                                <i>加载中...</i>
                            </div>
                            <div class="name" v-if="noMore">
                                <i>没有更多了</i>
                            </div>
                        </template>
                        <!-- </el-scrollbar> -->
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
                                v-for="item in selectedDepts"
                                :key="'dept-select' + item.id"
                            >
                                <svg-icon icon-class="branch"></svg-icon>
                                <div class="userInfo">
                                    <em>{{ item.name }}</em>
                                </div>
                                <i
                                    class="el-icon-close close-btn"
                                    @click="delSelected(item, 'dept')"
                                ></i>
                            </li>
                            <li
                                v-for="user in selectedUsers"
                                :key="'user-select' + user.id"
                            >
                                <span class="avatar">{{
                                    generateName(user.storeName)
                                }}</span>
                                <div class="userInfo">
                                    <em>{{ user.storeName }}</em>
                                </div>
                                <i
                                    class="el-icon-close close-btn"
                                    @click="delSelected(user, 'user')"
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
</template>

<script>
// import {
//     getMerchant,
//     getSearchMerchant,
// } from "@/request/api/market/merchantsMgmt/index.js";
import axios from 'axios'
export default {
    name: "SelectUsers",
    data() {
        return {
            // 弹窗显示
            promoterVisible: this.visible,
            // 搜索名称
            searchName: "",
            //实际数据
            valueData: [],
            // 选择用户列表
            selectedUsers: [],
            // 选择商户列表
            selectedDepts: [],
            // 路径集合
            currentDept: [],
            // 当前部门
            loading: false,
            // 加载状态,
            model: "dept",
            // 经销和采购
            deptList: [
                {
                    id: "1",
                    type: "1",
                    label: "经营户",
                    name: "经营户",
                    Info: [],
                },
                {
                    id: "2",
                    type: "2",
                    label: "采购户",
                    name: "采购户",
                    Info: [],
                },
            ],
            // 用户列表
            userList: [],
            // 判断经销商还是采购商
            type: "1",
            // 滚动加载
            busy: false,
            // 总条数
            total: 100,
            //现在加载到多少条，无限滚动支持
            count: 100,
        };
    },
    props: {
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
        // 加载条数
        noMore() {
            if (this.model === "user") {
                return this.count >= this.total;
            } else {
                return false;
            }
        },
        // 是否禁止滚动加载
        disabled() {
            if (this.model === "user") {
                return this.busy || this.noMore;
            } else {
                return true;
            }
        },
        // checkbox是否选中
        isChecked() {
            return function (item) {
                if (this.model === "dept") {
                    if (this.selectedDepts.length <= 0) {
                        return false;
                    } else {
                        let deptIndex = this.selectedDepts.findIndex(
                            (arrItem) => arrItem.id == item.id
                        );
                        return deptIndex != -1;
                    }
                } else {
                    if (this.selectedUsers.length <= 0) {
                        return false;
                    } else {
                        let deptIndex = this.selectedUsers.findIndex(
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
                // console.log(num, totalNum);
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
                if (this.model == "dept") {
                    return this.deptList.length > 0;
                } else {
                    return this.userList.length > 0;
                }
            }
        },
    },
    methods: {
        // 路径
        getCurrentDept() {
            if (this.model == "dept") {
                this.model = "user";
                this.type = "2";
                this.userList = [];
                this.currentDept = [];
            } else {
                this.model = "dept";
                this.type = "1";
                this.userList = [];
                this.currentDept = [];
            }
        },
        // 已选择的数量
        selectNum() {
            let self = this;
            let userNum = 0,
                deptNum = 0;
            self.selectedDepts.forEach((item) => {
                self.deptList.forEach((subItem) => {
                    if (item.id == subItem.id) {
                        deptNum++;
                    }
                });
            });
            self.selectedUsers.forEach((item) => {
                self.userList.forEach((subItem) => {
                    if (item.id == subItem.id) {
                        userNum++;
                    }
                });
            });
            switch (this.model) {
                case "user":
                    return userNum;
                case "dept":
                    return deptNum;
            }
        },
        // 部门和人员总数
        totalNum() {
            switch (this.model) {
                case "user":
                    return this.userList.length;
                case "dept":
                    return this.deptList.length;
            }
        },
        // 确定按钮事件
        surePromoter() {
            let closeDialog = () => {
                this.promoterVisible = false;
            };
            console.log(this.valueData);
            this.$emit("confirm", this.valueData, closeDialog);
        },
        // 接口获取数据
        getPerson(o) {
            // 经销商
            console.log(o)
            this.loading = true;
            if (o.type == 1) {
                axios.get('http://localhost:8081/a.json').then((res) => {
                        this.currentDept = [
                            {
                                name: "经营户",
                            },
                        ];
                        this.userList = res;
                        this.type = o.type;
                        this.model = "user";
                    })
                    .finally((error) => {
                        this.loading = false;
                    });
            } else if (o.type == 2) {
                axios.get('http://localhost:8081/a.json').then((res) => {
                        this.currentDept = [
                            {
                                name: "采购户",
                            },
                        ];
                        this.userList = res;
                        this.type = o.type;
                        this.model = "user";
                    })
                    .finally((error) => {
                        this.loading = false;
                    });

                //采购商
            }
        },
        // 用于回显
        reset() {
            this.data.forEach((v) => {
                if (v.Info[0] === -1) {
                    // 代表选择的时采购户或者经营户
                    this.selectedDepts.push(v);
                    this.valueData.push(v);
                } else if (v.Info.length > 0) {
                    this.selectedUsers = this.selectedUsers.concat(v.Info);
                    let num = this.deptList.filter((v) => v.type === this.type);
                    num[0].Info.concat(v.Info);
                    this.valueData.push(...num);
                }
            });
        },
        openDialog() {
            // 打开初始化
            this.userList = [];
            this.model = "dept";
            this.selectedUsers = [];
            this.selectedDepts = [];
            this.currentDept = [];
            this.valueData = [];
            this.reset();
        },
        // 滚动加载
        load() {
            this.busy = true;
            // getMerchant()
            //     .then((res) => {
            //         this.userList = this.userList.concat(res.data.results);
            //         //
            //     })
            //     .finally((error) => {
            //         this.busy = false;
            //     });
        },
        // 选中添加事件
        select(e, item) {
            // 如果时添加
            if (e) {
                // 如果选中的是商户类
                if (this.model === "dept") {
                    // 修改先选用户再选择经营户时会数据错乱
                    let index = this.valueData.findIndex(
                        (v) => v.id === item.id
                    );
                    if (index >= 0) {
                        this.valueData.splice(index, 1);
                        // 需要删除和组有关的用户
                        // 找出所有需要删除的用户信息
                        let findArr = this.selectedUsers.filter(
                            (v) => v.label === item.label
                        );
                        findArr.forEach((v) => {
                            let num = findArr.findIndex(
                                (v) => v.label === item.label
                            );
                            if (num >= 0) {
                                this.selectedUsers.splice(num, 1);
                            }
                        });
                    }
                    //直接添加进入商户
                    this.selectedDepts.push(item);
                    item.Info = [-1];
                    this.valueData.push(item);
                } else {
                    // 如果选中的是下级,
                    item.label = this.type == "1" ? "经营户" : "采购户";
                    this.selectedUsers.push(item);
                    let index = this.valueData.findIndex(
                        (v) => v.type === this.type
                    );
                    if (index >= 0) {
                        // 代表经销商已存在
                        this.valueData[index].Info.push(item);
                    } else {
                        let num = this.deptList.filter(
                            (v) => v.type === this.type
                        );
                        num[0].Info = [item];
                        this.valueData.push(...num);
                    }
                }
            } else {
                // 如果是删除
                if (this.model === "dept") {
                    let index = this.selectedDepts.findIndex(
                        (v) => v.id == item.id
                    );
                    this.selectedDepts.splice(index, 1);
                    this.valueData.splice(index, 1);
                } else {
                    let index = this.valueData.findIndex(
                        (v) => v.type === this.type
                    );
                    let num = this.selectedUsers.findIndex(
                        (v) => v.type === this.type
                    );
                    this.selectedUsers.splice(num, 1);
                    this.valueData[index].Info.splice(index, 1);
                }
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
            //删除采购
            if (item.Info) {
                console.log(this.type);
                // 表示删除的时采购或者经营
                let index = this.valueData.findIndex((v) => v.id === item.id);
                this.valueData.splice(index, 1);
            } else {
                //表示删除的时采购或者经营下的商户
                let index = this.valueData.findIndex(
                    (v) => v.type === this.type
                );
                let num = this.valueData[index].Info.findIndex(
                    (v) => v.id === item.id
                );
                this.valueData[index].Info.splice(num, 1);
                if (this.valueData[index].Info.length == 0) {
                    this.valueData.splice(index, 1);
                }
            }
        },
        // 全选点击事件
        handleCheckAllChange(e) {
            let self = this;
            let selectAllUser = () => {
                self.userList.forEach((item) => {
                    var userIndex = self.selectedUsers.findIndex(
                        (arrItem) => arrItem.id == item.id
                    );
                    if (e) {
                        if (userIndex == -1) {
                            let index = this.valueData.findIndex(
                                (v) => v.type === this.type
                            );
                            if (index >= 0) {
                                // 代表经销商已存在
                                this.valueData[index].Info.push(item);
                            } else {
                                let num = this.deptList.filter(
                                    (v) => v.type === this.type
                                );
                                num[0].Info = [item];
                                this.valueData.push(...num);
                            }

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
                            item.Info = [-1];
                            self.valueData.push(item);
                        }
                    } else {
                        if (deptIndex != -1) {
                            self.selectedDepts.splice(deptIndex, 1);
                        }
                    }
                });
            };
            if (this.model === "dept") {
                selectAllDept();
            } else {
                selectAllUser();
            }
        },
        closeDialog() {
            this.$emit("update:visible", false);
        },
    },
    watch: {
        visible() {
            this.promoterVisible = this.visible;
        },
        searchName(newV) {
            if (this.model === "user") {
                this.loading = true;
                // // 请求
                // getSearchMerchant(newV)
                //     .then((res) => {
                //         this.userList = this.userList = res.data.results;
                //     })
                //     .finally((error) => {
                //         this.loading = false;
                //     });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "../../assets/style/selectDialog.scss";
.unselected-list {
    overflow-y: auto !important;
    height: 100%;
}
</style>
