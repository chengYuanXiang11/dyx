<template>
    <div class="time-duration">
        <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="countTime"
        >
        </el-date-picker>
        <div class="count">时长：{{ duration }}</div>
    </div>
</template>

<script>
export default {
    name: "time-duration",
    data() {
        return {
            date: this.value,
            duration: "",
        };
    },
    props: {
        value: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    watch: {
        value(newVal) {
            this.leaveType = newVal;
        },
        date(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        countTime(e) {
            let res = "";
            if (Array.isArray(e)) {
                const [start, end] = e
                    .slice(0, 2)
                    .map((c) => new Date(c).getTime());
                res = this.timeCalculate(start, end);
            }
            this.duration = res;
        },
        timeCalculate(start, end) {
            const label = ["分钟", "小时", "天", "月", "年"];
            const unit = [60, 60, 24, 30, 12];
            let restTime = Math.floor((end - start) / 1000);
            let res = "";
            for (let i = 0, len = unit.length; i < len; i++) {
                const pos = len - i; // 从年开始算，分钟换算成年 === Math.pow(60, 4)
                const temp = unit.slice(0, pos).reduce((p, c) => p * c, 1);
                const time = Math.floor(restTime / temp);
                time > 0 && (res += time + label[pos - 1]);
                restTime -= time * temp;
            }
            return res;
        },
    },
};
</script>

<style lang="scss" scoped>
.time-duration{
    .count{
        color: #666;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }
}
</style>