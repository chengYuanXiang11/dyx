<template>
    <div class="app-container">
        <el-form ref="queryForm" :model="query" :inline="true" label-width="85x">
            <el-form-item label="公告标题" prop="announcementTitle">
                <el-input
                    v-model="query.announcementTitle"
                    placeholder="请输入公告标题"
                    clearable
                    size="small"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker
                    v-model="query.timedRelease"
                    type="date"
                    placeholder="请选择时间"
                   
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="announcementStatus">
                <el-select
                    v-model="query.announcementStatus"
                    placeholder="请选择状态"
                    clearable
                    size="small"
                    style="width: 200px"
                >
                    <el-option
                        v-for="item in searchList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary" @click="add">新建</el-button>
            <el-button
                type="primary"
                :disabled="multipleSelection.length == 0"
                @click="deleteMul"
            >批量删除</el-button>
        </div>

        <el-table
            v-loading="loading"
            :data="tableData"
            class="yg-table"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="公告标题" prop="announcementTitle" />
            <el-table-column label="主图" prop="announcementPic">
                <template slot-scope="scope">
                    <img :src="scope.row.announcementPic" alt style="width:100px" />
                </template>
            </el-table-column>
            <el-table-column label="发布时间" prop="timedRelease">
                <template
                    slot-scope="scope"
                >{{ scope.row.timedRelease==null?'立刻发布':(new Date(scope.row.timedRelease)).toLocaleDateString() }}</template>
            </el-table-column>
            <el-table-column label="过期时间" prop="validTime">
                <template
                    slot-scope="scope"
                >{{ (new Date(scope.row.validTime)).toLocaleDateString() }}</template>
            </el-table-column>
            <el-table-column label="排序" prop="announcementSort" />
            <el-table-column label="状态" prop="announcementStatus" :formatter="statusFormatter" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="listTo('view', scope.row.id)">查看</el-button>
                    <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            :total="total"
            :page.sync="query.pageNum"
            :limit.sync="query.pageSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import {
    getList,
    delRow, delMul
} from "@/request/api/market/merchantsMgmt/index";
export default {
    data() {
        return {
            // 高级
            isShow: false,
            showDrawer: false,
            drawerType: "",
            loading: true,
            btnLoading: false,
            total: 0,
            tableData: [],
            query: {
                pageNum: 1,
                pages: 20,

                announcementTitle:"",
                timedRelease:"",
                announcementStatusL:""
            },
            form: {},
            rules: {},
            searchList: [
                { label: "待发布", value: 1 },
                { label: "已发布", value: 2 },
                { label: "已过期", value: 3 },
                
            ],
            multipleSelection: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        statusFormatter(row) {
            if (row.announcementStatus == 1) {
                return '待发布'
            } else if (row.announcementStatus == 2) {
                return '已发布'
            } else if (row.announcementStatus == 3) {
                return '已过期'
            } else {
                return row.announcementStatus
            }
        },
        add() {
            this.$router.push({
                path: '/merchantAdvertising'
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            // console.log(val);
        },
        // 添加 查看
        listTo(type, id) {
            // this.$eventBus.$emit('quillHtml',content)
            this.$router.push({
                path: `/preview/${type}`,
                query: {
                    id, type
                },
            })
        },
        getList() {
            let _this = this
            this.loading = false;
            getList(this.query).then(res => {
                _this.tableData = res.data.results
                _this.total = res.data.count
            })

        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.query.pageNum = 1;
            if(this.query.timedRelease!=""){
                this.query.timedRelease = new Date(this.query.timedRelease).getTime()
            }
            
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.query.timedRelease =""
            this.resetForm("queryForm");
            this.handleQuery();
        },
        del(id) {
            const self = this;
            self
                .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    delRow(id).then((res) => {
                        self.$toast("删除成功！");
                        self.getList();
                    });
                });
        },
        deleteMul() {
            let _this = this
            this.$confirm('此操作将会批量删除所选数据,是否继续?', '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(_ => {
                let arr = _this.multipleSelection.map(item => {
                    return item.id
                })
                let obj = {
                    announcementId: arr.join(',')
                }
                delMul(obj).then(res => {
                    if (res.code == 200) {
                        _this.$toast('批量删除成功!')
                        _this.getList()
                    }
                })
            })

        }

    },
};
</script>

<style scoped lang="scss">
.btn {
    margin-bottom: 15px;
}
</style>

