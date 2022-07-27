<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    label-widht="70px"
    @search="handleQuery"
    @pagination="handlePagination"
    @reset="handleReset"
  >
    <template slot="action-bar">
      <div class="box">
        <el-button type="danger" icon="el-icon-download" @click="CompleteRepair"
          >一键拉闸</el-button
        >
        <el-button type="warning" icon="el-icon-upload2" @click="CompleteRepair"
          >一键合闸</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-switch-button"
          @click="CompleteRepair"
          >一键保电</el-button
        >
        <el-button
          type="success"
          icon="el-icon-magic-stick"
          @click="CompleteRepair"
          >一键接触保电</el-button
        >
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="100%"
      row-key="id"
      @selection-change="changeData"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true">
      </el-table-column>
      <el-table-column label="设备编码" prop="code" show-overflow-tooltip />
      <el-table-column label="设备名称" prop="name" show-overflow-tooltip>
      </el-table-column>
      />
      <el-table-column label="设备类型" prop="type" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="故障时间"
        prop="failureTime"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="修复时间" prop="repairTime" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="负责人" prop="person" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="状态" prop="statue" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="CompleteRepair(scope.row.id)"
            >拉闸</el-button
          >
          <el-button size="mini" type="text" @click="switchOff(scope.row.id)"
            >保电</el-button
          >
          <el-button size="mini" type="text" @click="switchOff(scope.row.id)"
            >接触保电</el-button
          >
          <el-button size="mini" type="text" @click="switchOff(scope.row.id)"
            >合闸</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </Table-page>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      search: {
        total: 10,
        pageNum: 1,
        pageSize: 20,
        form: [
          {
            name: "faultType",
            label: "商户名称",
            type: "select",
          },
          {
            name: "faultCode",
            label: "商位编码",
            type: "input",
          },
          {
            name: "faultName",
            label: "设备名称",
            type: "input",
          },
          {
            name: "faultCode",
            label: "状态",
            type: "select",
          },
          {
            name: "faultCode",
            label: "所在区域",
            type: "input",
          },
          {
            name: "faultCode",
            label: "所在建筑",
            type: "input",
          },
          {
            name: "faultCode",
            label: "所在楼层",
            type: "input",
          },
        ],
      },
      queryParams: {},
      // 已选中的数据
      multipleSelection: [],
    };
  },

  created() {
    this.getList();
  },
  methods: {
    CompleteRepair(id) {
      if ((this.multipleSelection.length = 0)) {
        this.$info("请先勾选电表");
      } else {
        this.$confirm("是否确认此设备已被修复?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // delRow(id).then((res) => {
          this.$success("修改成功！");
          //   self.getList();
          // });
        });
      }
    },
    // 分页
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.search.pageSize = e.pageSize;
      this.getList();
    },
    handleReset(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$success("触发请求");
      console.log(this.queryFormat(this.queryParams, this.search));
      this.loading = false;
    },
    // 选中数据变化
    changeData(e) {
      this.multipleSelection = e;
    },
    switchOff() {
      this.$success("拉闸");
      console.log(this.multipleSelection);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

