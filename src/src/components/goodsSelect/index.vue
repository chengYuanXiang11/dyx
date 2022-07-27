<template>
    <!-- 选商品弹窗 -->
    <div class="select-main">
        <div class="select-box">
            <div class="goods-box">
                <template v-if="value.length > 0">
                    <div class="goods-list">
                        <el-tag v-for="goods in value" :key="goods.id">{{
                            goods.name
                        }}</el-tag>
                    </div>
                    <div class="total-goods">共{{ value.length }}个商品</div>
                </template>
                <div class="placeholder" v-else>请选择商品</div>
            </div>
            <el-button type="primary" @click="showDialog">选择商品</el-button>
        </div>
        <el-dialog
            title="选择商品"
            :visible.sync="selectGoodsDialog"
            width="900px"
            append-to-body
        >
            <div class="su-main">
                <div class="member-main">
                    <div class="header">
                        <el-input
                            placeholder="请输入商品名称"
                            prefix-icon="el-icon-search"
                            v-model="searchName"
                            @keyup.enter.native="getGoods()"
                            clearable
                        >
                        </el-input>
                        <el-breadcrumb separator="/" class="goods">
                            <el-breadcrumb-item
                                v-for="(o, index) in pathInfo"
                                :key="o.id"
                                @click.native="pathClick(o, index)"
                                >{{ o.name }}</el-breadcrumb-item
                            >
                        </el-breadcrumb>
                        <el-checkbox
                            :indeterminate="indeterminate"
                            v-model="isSelectAll"
                            @change="handleCheckAllChange"
                            v-if="goodsList.length > 0"
                            >全选</el-checkbox
                        >
                    </div>
                    <!-- 选择列表 -->
                    <div class="unselected-list" v-loading="loading">
                        <el-empty
                            description="暂无数据"
                            :image-size="100"
                            v-if="goodsList.length <= 0 && !loading"
                        ></el-empty>
                        <template v-else>
                            <el-scrollbar style="height: 100%">
                                <div
                                    class="dept"
                                    v-for="o in goodsList"
                                    :key="o.id"
                                >
                                    <div class="name">
                                        <el-checkbox
                                            :value="isChecked(o)"
                                            @change="select($event, o)"
                                            ><svg-icon
                                                class="checkbox"
                                                icon-class="branch"
                                            ></svg-icon>
                                            <span>{{
                                                o.name
                                            }}</span></el-checkbox
                                        >
                                    </div>
                                    <div
                                        class="lower-level"
                                        :class="{
                                            disable: isChecked(o),
                                        }"
                                        @click="
                                            isChecked(o) ? true : setLevel(o)
                                        "
                                    >
                                        <svg-icon
                                            icon-class="mind-map"
                                        ></svg-icon>
                                        <span>下级</span>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </template>
                    </div>
                </div>
                <!-- 已选列表 -->
                <div class="selected-list">
                    <div class="header" v-if="selectedGoods.length != 0">
                        已选：{{ selectedGoods.length }}个商品
                    </div>
                    <el-scrollbar style="height: 100%">
                        <ul>
                            <li v-for="goods in selectedGoods" :key="goods.id">
                                <svg-icon icon-class="procuring"></svg-icon>
                                <div class="userInfo">
                                    <em>{{ goods.name }}</em>
                                </div>
                                <i
                                    class="el-icon-close close-btn"
                                    @click="delSelected(goods)"
                                ></i>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectGoodsDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getGoods } from "@/request/api/common";
export default {
    name: "SelectGoods",
    data() {
        return {
            selectGoodsDialog: false,
            searchName: "",
            pathInfo: [
                {
                    name: "全部",
                    id: "000000",
                },
            ],
            loading: false,
            goodsList: [],
            selectedGoods: [],
        };
    },
    props: {
        // 数据
        value: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    computed: {
        // checkbox是否选中
        isChecked() {
            return function (item) {
                if (this.selectedGoods.length <= 0) {
                    return false;
                } else {
                    let goodsIndex = this.selectedGoods.findIndex(
                        (arrItem) => arrItem.id == item.id
                    );
                    return goodsIndex != -1;
                }
            };
        },
        // 全选半选效果
        indeterminate() {
            return (
                this.getNums().selectedNum > 0 &&
                this.getNums().selectedNum < this.getNums().total
            );
        },
        // 判断是否全选
        isSelectAll: {
            get() {
                return this.getNums().selectedNum == this.getNums().total;
            },
            set(newValue) {
                return newValue;
            },
        },
    },
    methods: {
        showDialog() {
            this.selectGoodsDialog = true;
            this.selectedGoods = JSON.parse(JSON.stringify(this.value));
        },
        getNums() {
            let selectedNum = 0,
                total = this.goodsList.length;
            this.selectedGoods.forEach((item) => {
                this.goodsList.forEach((subItem) => {
                    if (item.id == subItem.id) {
                        selectedNum++;
                    }
                });
            });
            return {
                selectedNum,
                total,
            };
        },
        // 确定按钮事件
        confirm() {
            let goods = this.selectedGoods.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    categoryId: item.categoryId
                };
            });
            this.$emit("input", goods);
            this.selectGoodsDialog = false;
        },
        // 接口获取数据
        getGoods(id) {
            let data =
                this.searchName == ""
                    ? {
                          fatherId: id ? id : "000000",
                      }
                    : {
                          name: this.searchName,
                      };
            this.loading = true;
            getGoods(data)
                .then((res) => {
                    this.$nextTick(() => {
                        this.goodsList = res.data.results;
                    });
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        // checkbox change事件
        select(e, item) {
            let index = this.selectedGoods.findIndex(
                (arrItem) => arrItem.id == item.id
            );
            if (e) {
                this.selectedGoods.push(item);
            } else {
                this.selectedGoods.splice(index, 1);
            }
        },
        // 删除元素
        delSelected(item) {
            let index = this.selectedGoods.findIndex(
                (arrItem) => arrItem.id == item.id
            );
            this.selectedGoods.splice(index, 1);
        },
        // 全选点击事件
        handleCheckAllChange(e) {
            this.goodsList.forEach((item) => {
                var index = this.selectedGoods.findIndex(
                    (arrItem) => arrItem.id == item.id
                );
                if (e) {
                    if (index == -1) {
                        this.selectedGoods.push(item);
                    }
                } else {
                    if (index != -1) {
                        this.selectedGoods.splice(index, 1);
                    }
                }
            });
        },
        setLevel(row) {
            this.pathInfo.push({
                id: row.categoryId,
                name: row.name,
            });
            this.getGoods(row.categoryId);
        },
        pathClick(item, index) {
            let pathNum = this.pathInfo.length - 1;
            if (index < pathNum) {
                if (index < pathNum) {
                    this.pathInfo.splice(index + 1, pathNum);
                }
                this.getGoods(item.id);
            }
        },
    },
    created() {
        this.getGoods();
    },
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/selectDialog.scss";
::v-deep .goods {
    .el-breadcrumb__item {
        cursor: pointer;
        &:last-child {
            .el-breadcrumb__inner {
                color: #000;
            }
        }
    }
}
.select-box {
    display: flex;
    .goods-box {
        display: flex;
        align-items: center;
        border: solid 1px #ddd;
        flex: 1;
        padding: 0 10px;
        border-radius: 4px 0 0 4px;
        .goods-list {
            flex: 1;
            height: 28px;
            overflow: hidden;
            .el-tag {
                margin-right: 10px;
            }
        }
        .total-goods {
            padding-left: 10px;
            font-size: 12px;
            color: #333;
        }
        .placeholder {
            font-size: 14px;
            color: #c0c4cc;
        }
    }
    .el-button {
        border-radius: 0 4px 4px 0;
    }
}
</style>