<template>
    <div>
        <el-dialog
            title="更改班次"
            :visible.sync="selectShiftDialog"
            width="800px"
            destroy-on-close
            @closed="dialogClose"
        >
            <div class="shift-dialog-main">
                <div class="search">
                    <el-form :model="search" label-widht="100px" inline>
                        <div class="date" v-if="hasDate">
                            <el-form-item label="日期：">
                                <el-date-picker
                                    v-model="date"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd"
                                    :disabled="dateDisabled"
                                    :picker-options="pickerOptions"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <el-form-item label="班次：">
                            <el-input
                                v-model="search.working_shift_name"
                                placeholder="请输入班次名称"
                                clearable
                                @keyup.enter.native="handleQuery"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                @click="handleQuery"
                                >搜索</el-button
                            >
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox
                                v-model="search.self"
                                @change="handleQuery"
                                >只显示我创建的班次</el-checkbox
                            >
                        </el-form-item>
                    </el-form>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        @click="openShiftDialog('add')"
                        >新建班次</el-button
                    >
                </div>
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    highlight-current-row
                    @row-click="itemsRowClick"
                    ><el-table-column label width="70" align="center">
                        <template slot-scope="scope">
                            <el-radio :label="scope.row.id" v-model="workManage"
                                ><span></span
                            ></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="班次名称"
                        prop="working_shift_name"
                    />
                    <el-table-column
                        label="考勤时间"
                        :formatter="formatTimeQuantum"
                    />
                </el-table>
                <pagination
                    :total="total"
                    :page.sync="search.pageNum"
                    :limit.sync="search.pageSize"
                    @pagination="getList"
                />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectShiftDialog = false">取消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
        <AddShiftDialog
            v-model="showDialog"
            :dialogType="dialogType"
            :id="shiftId"
            @complete="getList"
        ></AddShiftDialog>
    </div>
</template>

<script>
import { getList } from "@/request/api/personnel/checking/shift";
import formatShiftTime from "./formatShift";
import AddShiftDialog from "@/views/components/shiftDialog";
export default {
    name: "shiftDialog",
    components: {
        AddShiftDialog,
    },
    data() {
        return {
            selectShiftDialog: this.show,
            search: {},
            tableData: [],
            loading: false,
            workManage: "",
            shiftItem: {},
            total: 0,
            showDialog: false,
            dialogType: "add",
            shiftId: undefined,
            date: "",
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: () => {
                return {};
            },
        },
        hasDate: {
            type: Boolean,
            default: false,
        },
        dateDisabled: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        dialogClose() {
            this.selectShiftDialog = false;
            this.workManage = "";
            this.date = "";
            this.shiftItem = {};
            this.$emit("update:show", false);
        },
        getList() {
            this.loading = true;
            let data = JSON.parse(JSON.stringify(this.search));
            data.self = data.self ? 1 : undefined;
            getList(data)
                .then((response) => {
                    this.tableData = response.data.results;
                    this.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        formatTimeQuantum(row) {
            return formatShiftTime(row);
        },
        itemsRowClick(row) {
            this.workManage = row.id;
            this.shiftItem = row;
        },
        handleQuery() {
            this.search.pageNum = 1;
            this.getList();
        },
        confirm() {
            if (this.workManage == "") {
                this.$toastError("请选择班次！");
                return false;
            }
            if (this.hasDate && this.date == "") {
                this.$toastError("请选择日期");
                return false;
            }
            this.selectShiftDialog = false;
            this.$emit(
                "confirm",
                this.hasDate
                    ? {
                          date: this.date,
                          shift: this.shiftItem,
                      }
                    : this.shiftItem
            );
        },
        reset() {
            this.search = {
                pageNum: 1,
                pageSize: 20,
                self: true,
            };
            if (!this.hasDate) {
                if (Object.keys(this.data).length != 0) {
                    this.workManage = this.data.id;
                    this.shiftItem = this.data;
                }
            } else {
                this.date = this.data.date;
                if (Object.keys(this.data.shift).length != 0) {
                    this.shiftItem = this.data.shift;
                    this.workManage = this.data.shift.id;
                }
            }
            this.getList();
        },
        openShiftDialog(type, id) {
            this.showDialog = true;
            this.dialogType = type;
            this.shiftId = id ? id : null;
        },
    },
    watch: {
        show(val) {
            val && this.reset();
            this.selectShiftDialog = this.show;
        },
    },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header {
    border-bottom: solid 1px #ddd;
}
.search {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    .date {
        margin-bottom: 20px;
        .el-date-editor {
            width: 229px;
        }
    }
    .el-form-item {
        margin-bottom: 0;
    }
}
</style>

