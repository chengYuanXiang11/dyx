<template>
    <div class="dashboard-editor-container app-container">
        <div ref="scheduling-main">
            <el-table
                :data="tableData"
                :style="{ width: `${tableWidth}px` }"
                class="yg-table"
                border
                ref="schedulingTable"
                :fit="false"
            >
                <el-table-column
                    prop="name"
                    label="姓名"
                    :resizable="false"
                    width="80px"
                >
                    <!-- <template slot="header" slot-scope="scope">
                    {{scope}}
                </template> -->
                </el-table-column>
                <el-table-column
                    v-for="(o, index) in headers"
                    :key="index"
                    prop="date"
                    align="center"
                    :resizable="false"
                    class-name="clickable"
                    width="45px"
                >
                    <template slot="header">
                        <div
                            class="table-header"
                            @click="changeShift($event, index, 'header')"
                        >
                            {{ o.day }}<br />{{ o.week }}
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <div
                            class="table-row"
                            @click="
                                changeShift($event, index, 'row', scope.$index)
                            "
                            v-html="format(index, scope.row)"
                        ></div>
                    </template>
                </el-table-column>
            </el-table>
            <div
                v-show="showPopover"
                class="popover"
                :style="{ left: `${popoverLeft}px`, top: `${popoverTop}px` }"
            >
                <i class="el-icon-caret-top arrow"></i>
                <div class="popover-main">
                    <el-radio-group v-model="schedulingType">
                        <el-radio-button label="1">按班次排班</el-radio-button>
                        <el-radio-button
                            label="2"
                            :disabled="popoverOption.type == 'header'"
                            >按周期排班</el-radio-button
                        >
                    </el-radio-group>
                    <div class="scheduling-list" v-show="schedulingType == '1'">
                        <div class="title">修改该成员当天班次</div>
                        <ul>
                            <li v-for="o in 4" :key="o" @click="setShift()">
                                班次{{ o++ }}
                            </li>
                            <li @click="setShift('clear')">清空</li>
                        </ul>
                    </div>
                    <div class="scheduling-list" v-show="schedulingType == '2'">
                        <div class="title">
                            从该天开始，按周期排班，直至本月最后一天
                        </div>
                        <ul>
                            <li @click="setShifts">做二休一</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DashboardAdmin",
    data() {
        return {
            tableData: [
                {
                    name: "张三",
                    shifts: [
                        {
                            name: "早班早班早班",
                        },
                        {
                            name: "中班",
                        },
                        {
                            name: "晚班",
                        },
                        {
                            name: "晚班1",
                        },
                        {
                            name: "晚班1234",
                        },
                        {
                            name: "晚班1231231",
                        },
                    ],
                },
                {
                    name: "李四",
                    shifts: [],
                },
                {
                    name: "王五",
                    shifts: [],
                },
                {
                    name: "赵六",
                    shifts: [],
                },
            ],
            headers: [],
            showPopover: false,
            popoverLeft: 10,
            popoverTop: 10,
            schedulingType: "1",
            popoverOption: {},
        };
    },
    computed: {
        tableWidth() {
            return this.headers.length * 45 + 82;
        },
    },
    created() {
        let years = 2020,
            month = 4;
        var dayNum = this.getMonthDays(years, month);
        var dayArr = [];
        for (let i = 0; i < dayNum; i++) {
            var item = {
                day: i + 1,
                week: this.getWeekByDay(years, month, i),
            };
            dayArr.push(item);
        }
        this.headers = dayArr;
    },
    methods: {
        getMonthDays(year, month) {
            var thisDate = new Date(year, month, 0); //当天数为0 js自动处理为上一月的最后一天
            return thisDate.getDate();
        },
        getWeekByDay(year, month, day) {
            var thisDate = new Date(year, month, day);
            var today = new Array("日", "一", "二", "三", "四", "五", "六");
            return today[thisDate.getDay()];
        },
        changeShift(event, index, type, rowIndex) {
            this.popoverOption = {
                index,
                type,
                rowIndex,
            };
            let child = event.target.getBoundingClientRect();
            let main = this.$refs["scheduling-main"];
            let parent = main.getBoundingClientRect();
            this.popoverTop =
                child.top + child.height + main.offsetTop - parent.top;
            this.popoverLeft = child.left + main.offsetLeft - parent.left;
            this.showPopover = true;
        },
        popoverHide() {
            this.showPopover = false;
            this.popoverOption = {};
        },
        bodyClosePopover(e) {
            if (!this.$refs["scheduling-main"].contains(e.target)) {
                this.popoverHide();
            }
        },
        format(index, val) {
            let name = "";
            if (val.shifts && val.shifts[index]) {
                let str = val.shifts[index].name;
                if (str.length <= 2) {
                    name = str;
                } else {
                    name = str.substring(0, 2) + "<br>" + str.substring(2, 4);
                }
                if (val.shifts[index].new) {
                    name = name + "<i></i>";
                }
            }
            return name;
        },
        setShift(setType) {
            let { index, type, rowIndex } = this.popoverOption;
            let val =
                setType == "clear"
                    ? undefined
                    : { name: "动态添加", new: true };
            if (type == "header") {
                this.tableData.forEach((item) => {
                    this.$set(item.shifts, index, val);
                });
            } else {
                this.$set(this.tableData[rowIndex].shifts, index, val);
            }
            this.popoverHide();
        },
        setShifts() {
            let shifts = [
                {
                    name: "工作",
                    new: true,
                },
                {
                    name: "工作",
                    new: true,
                },
                {
                    name: "休息",
                    new: true,
                },
            ];
            let { index, rowIndex } = this.popoverOption;
            for (let i = 0; i < this.headers.length - index; i++) {
                let dataIndex = i % shifts.length;
                this.$set(
                    this.tableData[rowIndex].shifts,
                    index + i,
                    shifts[dataIndex]
                );
            }
            this.popoverHide();
        },
    },
    mounted() {
        document.addEventListener("click", this.bodyClosePopover);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.bodyClosePopover);
    },
};
</script>

<style lang="scss" scoped>
.app-container {
    position: relative;
    .popover {
        position: absolute;
        z-index: 9999;
        padding: 12px;
        background-color: #fff;
        border-radius: 4px;
        border: 1px #bfbfbf;
        // box-shadow: 0 2px 4px rgb(31 35 41 / 12%);
        width: 228px;
        .arrow {
            position: absolute;
            top: -10px;
            left: 14px;
            color: #048790;
        }
        .popover-main {
            .scheduling-list {
                .title {
                    color: rgba(0, 0, 0, 0.43);
                    margin-top: 15px;
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                }
                ul {
                    li {
                        height: 32px;
                        background: #048790;
                        color: #fff;
                        text-align: center;
                        line-height: 32px;
                        font-size: 14px;
                        border-radius: 4px;
                        margin-top: 10px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    ::v-deep .clickable {
        padding: 0px;
        .cell {
            padding: 0px;
            height: 44px;
            line-height: normal;
            .table-header,
            .table-row {
                cursor: pointer;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                i {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-top: 7px solid red;
                    border-left: 7px solid transparent;
                }
            }
            .table-header {
                flex-direction: column;
                font-weight: normal;
            }
        }
    }
}
</style>
