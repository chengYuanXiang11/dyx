<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    :showLimit="5"
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
        prop="create_datetime"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="修复时间"
        prop="update_datetime"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="负责人" prop="principal" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="状态" prop="state" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '1'" type="danger">未修复</el-tag>
          <el-tag v-else-if="scope.row.state === '2'" type="warning"
            >待修复</el-tag
          >
          <el-tag v-else type="success">已修复</el-tag>
        </template>
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
import { getListAll } from "@/request/api/lot/device/index";
import { getList, putList } from "@/request/api/lot/device/record";
export default {
  data() {
    return {
      dialogVisible: false,
      goods: [],
      showSearch: true,
      loading: true,
      tableData: [
        {
          id: 0,
          code: "string",
          name: "string",
          type: "string",
          errortype: "[1, 2]",
          create_datetime: "2021-11-15T04:30:24.499Z",
          update_datetime: "2021-11-15T04:30:24.499Z",
          principal: 0,
          state: "1",
        },
      ],
      tableHeader: [],
      search: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        form: [
          {
            name: "errortype",
            label: "故障类型",
            type: "select",
            options: [
              {
                label: "设备离线",
                value: "1",
              },
            ],
          },
          {
            name: "code__icontains",
            label: "设备编码",
            type: "input",
          },
          {
            name: "type",
            label: "设备类型",
            type: "cascader",
            props: {
              value: "id",
              label: "type_name",
              children: "next_info",
            },
          },
          {
            name: "principal__icontain",
            label: "负责人",
            type: "input",
          },
          {
            name: "state",
            label: "状态",
            type: "select",
            options: [
              {
                label: "未修复",
                value: "1",
              },
              {
                label: "待修复",
                value: "2",
              },
              {
                label: "已完成",
                value: "3",
              },
            ],
          },
          {
            name: "create_datetime",
            label: "故障时间",
            type: "datetime",
          },
          {
            name: "update_datetime",
            label: "修复时间",
            type: "datetime",
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
    // 获取设备类型
    getListAll({ pageNum:"all" }).then((res) => {
      let data = res.data.results.filter((v) => {
        if (v.parentId === null) {
          if (v.next_info.length === 0) {
            Reflect.deleteProperty(v, "next_info");
          }
          return true;
        }
      }).map((v) => {
                    if (!v.next_info) {
                      v.disabled =true;
                    }
                    return v
                  });
      this.$set(
        this.search.form[2],
        "options",
        JSON.parse(JSON.stringify(data))
      );
    });
  },
  methods: {
    CompleteRepair(id) {
      this.$confirm("是否确认此设备已被修复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        putList(id, { state: "3" })
          .then((res) => {
            this.$success("修改成功！");
            this.getList();
            this.loading = false;
          })
          .finally((err) => {
            this.loading = false;
          });
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
      this.loading = true;
      let data = this.queryFormat(this.queryParams, this.search);
      if(data.type){
        data.type = data.type[data.type.length-1]
      }
      getList(data)
        .then((res) => {
          this.tableData = res.data.results;
          this.search.total = res.data.count;
        })
        .finally((err) => {
          this.loading = false;
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

