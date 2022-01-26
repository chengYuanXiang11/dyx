<template>
<div>
    <el-cascader
  v-show="!loading"
    v-bind="$attrs"
    v-on="$listeners"
    placeholder="请选择设备类型"
    v-model="dataValue"
    :props="props"
    ref="device_type"
    :options="projectOptions"
  >
  </el-cascader>
  <span  v-show="loading">加载中</span> 
</div>

</template>

<script>
// 设备类型
import {
  getList as typeList,
  getInfo as typeInfo,
} from "@/request/api/lot/device/type";
export default {
  name: "DeviceType",
  data() {
    return {
      projectOptions: [],
      loading:false,
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node;
          switch (level) {
            case 0:
              typeList()
                .then((res) => {
                  res.data.results.forEach((v) => {
                    if (v.nochild) {
                      v.leaf = true;
                      v.disabled =true;
                    }
                  });
                  resolve(res.data.results);
                })
                .catch((err) => {
                  this.$error("设备初始化失败");
                });
              break;
            case 1:
              typeInfo(node.data.id)
                .then((res) => {
                  res.data.next_info.forEach((v) => (v.leaf = true));
                  resolve(res.data.next_info);
                })
                .catch((err) => {
                  this.$error("设备初始化失败");
                });
              break;
          }
        },
        label: "type_name",
        value: "id",
      },
    };
  },
  props: {
    value: null,
  },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style scoped lang="scss">
</style>

