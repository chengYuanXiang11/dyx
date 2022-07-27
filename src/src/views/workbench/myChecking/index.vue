<template>
    <div class="app-container">
        <el-calendar v-model="value">
            <template slot="dateCell" slot-scope="data">
                <div :class="data.isSelected ? 'is-selected' : ''">
                    {{ formatDate(data) }}
                </div>
                <div :class="['content times',addClass(data)]">上班：09:12</div>
                <div class="content success times">下班：18:32</div>
                <div class="content success" v-if="formatDate(data) % 2 == 0">已请假</div>
                <div class="content error" v-else>迟到0小时12分</div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
export default {
    name: "Mychecking",
    data() {
        return {
            value: new Date(),
        };
    },
    methods: {
        formatDate(data) {
            let { date } = data;
            return date.getDate()
        },
        addClass(data){
            let { date } = data;
            return date.getDate()  % 2 != 0 ? 'error' : 'success'
        }
    },
    created() {
        console.log(this.$route);
    },
};
</script>

<style scoped lang="scss">
::v-deep .el-calendar-table .el-calendar-day {
    height: auto;
    .content {
        font-size: 12px;
        padding: 5px 10px;
        display: flex;
        align-items: center;
        &.success {
            color: #67c23a;
        }
        &.error {
            color: #f56c6c;
        }
        &.times {
            &::before {
                content: "";
                width: 6px;
                height: 6px;
                display: block;
                border-radius: 3px;
                margin-right: 5px;
            }
            &.success::before {
                background-color: #67c23a;
            }
            &.error::before {
                background-color: #f56c6c;
            }
        }
    }
}
</style>

