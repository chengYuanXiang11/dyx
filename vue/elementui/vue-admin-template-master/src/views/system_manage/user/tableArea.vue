<template>
  <div class="listTemplateTable">
    <el-table
      ref="singleTable"
      border
      :data="orgState.tableListTree"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%"
    >
      <el-table-column property="label" label="名称"></el-table-column>
      <el-table-column property="id" label="id"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button type="info" size="mini">
              <i class="el-icon-setting"></i>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCurrentChange(scope.row)">修改</el-dropdown-item>
              <el-dropdown-item @click.native="del(scope.row.id,scope.$index)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      orgState: (state) => state.Organization,
    }),
  },
  filters: {},
  methods: {
    //修改
    handleCurrentChange(val) {
      this.$emit("upDate", val.id);
    },
    //删除
    del(id, index) {
      this.$emit("deleteEvent", { data: { id, index } });
    },
  },
};
</script>