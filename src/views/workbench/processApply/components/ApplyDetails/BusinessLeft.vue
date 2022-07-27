<template>
<!-- 出差申请独立左边 -->
    <div>
        <el-descriptions
            :column="1"
            border
            v-for="(item, index) in config"
            :key="index"
        >
            <el-descriptions-item
                v-if="item.validate == undefined"
                :label="`${item.title}${
                    item !== undefined
                        ? item.title.includes('时长')
                            ? '(小时)'
                            : ''
                        : ''
                }`"
            >
                {{ flow_var[item.field] }}
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
            <el-descriptions-item label="同行人"> </el-descriptions-item>
        </el-descriptions>
    </div>
</template>
<script>
export default {
    name: "ApplyDetails",
    data() {
        return {
            data: [],
            PeerUser:[]
        };
    },
    props: {
        config: {
            type: Array,
            default: () => [],
        },
        flow_var: {
            type: Object,
            default: () => {},
        },
    },
    created() {
        this.BusinessDate()
    },
    methods: {
        BusinessDate() {
            let arr = Object.keys(this.flow_var);
            // console.log(this.data)
            // this.PeerUser = arr.

        }
    },
};
</script>
