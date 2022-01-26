<template>
    <div>
        <!-- 查看节点详情
         -->
        <Yg-Drawer
            v-model="showValue"
            title="节点情况"
            size="700px"
            :showFooter="false"
        >
            <div v-loading="loading">
                <el-table
                    :data="tableData.undos"
                    style="width: 100%"
                    v-for="(tableData, index) in filtetData"
                    :key="index"
                    :show-header="index === 0"
                    border
                    class="yg-table"
                >
                    <el-table-column prop="user_name" label="审批人">
                    </el-table-column>
                    <el-table-column prop="name" label="滞留时长">
                        <template slot-scope="scope">
                            {{
                                holdUpTime(
                                    tableData.counter_sign,
                                    scope.row,
                                    index
                                )
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="result" label="结果">
                        <template slot-scope="scope">
                            <span v-if="scope.row.result === 0">审核中</span>
                            <span v-else-if="scope.row.result === 2"
                                >已通过</span
                            >
                            <span v-else-if="scope.row.result === 3"
                                >已拒绝</span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column prop="update_datetime" label="审批时间">
                        <template slot-scope="scope">
                            <span v-if="scope.row.result !== 0">
                                {{ scope.row.update_datetime | Time }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </Yg-Drawer>
    </div>
</template>
<script>
import moment from "moment";
import { listByExamineInst } from "@/request/api/system/flow.js";
export default {
    name: "Nodedetails",
    data() {
        return {
            data: [],
            loading: false,
        };
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        node_id: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        showValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
        filtetData() {
            return this.data.filter((v) => v.undos.length > 0);
        },
    },
    watch: {
        node_id(newV, oldV) {
            this.loading = true;
            listByExamineInst(newV)
                .then((res) => {
                    //直接获取最后一个状态
                    this.data = res.data;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
    },
    filters: {
        Time(val) {
            return moment(val).format("YYYY-MM-DD H:mm:ss");
        },
    },
    methods: {
        RetentionTime(newTime, oldTime) {
            // Moment报错Deprecation warning处理
            var a = moment(new Date(newTime).toISOString());
            var b = moment(new Date(oldTime).toISOString());
            // 计算滞留时长
            let dateDiff = moment.duration(b.diff(a))._data;
            // 天
            let day = dateDiff.day;
            // 小时
            let hours = dateDiff.hours;
            // 分
            let minutes = dateDiff.minutes;
            return `${day > 0 ? day : ""}${day > 0 ? "天" : ""}
           ${hours > 0 ? hours : ""}${hours > 0 ? "小时" : ""}
           ${minutes >= 0 ? minutes : ""}${minutes >= 0 ? "分" : ""}
          `;
        },
        // table=会签或签 data=数据  index = scope/row.$index
        holdUpTime(table, data, index) {
            // 如果第一环节时候就走完了流程，需要更新时间减去创建时间
            if (this.data[index - 1] === undefined) {
                // 会签计算每一个人
                if (table == 0) {
                    return this.RetentionTime(
                        this.data[index].create_datetime,
                        data.update_datetime
                    );
                } else {
                    // 或签计算一个热
                    if (data.finished === 1 && table == 2) {
                        return this.RetentionTime(
                            this.data[index].create_datetime,
                            data.update_datetime
                        );
                    } else {
                        if (data.result === 0) {
                            return this.RetentionTime(
                                this.data[index].create_datetime,
                                moment(new Date()).format("YYYY-MM-DD H:mm:ss")
                            );
                        }
                    }
                }
            } else {
                // 其他环节需要更新时间减去上一个节点的更新时间
                // return '有数据对比'
                if (table == 0) {
                    return this.RetentionTime(
                        this.data[index - 1].update_datetime,
                        data.update_datetime
                    );
                } else {
                    if (data.finished === 1 && table == 2) {
                        return this.RetentionTime(
                            this.data[index - 1].create_datetime,
                            data.update_datetime
                        );
                    } else {
                        if (data.result === 0) {
                            return this.RetentionTime(
                                this.data[index].create_datetime,
                                moment(new Date()).format("YYYY-MM-DD H:mm:ss")
                            );
                        }
                    }
                }
            }
            // return RetentionTime()
        }
    },
};
</script>
