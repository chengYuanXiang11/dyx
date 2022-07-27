<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="tableData" class="yg-table">
            <el-table-column label="参数名称" prop="code_name" />
            <el-table-column label="编号预览" prop="code_preview" />
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch disabled v-model="scope.row.code_status">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        v-hasPermi="['permission:role:{id}:delete']"
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                        >编辑</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
        <Yg-Drawer
            v-model="showDrawer"
            title="编辑编号管理"
            @confirm="confirmForm"
            @closed="closed"
            @cancel="closed"
            :confirmLoading="btnLoading"
        >
            <el-form
                ref="form"
                :model="form"
                label-width="120px"
                :rules="rules"
            >
                <el-form-item label="编辑规则" prop="office_addr_name">
                    <!--使用draggable组件-->
                    <draggable
                        v-model="sorting"
                        forceFallback="true"
                        group="people"
                        animation="100"
                        class="draggable"
                        :move="onMove"
                    >
                        <el-tag
                            :class="['item', { custom: o.key == 'code_diy' }]"
                            v-for="(o, index) in sorting"
                            :key="index"
                            :closable="o.key != 'creator'"
                            @close="closeTag(o)"
                        >
                            <span v-if="o.key != 'code_diy'">
                                {{ o.name }}
                            </span>
                            <el-input
                                v-model="o.value"
                                v-else
                                placeholder="请输入"
                            ></el-input>
                        </el-tag>
                    </draggable>
                </el-form-item>
                <el-form-item label="动态编码" prop="city">
                    <draggable
                        v-model="original"
                        group="people"
                        animation="100"
                        class="draggable original"
                        forceFallback="true"
                    >
                        <el-tag
                            class="item"
                            v-for="(o, index) in original"
                            :key="index"
                        >
                            {{ o.name }}
                        </el-tag>
                    </draggable>
                </el-form-item>
                <el-form-item label="编码预览" prop="addr">
                    <div class="preview">{{ previewCode }}</div>
                </el-form-item>
                <el-form-item label="编码状态">
                    <el-radio-group v-model="form.code_status">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="0">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否允许修改">
                    <el-radio-group v-model="form.allowed_modify">
                        <el-radio label="1">允许</el-radio>
                        <el-radio label="0">不允许</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </Yg-Drawer>
    </div>
</template>

<script>
import { getList, updateCode } from "@/request/api/system/codeList";
import draggable from "vuedraggable";
import { compare } from "@/utils/index";
export default {
    name: "Parameter",
    components: {
        draggable,
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            btnLoading: false,
            // 总条数
            total: 0,
            // 角色表格数据
            tableData: [],
            showDrawer: false,
            queryParams: {
                pageNum: 1,
                pageSize: 20,
            },
            form: {
                code_status: 0,
                allowed_modify: "0",
            },
            rules: {},
            drag: false,
            sourceArr: [
                { name: "公司", value: "GS", key: "code_company" },
                { name: "部门", value: "BM", key: "code_dept" },
                { name: "职务", value: "ZW", key: "code_blotter" },
                { name: "年度", value: "", key: "code_year" },
                { name: "自定义", value: "", key: "code_diy" },
                { name: "流水号", value: "001", key: "creator" },
            ],
            //定义要被拖拽对象的数组
            original: [],
            sorting: [],
        };
    },
    computed: {
        previewCode: function () {
            var str = "";
            this.sorting.map((item) => {
                str += item.value + "-";
            });
            str = str.substring(0, str.length - 1);
            return str;
        },
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询角色列表 */
        getList() {
            this.loading = true;
            getList().then((response) => {
                this.tableData = response.data.results;
                this.total = response.data.count;
                this.loading = false;
            });
        },
        closeTag(o) {
            for (let i = 0; i < this.sorting.length; i++) {
                if (this.sorting[i] == o) {
                    this.sorting.splice(i, 1);
                }
            }
            this.original.push(o);
        },
        onMove(e, originalEvent) {
            let code = e.draggedContext.element.key,
                targetClass = e.to.className;
            if (code == "creator" && targetClass.indexOf("original") != -1) {
                return false;
            }
        },
        confirmForm() {
            let str = "";
            this.sorting.map((item, index) => {
                let arr = {
                    value:item.key != "code_diy" ? '' : item.value,
                    sort:index,
                    key:item.key
                }
                str += JSON.stringify(arr) + ",";
            });
            str = str.substring(0, str.length - 1);
            str = `[${str}]`;
            this.form.code_rules = str;
            updateCode(this.form).then((res) => {
                this.$toast("修改成功");
                this.closed();
                this.getList();
            });
        },
        closed() {
            this.showDrawer = false;
            this.form = {};
            this.sorting = [];
            this.original = [];
        },
        handleUpdate(item) {
            let code_rules = JSON.parse(item.code_rules);
            if (code_rules) {
                this.original = this.sourceArr.filter((item) => {
                    return !code_rules.some((o) => o.key == item.key);
                });
                let sorting = [];
                this.sourceArr.map((item) => {
                    code_rules.map((o) => {
                        if (item.key == o.key) {
                            if (item.key == "code_diy") {
                                item.value = o.value;
                            }
                            if (item.key == "code_year") {
                                let date = new Date();
                                item.value = date.getFullYear();
                            }
                            item.sort = o.sort;
                            sorting.push(item);
                        }
                    });
                });
                this.sorting = sorting.sort(compare("sort"));
            } else {
                let sorting = [],original = [];
                this.sourceArr.map((item) => {
                    if(item.key == "creator"){
                        sorting.push(item)
                    }
                    else{
                        original.push(item)
                    }
                });
                this.sorting = sorting;
                this.original = original;
            }
            this.showDrawer = true;
            this.form = {
                id: item.id,
                code_status: item.code_status ? 1 : 0,
                allowed_modify: item.allowed_modify,
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.draggable {
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 15px;
    display: flex;
    min-height: 80px;
    flex-wrap: wrap;
    .item {
        margin-right: 10px;
        &:hover {
            cursor: move;
        }
    }
}
.codeList-main {
    .item {
        margin-right: 15px;
        &:hover {
            cursor: pointer;
        }
    }
}
::v-deep .custom {
    padding: 0 10px 0 0;
    .el-input {
        height: 100%;
        width: 60px;
        .el-input__inner {
            height: 100%;
            border: none;
            padding: 0 5px;
        }
    }
}
</style>