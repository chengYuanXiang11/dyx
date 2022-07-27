<template>
    <div class="app-container">
        <el-button class="newlyBuild" type="primary" @click="editBudget('add')"
            >新建</el-button
        >
        <AddBudget
            v-model="budgetShow"
            :type="type"
            :id="budgetId"
            @reset="getList"
        ></AddBudget>
        <el-table
            :data="tableData"
            class="yg-table"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column label="预算项目" prop="name"> </el-table-column>
            <el-table-column label="是否可以调入" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-switch
                        v-if="!scope.row.child_list"
                        v-model="scope.row.choices_in"
                        active-value="1"
                        inactive-value="2"
                        @change="putBudget($event, scope.row, '调入')"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="是否可以调出"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-switch
                        v-if="!scope.row.child_list"
                        v-model="scope.row.choices_out"
                        active-value="1"
                        inactive-value="2"
                        @change="putBudget($event, scope.row, '调出')"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope" v-if="scope.row.child_list">
                    <el-button
                        size="mini"
                        type="text"
                        @click="editBudget('edit', scope.row.id)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="text"
                        @click="deleteBudget(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    getBudgets,
    PUTBudgets,
    DeleteBudgets,
} from "@/request/api/financial/budget/project.js";
import AddBudget from "./components/addBudget.vue";
export default {
    name: "To-do",
    data() {
        return {
            value: "",
            // 新增
            budgetShow: false,
            tableData: [],
            multipleSelection: [],
            type: "add",
            budgetId: "",
        };
    },
    components: {
        AddBudget,
    },
    methods: {
        getList() {
            getBudgets().then((res) => {
                if (res.data.results.length > 0) {
                    res.data.results.forEach((v) => {
                        v.children = v.child_list;
                        v.cid = v.id;
                    });
                    this.tableData = res.data.results;
                }
            });
        },
        // 修改数据
        putBudget(value, item, title) {
            //关闭前先禁止关闭
            if (title === "调入") {
                item.choices_in = "1";
            } else {
                item.choices_out = "1";
            }

            let index = this.tableData.findIndex(
                (v) => v.id === item.parent_id
            );
            // 取消关联时弹出提示
            if (value == 2) {
                this.$confirm(
                    `<spam>确认关闭吗?</spam><p>关闭后，该项目将不可以${title}</p>`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        // type: "warning",
                        dangerouslyUseHTMLString: true,
                    }
                )
                    .then(() => {
                        // 提交修改
                        this.$message({
                            type: "success",
                            message: "已修改关联项!",
                        });
                        item.choices_in = "2";
                        PUTBudgets(item.parent_id, this.tableData[index])
                            .then((res) => {
                                this.$message.success("修改成功");
                            })
                            .catch((err) => {
                                this.$message.error(err.msg);
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消关联项!",
                        });
                        item.choices_in = "1";
                    });
            } else {
                PUTBudgets(item.parent_id, this.tableData[index])
                    .then((res) => {
                        this.$message.success("修改成功");
                    })
                    .catch((err) => {
                        this.$message.error(err.msg);
                    });
            }
        },
        //删除数据
        deleteBudget(id) {
            DeleteBudgets(id).then((res) => {
                this.$message.success("删除成功");
                this.getList();
            });
        },
        // 打开新建
        editBudget(type, id = undefined) {
            this.type = type;
            if (id !== undefined) {
                this.budgetId = id.toString();
            }

            this.budgetShow = true;
        },
        // 回显
        toggleSelection(rows) {
            if (rows) {
                rows.forEach((row) => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style scoped lang="scss">
.newlyBuild {
   margin-bottom:20px;
}
</style>
