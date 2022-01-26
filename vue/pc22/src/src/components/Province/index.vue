<template>
    <el-cascader
        v-model="province"
        :props="props"
        @change="handleChange"
        ref="Province"
        placeholder="请选择省市区"
    ></el-cascader>
</template>

<script>
import { getProvince } from "@/request/api/common";
export default {
    name: "Province",
    data() {
        return {
            province: this.value,
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level, data } = node;
                    console.log(level)
                    setTimeout(() => {
                        if (level == 0) {
                            getProvince().then((res) => {
                                const nodes = res.data.map((value, i) => ({
                                    value: value.id,
                                    label: value.name,
                                    leaf: node.level >= 2,
                                }));
                                resolve(nodes);
                            });
                            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                        } else if (level >= 0 && level <= 2) {
                            getProvince(data.value).then((res) => {
                                const nodes = res.data.addinfo.map(
                                    (value, i) => ({
                                        value: value.id,
                                        label: value.name,
                                        leaf: node.level >= 2,
                                    })
                                );
                                resolve(nodes);
                            });
                        }
                    }, 100);
                },
            },
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
            this.province = newVal;
        },
        province(newVal) {
            console.log(newVal)
            this.$emit("input", newVal);
        },
    },
    methods: {
        handleChange(e) {
            this.$emit("input", e);
            this.getLabels();
        },
        getLabels(){
            let nodes = this.$refs["Province"].getCheckedNodes()[0];
            let labels = nodes.pathLabels;
            this.$emit("getLabels", labels);
        },
    },
};
</script>