<template>
    <!-- 左边申请详情 -->
    <div>
        <!-- 单个数据 如请假申请/加班 -->
        <div v-if="!group">
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
        </div>

        <!-- 组数据 如出差申请 -->
        <div v-if="group">
            <div v-for="(amount, amountIndex) in groupArr" :key="amountIndex">
                <el-descriptions :column="1" border>
                    <el-descriptions-item
                        :label="`${type}${
                            groupArr.length > 0 ? amountIndex : ''
                        }`"
                    >
                    </el-descriptions-item>
                </el-descriptions>
                <el-descriptions
                    :column="1"
                    border
                    v-for="(item, index) in config"
                    :key="index"
                >
                    <el-descriptions-item
                        :label="`${item.title}${
                            item !== undefined
                                ? item.title.includes('时长')
                                    ? '(小时)'
                                    : ''
                                : ''
                        }`"
                    >
                        {{
                            groupValue(
                                flow_var[`value${amountIndex}`][item.field]
                            )
                        }}
                        <!-- {{ flow_var[][item.field] }} -->
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <el-descriptions
                :column="1"
                border
                v-for="(grouItem, groupIndex) in groupTitle"
                :key="`${groupIndex}groupIndex`"
            >
                <el-descriptions-item
                    :label="`${grouItem.title}${
                        grouItem !== undefined
                            ? grouItem.title.includes('时长')
                                ? '(小时)'
                                : ''
                            : ''
                    }`"
                >
                    {{ groupValue(grouItem.value) }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>
<script>
export default {
    name: "ApplyDetails",
    data() {
        return {
            data: [],
            PeerUser: [],
            groupTitle: [],
            groupArray: [],
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
        group: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "",
        },
    },
    created() {
        this.BusinessDate();
    },
    methods: {
        BusinessDate() {
            if (this.group) {
                let examine_id = this.$route.query.examine_id;
                let arr = Object.keys(this.flow_var);
                console.log(this.flow_var);
                this.groupArr = arr.filter((v) => v.indexOf("value") >= 0);
                switch (examine_id) {
                    case "24":
                        this.groupTitle = [
                            {
                                field: "peerUsers",
                                title: "同行人",
                                value: this.flow_var["peerUsers"],
                            },
                        ];
                        break;
                }
            }
        },
        groupValue(value) {
            if (Array.isArray(value)) {
                let str = value.join("");
                if (str.includes("[object Object]")) {
                    // console.log(value)
                    str = "";
                    value.forEach((v) => {
                        str += v.user_name;
                        str += ",";
                    });
                    return str;
                } else {
                    return str;
                }
            } else {
                return value;
            }
        },
    },
};
</script>
