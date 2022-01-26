<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    @search="handleQuery"
    @pagination="handlePagination"
    @reset="handleReset"
  >
    <el-table v-loading="loading" :data="tableData" border height="100%">
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
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
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
            >完成修复</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </Table-page>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      tableData: [
        {
          failureTime: "2016-05-02",
          repairTime: "2016-05-02",
          statue: "待修复",
          name: "北一门",
          type: "摄像头",
          person: "张三",
          code: "E6551SC15",
        },
      ],
      search: {
        total: 10,
        pageNum: 1,
        pageSize: 20,
        form: [
          {
            name: "faultType",
            label: "故障类型",
            type: "select",
          },
          {
            name: "faultCode",
            label: "设备编码",
            type: "input",
          },
          {
            name: "person",
            label: "负责人",
            type: "input",
              props:{
              disable:true
            }
          },
          {
            name: "failureTime",
            label: "故障时间",
            type: "input",
          },
          {
            name: "repairTime",
            label: "修复时间",
            type: "input",
          },
          {
            name: "status",
            label: "状态",
            type: "select",
            options: [
              {
                label: "全部",
                value: "all",
              },
              {
                label: "待修复",
                value: "1",
              },
              {
                label: "未修复",
                value: "2",
              },
              {
                label: "已修复",
                value: "3",
              },
            ],
          },
        ],
      },
      queryParams: {},
    };
  },

  created() {
    this.getList();
  },
  methods: {
    // 数据请求
    getList() {
        console.log(this.queryFormat(this.queryParams, this.search))
      //   this.loading = true;
      //   getList(this.this.queryFormat(this.queryParams, this.search))
      //     .then((res) => {
      //       this.tableData = res.data.results;
      //       this.search.total = res.data.count;
      this.$success("请求");
      //     })
      //     .finally((err) => {
      this.loading = false;
      //     });
    },
    // 分页
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.search.pageSize = e.pageSize;
      this.getList();
    },
    // 重置
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

    CompleteRepair(id) {
      this.$confirm("是否确认此设备已被修复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$success("修改成功！");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;

  .text-Sty {
    font-size: 15px;
    color: #909399;
    margin-left: 4px;
  }
}
</style>

