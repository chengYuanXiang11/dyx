<template>
    <div class="app-container">
        <el-form :model="formData" ref="form">
            <el-form-item label="巡检时间：">{{
                formData.pooling_time
            }}</el-form-item>
            <el-form-item label="巡检人：">
                {{ formatUser(formData.pooling_checker) }}
            </el-form-item>
            <el-form-item label="巡检单：">{{
                formData.pooling_ticket
            }}</el-form-item>
            <el-form-item
                v-for="(item, index) in formData.project_details"
                :key="index"
            >
                <div class="project-list">
                    <div class="item">
                        <span>巡检项：</span>
                        <p>{{ item.project_name }}</p>
                    </div>
                    <div class="item">
                        <span>是否合格：</span>
                        <el-radio-group
                            v-model="item.is_pass"
                            @change="
                                getTree(item.is_pass, item.project_id, index)
                            "
                        >
                            <el-radio-button :label="1">合格</el-radio-button>
                            <el-radio-button :label="2">不合格</el-radio-button>
                        </el-radio-group>
                    </div>
                    <template v-if="item.is_pass == '2'">
                        <div
                            class="task-list"
                            v-for="(taskitem, taskindex) in item.task_issue"
                            :key="'task' + taskindex"
                        >
                            <div class="task-item">
                                <div class="header">
                                    {{ "任务" + (taskindex + 1) }}
                                    <span v-if="taskindex != 0" @click="removeTask(index, taskindex)"
                                        >删除</span
                                    >
                                </div>
                                <div class="main">
                                    <el-form-item
                                        label="任务名称"
                                        :prop="
                                            'project_details.' +
                                            index +
                                            '.task_issue.' +
                                            taskindex +
                                            '.task_name'
                                        "
                                        :rules="rules.task_name"
                                        label-width="80px"
                                    >
                                        <el-input
                                            size="mini"
                                            v-model="taskitem.task_name"
                                        >
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item
                                        label="区域"
                                        style="margin-top: 20px"
                                        label-width="80px"
                                        :prop="
                                            'project_details.' +
                                            index +
                                            '.task_issue.' +
                                            taskindex +
                                            '.area'
                                        "
                                        :rules="rules.area"
                                    >
                                        <el-cascader
                                            :show-all-levels="false"
                                            v-model="taskitem.area"
                                            :options="item.options"
                                            :props="props"
                                            size="mini"
                                            clearable
                                            @change="
                                                selectArea(
                                                    $event,
                                                    item,
                                                    index,
                                                    taskindex
                                                )
                                            "
                                        ></el-cascader>
                                    </el-form-item>
                                    <el-form-item
                                        label="整改人"
                                        style="margin-top: 20px"
                                        label-width="80px"
                                    >
                                        <el-input
                                            :disabled="true"
                                            v-model="taskitem.modifier"
                                            size="mini"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        label="图片"
                                        style="margin-top: 20px"
                                        label-width="80px"
                                    >
                                        <UploadImg
                                            v-model="taskitem.picture"
                                            :limit="3"
                                            class="imgstyl"
                                        ></UploadImg>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                        <el-button @click="addTask(index)"
                            >+ 添加任务</el-button
                        >
                    </template>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">确定</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    getInfo,
    getTree,
    manageTask,
} from "../../../../../request/api/market/inspection/task.js";
export default {
    data() {
        return {
            areaOptions: [],
            props: {
                value: "id",
                label: "label",
                children: "children",
                checkStrictly: true,
                emitPath: false,
            },
            rules: {
                task_name: [
                    {
                        required: true,
                        message: "请输入任务名称",
                        trigger: "blur",
                    },
                ],
                area: [
                    {
                        required: true,
                        message: "请选择区域",
                        trigger: "blur",
                    },
                ],
            },
            id: this.$route.query.id,
            formData: {},
            rules: {
                task_name: [
                    {
                        required: true,
                        message: "请输入任务名称",
                        trigger: "blur",
                    },
                ],
                area: [
                    {
                        required: true,
                        message: "请选择区域",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    methods: {
        addTask(index) {
            // console.log(id)
            this.formData.project_details[index].task_issue.push({
                area: "",
                is_pass: 1,
                modifier: "",
                picture: [],
                task_name: "",
                after_modify: [
                    {
                        after_picture: "",
                        finisher: "",
                        remark: "",
                        time: "",
                    },
                ],
            });
        },
        submit() {
            // console.log(this.projectList);
            // manageTask(this.projectList, this.id).then((resp) => {
            //     this.$toast("成功！");
            // });
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getTree(is, id, index) {
            if (is == 2) {
                getTree(id).then((resp) => {
                    let res = this.handleTree(resp.data, "id", "parent_id");
                    this.$set(
                        this.formData.project_details[index],
                        "options",
                        res
                    );
                    this.$set(
                        this.formData.project_details[index],
                        "optionsList",
                        resp.data
                    );
                });
            }
        },
        selectArea(val, item, index, taskindex) {
            let user = item.optionsList
                .find((v) => v.id == val)
                .principal.join(",");
            this.$set(
                this.formData.project_details[index].task_issue[taskindex],
                "modifier",
                user
            );
        },
        getInfo() {
            getInfo(this.id).then((resp) => {
                let data = resp.data;
                this.formData = this.filterObj(data, [
                    "pooling_time",
                    "pooling_checker",
                    "pooling_ticket",
                    "project_details",
                ]);
                let project_details = data.project_details.map((item) => {
                    item.task_issue = item.task_issue.map((el) => {
                        el.picture = [];
                        el.modifier = "";
                        return el;
                    });
                    return item;
                });
                this.$set(this.formData, "project_details", project_details);
            });
        },
        formatUser(arr) {
            if (!arr) {
                return false;
            }
            return arr.length <= 0 ? "" : arr.join(",");
        },
        removeTask(idx, chilIdx) {
            this.$confirm("是否删除该任务", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.formData.project_details[idx].task_issue.splice(chilIdx, 1);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
    },
    created() {
        this.getInfo();
    },
};
</script>

<style lang="scss" scoped>
::v-deep .imgstyl .img-list {
    li,
    .el-upload {
        width: 104px;
        height: 104px;
        line-height: 104px;
    }
}
.project-list {
    border-radius: 2px 2px 0px 0px;
    border: 1px solid #d9d9d9;
    width: 547px;
    padding: 8px 16px;
    .item {
        display: flex;
        color: rgba(1, 6, 33, 0.9);
        align-items: center;
        font-size: 14px;
        padding: 8px 0;
        span {
            margin-right: 10px;
        }
    }
    .task-list {
        border: solid 1px #d9d9d9;
        border-radius: 2px;
        margin: 8px 0 16px;
        .header {
            height: 46px;
            display: flex;
            align-items: center;
            color: rgba(1, 6, 33, 0.9);
            justify-content: space-between;
            padding-left: 16px;
            background-color: #f5f5f5;
            border-bottom: solid 1px #d9d9d9;
            span {
                color: #048790;
                padding: 0px 16px;
                cursor: pointer;
            }
        }
        .main {
            padding: 16px;
            .el-input,
            .el-cascader {
                width: 60%;
            }
        }
    }
    .el-button {
        width: 100%;
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        font-size: 16px;
        color: #048790;
    }
}
</style>
