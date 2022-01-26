<template>
  <div class="listTemplateOperator">
    <el-button type="primary" size="small" @click="addEvent">新增</el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "operatorArea",
  computed: {
    ...mapState({
      orgState: (state) => state.Organization,
    }),
  },
  data() {
    return {};
  },
  methods: {
    //打开新增窗
    addEvent() {
      this.orgState.dialogType = "新增机构";
      this.orgState.dialogShow = true;
      this.plugins.resetObjectValue(this.orgState.dialogForm);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
