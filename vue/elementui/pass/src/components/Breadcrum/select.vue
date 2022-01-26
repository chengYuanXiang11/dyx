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
export default {
    name: "Province",
    data() {
        return {
            province: this.value,
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level } = node;
                    console.log(level)
                    setTimeout(() => {
                        const nodes = Array.from({ length: level + 1 })
                .map((v,k) => {
                    console.log(v,k);
                    return {
                  value: ++k,
                  label: `选项${k}`,
                  leaf: level >= 2
                }
                });
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
                      
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