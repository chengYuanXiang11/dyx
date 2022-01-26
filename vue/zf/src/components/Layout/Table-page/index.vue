<template>
    <div
        class="table-page"
        :style="{
            background: background,
        }"
        :class="{ 'padding-none': paddingNone }"
    >
        <div class="search" v-if="searchForm.length > 0">
            <el-form
                inline
                :model="formData"
                ref="search-form"
                :label-width="labelWidht"
            >
                <el-form-item
                    :label="item.label"
                    v-for="(item, index) in searchForm.slice(
                        0,
                        isOpen ? searchForm.length : showLimit
                    )"
                    :key="index"
                >
                    <el-date-picker
                        v-model="formData[item.name]"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        v-if="item.type == 'daterange'"
                    ></el-date-picker>
                    <el-date-picker
                        v-model="formData[item.name]"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        v-else-if="item.type == 'date_range'"
                    >
                    </el-date-picker>
                    <el-date-picker
                        v-else-if="item.type == 'datetime'"
                        v-model="formData[item.name]"
                        value-format="yyyy-MM-dd HH:MM:SS"
                        type="datetime"
                        placeholder="选择日期时间"
                    >
                    </el-date-picker>
                    <el-input
                        v-else-if="item.type == 'input'"
                        v-model="formData[item.name]"
                        :placeholder="`请输入${item.label}`"
                        clearable
                    ></el-input>
                    <el-select
                        v-else-if="item.type == 'select'"
                        v-model="formData[item.name]"
                        :placeholder="`请选择${item.label}`"
                        :multiple="item.multiple"
                        clearable
                    >
                        <el-option
                            v-for="(option, idx) in item.options"
                            :key="idx"
                            :value="option.value"
                            :label="option.label"
                        ></el-option>
                    </el-select>
                    <el-cascader
                      v-else-if="item.type == 'cascader'"
                     v-model="formData[item.name]"
                     :options="item.options"
                     :props="item.props"
                     ></el-cascader>
                    <DictSelect
                        v-else-if="item.type == 'dict'"
                        v-model="formData[item.name]"
                        :placeholder="`请选择${item.label}`"
                        :code="item.code"
                        :key="item.code"
                    ></DictSelect>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click="handleSearch"
                        >搜索</el-button
                    >
                    <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        @click="handleReset"
                        >重置</el-button
                    >
                    <el-button
                        v-if="searchForm.length > showLimit"
                        type="text"
                        :icon="`el-icon-arrow-${isOpen ? 'up' : 'down'}`"
                        @click="openSearch"
                        >{{ isOpen ? "收起" : "展开" }}</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="btn-list">
            <slot name="action-bar"></slot>
        </div>
        <div class="table-main">
            <slot></slot>
        </div>
        <div class="paging" v-if="total > 0">
            <el-pagination
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
                :current-page.sync="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: "table-page",
    data() {
        return {
            formData: {},
            isOpen: false,
        };
    },
    props: {
        labelWidht: {
            type: String,
            default: "80px",
        },
        pageSize: {
            type: Number,
            default: 20,
        },
        total: {
            type: Number,
            default: 0,
        },
        pageNum: {
            type: Number | String,
            default: 1,
        },
        searchForm: {
            type: Array,
            default: () => {
                return [];
            },
        },
        showLimit: {
            type: Number,
            default: 3,
        },
        background: {
            type: String,
            default: "#fff",
        },
        paddingNone: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        currentPage: {
            get() {
                return this.pageNum;
            },
            set(val) {
                this.$emit("update:pageNum", val);
            },
        },
        limit: {
            get() {
                return this.pageSize;
            },
            set(val) {
                this.$emit("update:pageSize", val);
            },
        },
    },
    methods: {
        handleSizeChange(val) {
            this.$emit("pagination", {
                pageNum: this.currentPage,
                pageSize: val,
            });
        },
        handleCurrentChange(val) {
            this.$emit("pagination", { pageNum: val, pageSize: this.limit });
        },
        handleSearch() {
            this.$emit("search", this.formData);
        },
        handleReset() {
            this.formData = this.$options.data().formData;
            this.$emit("search", this.formData);
        },
        openSearch() {
            this.isOpen = !this.isOpen;
        }
    },
};
</script>

<style lang="scss" scoped>
.table-page {
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    &.padding-none {
        padding: 0;
    }
    .table-main {
        margin-top: 20px;
        flex: 1;
        overflow-y: auto;
    }
    .paging {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
    }
}
</style>
