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
    <template slot="action-bar">
      <div class="box">
        <el-button type="primary" @click="operation('add')">新建</el-button>
        <el-button type="primary" @click="importEx">导入</el-button>
        <el-button type="primary">导出</el-button>
        <el-button type="primary" @click="stopAll">一键停用</el-button>
      </div>
    </template>

    <el-table
      v-loading="loading"
      :data="tableData"
      class="yg-table"
      border
      height="100%"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="设备编码" prop="storeName" />
      <el-table-column label="设备名称" prop="merchantName" />
      <el-table-column label="设备类型" prop="mobile" />
      <el-table-column label="生产日期" prop="mobile" />
      <el-table-column label="有效期" prop="mobile" />
      <el-table-column label="设备来源" prop="mobile" />
      <el-table-column label="状态" prop="mobile">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.id"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="operation('view', scope.row.id)"
            >查看</el-button
          >
          <el-button type="text" @click="operation('edit', scope.row.id)"
            >编辑</el-button
          >
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Drawer
      :visible.sync="open"
      :title="formatType(typeTrawer)"
      :showFooter="typeTrawer !=='view'"
        v-loading="btnLoading"
      :size="600"
      element-loading-text="拼命加载中，请稍后..."
      @confirm="submitForm"
      @closed="closed"
      @cancel="closed"
    >
      <el-form
        ref="rulesform"
        :model="form"
        label-width="120px"
        :disabled="typeTrawer == 'view'"
      >
        <el-form-item label="设备所属">
          <el-radio-group v-model="form.radio">
            <el-radio label="市场设备"></el-radio>
            <el-radio label="商户设备"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="form.v1"></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="form.v2" placeholder="请选择设备类型">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="form.v3"></el-input>
        </el-form-item>
        <el-form-item label="设备品牌">
          <el-select v-model="form.v4" placeholder="请选择设备品牌">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="form.v5"
            type="date"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="保质期至">
          <el-date-picker
            v-model="form.v6"
            type="date"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="所属配置">
          <el-select v-model="form.v7" placeholder="请选择所属配置">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.v8"></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input-number
            v-model="form.v9"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.v10"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.v11"></el-input>
        </el-form-item>
        <el-form-item label="令牌">
          <el-input v-model="form.v12"></el-input>
        </el-form-item>
        <el-form-item label="其他参数">
          <el-input v-model="form.v13"></el-input>
        </el-form-item>
        <el-form-item label="故障提醒">
          <el-radio-group v-model="form.v14">
            <el-radio-button label="打开"></el-radio-button>
            <el-radio-button label="关闭"></el-radio-button>
          </el-radio-group>
          <div class="tips">
            当设备发生故障时，通知关联的负责人；负责人在设备类型中设置
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model="form.v15"></el-input>
        </el-form-item>
      </el-form>
    </Drawer>
  </Table-page>
</template>

<script>
import { getList } from "@/request/api/lot/waterpower/waterMeter";
export default {
  data() {
    return {
      open: false,
      loading: false,
      btnLoading: false,
      total: 0,
      tableData: [{ id: 1, mobile: 666 }],
      search: {
        total: 10,
        pageNum: 1,
        pageSize: 20,
        form: [
          {
            label: "设备名称",
            name: "deviceName",
            type: "input",
          },
          {
            label: "设备编码",
            name: "deviceCode",
            type: "input",
          },
          {
            label: "设备来源",
            name: "deviceSource",
            type: "input",
          },
          {
            label: "有效期",
            name: "devicetTimeValidity",
            type: "input",
          },
          {
            label: "状态",
            name: "deviceState",
            type: "select",
            options: [
              {
                label: "全部",
                value: 0,
              },
              {
                label: "正常",
                value: 1,
              },
              {
                label: "冻结",
                value: 2,
              },
            ],
          },
        ],
      },
      queryParams: {},
      form: {
        v1: "",
      },
      typeTrawer: "",
      rowId: "",
    };
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
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
    formatType(type) {
      if (type == "add") return "新建";
      if (type == "edit") return "编辑";
      if (type == "view") return "详情";
    },
    stopAll() {
      let _this = this;
      this.$confirm("是否停用当前设置?", "提示", {
        type: "warning",
      })
        .then((res) => {
          _this.$toast("操作成功");
        })
        .catch((_) => {
          _this.$message.info("取消操作");
        });
    },
    importEx() {
      this.$router.push({
        path: `/importEquipment`,
      });
    },
    getList(val) {
      let _this = this;
      this.loading = true;
      getList(_this.search)
        .then((response) => {
          _this.tableData = response.data.rows;
          _this.total = response.data.total;
        })
        .finally((error) => {
          _this.loading = false;
        });
    },
    operation(type, id) {
      this.typeTrawer = type;
      this.rowId = id;
      this.open = true;
    },
    submitForm() {
      this.$message.success("操作成功");
    },
    closed() {
      this.$refs["rulesform"].resetFields();

      this.open = false;
      // this.resetForm("form");
    },
  },
  created() {
    console.log(this.$route);
  },
};
</script>

<style scoped lang="scss">
.box {
  margin-bottom: 20px;
}
.tips {
  font-size: 12px;
  color: #606266;
}
</style>

