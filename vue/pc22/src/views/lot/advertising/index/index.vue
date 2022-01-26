<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        :searchForm="search.form"
        @pagination="handlePagination"
        @search="handleSearch"
        @reset="handleReset"
    >
        <template slot="action-bar">
            <el-button
                type="primary"
                @click="operation('add')"
                v-hasPermi="['123456']"
                >新增</el-button
            >
            <el-button type="danger" @click="batchdel">批量删除</el-button>
        </template>
        <el-table
            :data="tableData"
            border
            height="100%"
            @selection-change="getcheckedmsg"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="广告名称"></el-table-column>
            <el-table-column prop="nums" label="素材数量"></el-table-column>
            <el-table-column prop="updateuser" label="修改人"></el-table-column>
            <el-table-column
                prop="updatetime"
                label="修改时间"
            ></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="openchecked(scope.row.id)"
                        >查看</el-button
                    >
                    <el-button
                        type="text"
                        @click="operation('edit', scope.row.id)"
                        >编辑</el-button
                    >
                    <el-button type="text" style="color: red">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Drawer
            size="50%"
            :visible.sync="visible"
            v-loading="loading"
            element-loading-text="拼命加载中"
            :title="drawerType == 'add' ? '新建' : '编辑'"
            :before-close="beforeClose"
            @confirm="confirm"
        >
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="广告名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="播放内容" prop="content">
                    <draggable
                        v-model="form.myArray"
                        chosenClass="chosen"
                        forceFallback="true"
                        group="people"
                        animation="100"
                        @start="onStart"
                        @end="onEnd"
                    >
                        <transition-group>
                            <div
                                class="item"
                                v-for="(item, index) in form.myArray"
                                :key="item.id"
                            >
                                <div class="title">
                                    <el-row>
                                        <el-col :span="20"
                                            >素材{{ index + 1 }}</el-col
                                        >
                                        <el-col :span="4">
                                            <el-button
                                                type="text"
                                                @click="deladvertising(index)"
                                                ><i class="el-icon-delete"></i
                                            ></el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                                <template v-if="draghidden">
                                    <el-form-item
                                        label="素材类型"
                                        class="elformitem_layout"
                                    >
                                        <el-radio v-model="item.type" label="1"
                                            >图片</el-radio
                                        >
                                        <el-radio v-model="item.type" label="2"
                                            >视频</el-radio
                                        >
                                    </el-form-item>
                                    <el-form-item
                                        label="选择素材"
                                        :prop="'myArray.' + index + '.material'"
                                        :rules="{
                                            required: true,
                                            message: '请选择广告素材',
                                            trigger: 'blur',
                                        }"
                                        class="elformitem_layout"
                                    >
                                        <el-select
                                            v-model="item.material"
                                            size="mini"
                                            style="width: 33.5%"
                                        >
                                            <el-option
                                                v-for="item in materialoptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        class="elformitem_layout"
                                        label="开始时间"
                                        :prop="'myArray.' + index + '.s_time'"
                                        :rules="{
                                            required: true,
                                            message: '请选择开始时间',
                                            trigger: 'change',
                                        }"
                                    >
                                        <el-date-picker
                                            v-model="item.s_time"
                                            type="datetime"
                                            size="mini"
                                            placeholder="选择开始时间"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item
                                        class="elformitem_layout"
                                        label="结束时间"
                                        :prop="'myArray.' + index + '.e_time'"
                                        :rules="{
                                            required: true,
                                            message: '请选择结束时间',
                                            trigger: 'change',
                                        }"
                                    >
                                        <el-date-picker
                                            v-model="item.e_time"
                                            type="datetime"
                                            size="mini"
                                            placeholder="选择结束时间"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item
                                        label="播放时长"
                                        :prop="'myArray.' + index + '.langtime'"
                                        :rules="{
                                            required: true,
                                            message: '请填写播放时长',
                                            trigger: 'change',
                                        }"
                                    >
                                        <el-input
                                            v-model="item.langtime"
                                            :disabled="item.type == '2'"
                                            size="mini"
                                            style="width: 33.5%"
                                        ></el-input>
                                    </el-form-item>
                                </template>
                            </div>
                        </transition-group>
                    </draggable>
                    <el-button type="text" @click="addadvertising"
                        >+ 添加广告</el-button
                    >
                </el-form-item>
            </el-form>
        </Drawer>
        <Drawer
            class="check"
            size="50%"
            :visible.sync="checked"
            v-loading="loading"
            element-loading-text="拼命加载中"
            title="查看"
        >
            <el-form>
                <el-form-item label="广告名称">{{ "宣传片" }}</el-form-item>
                <el-form-item label="播放内容">
                    <div
                        class="item"
                        v-for="(item, index) in checkedres"
                        :key="'checked' + index"
                    >
                        <h4 class="title">素材{{ index + 1 }}</h4>
                        <el-form-item
                            class="elformitem_layout"
                            label="素材类型"
                            >{{
                                item.type == "1" ? "图片" : "视频"
                            }}</el-form-item
                        >
                        <el-form-item
                            class="elformitem_layout"
                            label="素材文件"
                            >{{
                                item.type == "1" ? "图片" : "视频"
                            }}</el-form-item
                        >
                        <el-form-item
                            class="elformitem_layout"
                            label="开始时间"
                            >{{ item.s_time }}</el-form-item
                        >
                        <el-form-item
                            class="elformitem_layout"
                            label="结束时间"
                            >{{ item.e_time }}</el-form-item
                        >
                        <el-form-item
                            class="elformitem_layout"
                            label="播放时长/s"
                            >{{ item.langtime }}</el-form-item
                        >
                    </div>
                </el-form-item>
            </el-form>
        </Drawer>
    </Table-page>
</template>

<script>
import draggable from "vuedraggable";
export default {
    components: { draggable },
    data() {
        return {
            checked: false,
            checkedres: [
                {
                    type: "1",
                    material: "1",
                    s_time: "2021",
                    e_time: "2022",
                    langtime: "10s",
                },
                {
                    type: "1",
                    material: "2",
                    s_time: "2021",
                    e_time: "2022",
                    langtime: "10s",
                },
                {
                    type: "1",
                    material: "3",
                    s_time: "2021",
                    e_time: "2022",
                    langtime: "10s",
                },
            ], //查看的播放内容
            materialoptions: [],
            draghidden: true,
            drag: false,
            checkedmsg: [], //选中的表格数据
            form: {
                myArray: [
                    {
                        type: "1",
                        material: "",
                        s_time: "",
                        e_time: "",
                        langtime: "",
                    },
                ],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "素材名称不能为空",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "内容不能为空",
                        trigger: "blur",
                    },
                ],
            },
            visible: false,
            loading: false,
            drawerType: "",
            itemId: "",
            tableData: [],
            search: {
                form: [
                    {
                        label: "素材名称",
                        type: "input",
                        name: "name",
                    },
                    {
                        label: "素材类型",
                        type: "select",
                        name: "type",
                        placeholder: "请输入姓名",
                    },
                    {
                        label: "创建人",
                        type: "input",
                        name: "creaduser",
                        placeholder: "请选择状态",
                    },
                ],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                isOpen: false,
            },
        };
    },
    methods: {
        openchecked(id) {
            this.checked = true;
        },
        deladvertising(index) {
            this.form.myArray.splice(index, 1);
        },
        addadvertising() {
            this.form.myArray.push({
                id: this.form.myArray.length + 1,
                type: "1",
                material: "",
                s_time: "",
                e_time: "",
                langtime: "",
            });
        },
        //开始拖拽事件
        onStart() {
            this.drag = true;
            this.draghidden = false;
        },
        //拖拽结束事件
        onEnd() {
            this.drag = false;
            this.draghidden = true;
        },
        batchdel() {
            console.log(this.checkedmsg);
        },
        getcheckedmsg(val) {
            this.checkedmsg = val;
        },
        submitForm() {
            this.$refs.saveFile.fileList = [];
        },
        confirm() {
            let self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    console.log("验证通过");
                }
            });
        },
        beforeClose() {
            this.visible = false;
            this.form = {
                type: "1",
                imglist: [],
            };
        },
        operation(type, id) {
            this.visible = true;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfo();
        },
        getInfo() {},
        getList() {
            this.tableData = [
                {
                    name: "1",
                    nums: "2",
                    updateuser: "锤子",
                    updatetime: "2021-12-12",
                },
                {
                    name: "1",
                    nums: "2",
                    updateuser: "锤子",
                    updatetime: "2021-12-12",
                },
                {
                    name: "1",
                    nums: "2",
                    updateuser: "锤子",
                    updatetime: "2021-12-12",
                },
                {
                    name: "1",
                    nums: "2",
                    updateuser: "锤子",
                    updatetime: "2021-12-12",
                },
            ];
        },
        handlePagination(e) {
            this.search.pageNum = e.pageNum;
            this.getList();
        },
        handleSearch(e) {
            this.queryParams = e;
            this.search.pageNum = 1;
            this.getList();
        },
        handleReset() {
            this.$info(`触发重置方法，表单值：${JSON.stringify(e)}`);
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style lang="scss" scoped>
.check {
    /deep/.drawer-footer {
        display: none !important;
    }
}
.elformitem_layout {
    margin-bottom: 20px;
}
.title {
    background-color: #e4e7ed;
    padding: 4px;
}
.item {
    padding-bottom: 20px;
    background-color: #fdfdfd;
    border: solid 1px #eee;
    margin-bottom: 10px;
    cursor: move;
}
/*选中样式*/
.chosen {
    border: solid 1px #3089dc !important;
}
</style>
