<template>
  <div class="box">
    <div class="father-box">
      <div class="tree-content">
        <el-tree
          :data="treeDataVuex"
          :props="defaultProps"
          accordion
          ref="orgTree"
          node-key="id"
          @node-click="handleNodeClick"
          highlight-current>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        isShowCheckbox: false,
        checkedId: ''
    }
  },
  computed: {
    ...mapGetters([
      'treeDataVuex'
    ])
  },
  created () {
    if(this.$route.path === '/user') {
      this.isShowCheckbox = true
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$emit("getTableData", data.id)
      this.$emit("selectParentId",data)
    },

  }
}
</script>
<style lang="scss" scoped>
  .tree-content /deep/.el-tree {
    border: 1px solid #ebeef5;
  }

</style>
