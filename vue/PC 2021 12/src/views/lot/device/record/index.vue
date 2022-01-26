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
      dialogVisible: false,
      goods: [],
      showSearch: true,
      loading: true,
      btnLoading: false,
      total: 0,
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
      tableHeader: [],
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
            name: "faultName",
            label: "负责人",
            type: "input",
          },
          {
            name: "faultCode",
            label: "状态",
            type: "select",
          },
          {
            name: "faultCode",
            label: "故障时间",
            type: "input",
          },
          {
            name: "faultCode",
            label: "修复时间",
            type: "input",
          },
        ],
      },
      queryParams: {},
      showDrawer: false,
      drawerType: "",
      itemId: undefined,
      form: {
        goods: [],
        confim: "",
      },
      rules: {
        rulesName: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        goods: [{ required: true, message: "请选择商品", trigger: "change" }],
      },
      servicesCost: [],
      messageList: [],
    };
  },

  created() {
    this.getList();
  },
  methods: {
    CompleteRepair(id) {
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
    formatterName(val) {
      // return (JSON.parse(val).map(item => { return item.name })).join('、')
      return val.join(",");
    },
    formatServicesType(id, row) {
      let obj = row.find((item) => item.servicesTypeId == id);
      return obj.price;
    },
    saveDialog(num) {
      this.form.confim = num;
      this.dialogVisible = false;
    },
    /** 搜索按钮操作 */
    handleQuery(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    getList() {
      let _this = this;
      this.loading = false;
      // getList(this.queryFormat(this.queryParams, this.search))
      //   .then((response) => {
      //     this.tableData = response.data.results.body;
      //     this.search.total = response.data.count;
      //     _this.$nextTick(function () {
      //       _this.tableHeader = response.data.results.headers;
      //       // console.log(_this.tableHeader);
      //     });
      //   })
      //   .finally((error) => {
      //     this.loading = false;
      //   });
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

