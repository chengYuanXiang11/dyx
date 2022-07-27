<template>
    <div class="app-container">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="申请人" prop="roleName">
                <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入角色名称"
                    clearable
                    size="small"
                    style="width: 240px"
                />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select
                    v-model="queryParams.status"
                    placeholder="请选择"
                    @change="getList"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="getList"
                    >搜索</el-button
                >
                <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="roleList" class="yg-table">
            <el-table-column label="流程名称" prop="title" />
            <el-table-column
                label="申请人"
                prop="creator_name"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="申请时间"
                prop="create_datetime"
                :show-overflow-tooltip="true"
            />

            <el-table-column
                label="流程耗时"
                prop="status"
                :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    {{ holdUpTime(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column
                label="审批状态"
                prop="node_name"
                :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <el-tag
                        type="success"
                        v-if="scope.row.node_name == '已通过'"
                        >已通过</el-tag
                    >
                    <el-tag
                        type="danger"
                        v-else-if="scope.row.node_name == '已拒绝'"
                        >已拒绝</el-tag
                    >
                    <el-tag
                        type="warning"
                        v-else-if="scope.row.node_name == '审批中'"
                        >审批中</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="节点情况"
                prop="node_id"
                :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <div>
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="nodeStatus(scope.row)"
                            >节点情况</el-link
                        >
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                        >查看</el-button
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
        <Nodedetails v-model="NodeShow" :node_id="node_id"> </Nodedetails>
    </div>
</template>

<script>
import Nodedetails from "./Nodedetails.vue";
import {
    getStatusPage,
    getStatusList,
    getNameFlow,
} from "@/request/api/system/flow.js";
import moment from "moment";
import { debounce } from "@/utils";
export default {
    name: "Processmonitor",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 10,
            // 角色表格数据
            roleList: [{}],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                roleName: "",
                roleKey: undefined,
                status: "全部",
            },
            options: [
                {
                    id: 1,
                    value: "全部",
                    label: "全部",
                },
                {
                    id: 2,

                    value: "审批中",
                    label: "审批中",
                },
                {
                    id: 3,

                    value: "已通过",
                    label: "已通过",
                },
                {
                    id: 4,
                    value: "已拒绝",
                    label: "已拒绝",
                },
            ],
            //输入时的防抖
            debounceName: debounce(this.getList, 1000),
            // 节点情况右侧弹窗
            NodeShow: false,
            // 当前节点id
            node_id: 0,
        };
    },
    watch: {
        "queryParams.roleName"() {
            this.debounceName();
        },
    },
    created() {
        this.getList();
    },
    components: {
        Nodedetails,
    },
    methods: {
        // 时间计算状态判断
        holdUpTime(data) {
            if (data.node_name === "审批中") {
                return this.RetentionTime(data.update_datetime, new Date());
            } else {
                return this.RetentionTime(
                    data.create_datetime,
                    data.update_datetime
                );
            }
        },
        // 时间计算
        RetentionTime(newTime, oldTime) {
            var a = moment(newTime);
            var b = moment(oldTime);
            // 计算滞留时长
            let dateDiff = moment.duration(b.diff(a))._data;
            let day = dateDiff.day;
            let hours = dateDiff.hours;
            let minutes = dateDiff.minutes;
            return `${day > 0 ? day : ""}${day > 0 ? "天" : ""}
           ${hours > 0 ? hours : ""}${hours > 0 ? "小时" : ""}
           ${minutes >= 0 ? minutes : ""}${minutes >= 0 ? "分" : ""}
          `;
        },
        //审核状态选项变化
        getList() {
            this.loading = true;
            getStatusPage(this.queryParams)
                .then((res) => {
                    this.total = res.data.count;
                    this.roleList = res.data.results;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        // 重置
        resetQuery() {
            this.$refs["queryForm"].resetFields();
            this.$nextTick(() => {
                this.getList();
            });
        },
        // 节点弹窗
        nodeStatus(val) {
            this.node_id = val.id;
            this.NodeShow = true;
        },
        // 查看跳转
        handleUpdate(v) {
            this.$router.push({
                path: `/ApplyDetails?type=1&examine_id=${v.examine_id}&examine_instance_id=${v.id}&id=${v.id}`,
            });
        },
    },
};
</script>

<style scoped lang="scss"></style>
