<template>
    <!--预算表单
         -->
    <div v-loading="loading">
        <el-form :model="tableData" ref="form" v-show="show">
            <el-form-item
                :label="`${choices_in ? '子项名称' : '项目名称'}`"
                prop="name"
                :rules="[
                    { required: true, message: '项目名不能为空' },
                    { validator: validateName, trigger: 'change' },
                ]"
            >
                <el-input
                    v-model="tableData.name"
                    :placeholder="`${
                        choices_in ? '请输入子项名称' : '请输入项目名称'
                    }`"
                ></el-input>
            </el-form-item>
            <el-form-item
                prop="choices_in"
                label="是否可以调入"
                v-if="choices_in"
                width="120"
            >
                <template>
                    <div>
                        <el-switch
                            v-model="tableData.choices_in"
                            active-value="1"
                            inactive-value="2"
                            @change="putBudget($event, tableData, '调入')"
                        >
                        </el-switch>
                    </div>
                </template>
            </el-form-item>
            <el-form-item
                prop="choices_out"
                label="是否可以调出"
                show-overflow-tooltip
                v-if="choices_in"
            >
                <template>
                    <div>
                        <el-switch
                            v-model="tableData.choices_out"
                            active-value="1"
                            inactive-value="2"
                            @change="putBudget($event, tableData, '调出')"
                        >
                        </el-switch>
                    </div>
                </template>
            </el-form-item>
            <el-form-item
                label="付款类型"
                v-show="itemShow"
                prop="apply_detail"
            >
                <el-table
                    ref="multipleTable1"
                    :data="pay_detail"
                    tooltip-effect="dark"
                    @select="
                        (sellect, row) => {
                            handleSelectionChange(sellect, 'pay_detail');
                        }
                    "
                    @select-all="
                        (sellect, row) => {
                            handleSelectionChange(sellect, 'pay_detail');
                        }
                    "
                >
                    <el-table-column type="selection"> </el-table-column>
                    <el-table-column label="付款类型">
                        <template slot-scope="scope">{{
                            scope.row.label
                        }}</template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item
                label="报销类型"
                v-show="itemShow"
                prop="apply_detail"
            >
                <el-table
                    ref="multipleTable2"
                    :data="apply_detail"
                    @select="
                        (sellect, row) => {
                            handleSelectionChange(sellect, 'apply_detail');
                        }
                    "
                    @select-all="
                        (sellect, row) => {
                            handleSelectionChange(sellect, 'apply_detail');
                        }
                    "
                >
                    <el-table-column type="selection"> </el-table-column>
                    <el-table-column label="报销类型">
                        <template slot-scope="scope">{{
                            scope.row.label
                        }}</template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: "addBudget",
    data() {
        return {
            loading: true,
            show: true,
            validateName: (rule, value, callback) => {
                let reg = /^[\u4e00-\u9fa5A-Za-z]+$/;
                if (value.length >= 10) {
                    this.tableData.name = value.substr(0, 10);
                    callback("请确认长度在10个字符之内");
                }
                if (!reg.test(value)) {
                    callback("项目名只能输入中文或者英文");
                }
                callback();
            },
        };
    },
    components: {},
    props: {
        value: {
            type: Object,
            default: () => {},
        },
        // 调入调出是否展示
        choices_in: {
            typeof: Boolean,
            default: false,
        },
        choices_out: {
            typeof: Boolean,
            default: false,
        },
        // 有子项时数据隐藏
        itemShow: {
            type: Boolean,
            default: true,
        },
        // 报销和付款数据
        pay_detail: {
            type: Array,
            default: () => [],
        },
        apply_detail: {
            type: Array,
            default: () => [],
        },

        // 区分编辑还是新增(edit,add)
        type: {
            type: String,
            default: "add",
        },
        // 当前操作的数据id
        id: {
            type: String,
            default: "1",
        },
    },
    computed: {
        tableData: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    watch: {
        pay_detail: {
            handler() {
                this.getList();
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        // 修改数据
        putBudget(value, item, title) {
            // //关闭前先禁止关闭
            if (title === "调入") {
                item.choices_in = "1";
            } else {
                item.choices_out = "1";
            }
            // 取消关联时弹出提示
            if (value == 2) {
                this.$confirm(
                    `<spam>确认关闭吗?</spam><p>关闭后，该项目将不可以${title}</p>`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        dangerouslyUseHTMLString: true,
                    }
                )
                    .then(() => {
                        // 提交修改
                        if (title === "调入") {
                            item.choices_in = "2";
                        } else {
                            item.choices_out = "2";
                        }
                    })
                    .catch(() => {
                        if (title === "调入") {
                            item.choices_in = "1";
                        } else {
                            item.choices_out = "1";
                        }
                    });
            }
        },
        handleSelectionChange(selection, type) {
            this.tableData[type] = selection;
        },
        // 验证是否通过
        Verification() {
            let key  = true
            this.$refs.form.validate((valid) => {
                if (valid) {
                    return true
                } else {
                    key = false
                    return false;
                }
            });
            return key
        },
        resetForm() {
            this.$refs.multipleTable1.clearSelection();
            this.$refs.multipleTable2.clearSelection();
        },
        // 多选回显
        getList() {
            this.show = false;
            this.loading = true;
            this.tableToggleRowSelection();
            this.show = true;
            this.loading = false;
        },

        tableToggleRowSelection() {
            if (this.type === "edit") {
                this.tableData.apply_detail.forEach((v, k) => {
                    let index = this.apply_detail.findIndex(
                        (value) => value.id === v.id
                    );

                    if (index >= 0) {
                        this.$nextTick(() => {
                            this.$refs.multipleTable2.toggleRowSelection(
                                this.apply_detail[index],
                                true
                            );
                        });
                    }
                });
                this.tableData.pay_detail.forEach((v, k) => {
                    let index = this.pay_detail.findIndex(
                        (value) => value.id === v.id
                    );
                    if (index >= 0) {
                        this.$nextTick(() => {
                            this.$refs.multipleTable1.toggleRowSelection(
                                this.pay_detail[index],
                                true
                            );
                        });
                    }
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .el-message-box__status {
    top: 30%;
}
</style>
