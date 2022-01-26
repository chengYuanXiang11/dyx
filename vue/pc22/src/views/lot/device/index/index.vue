<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    :showLimit="4"
    @search="handleQuery"
    @pagination="handlePagination"
    @reset="handleReset"
  >
    <template slot="action-bar">
      <div class="box">
        <el-button type="primary" icon="el-icon-plus" @click="operation('add')"
          >新建</el-button
        >
        <el-button type="info" icon="el-icon-upload2" @click="importEx"
          >导入</el-button
        >
        <el-button type="warning" icon="el-icon-download">导出</el-button>
        <el-button type="danger" icon="el-icon-switch-button" @click="stopAll"
          >一键停用</el-button
        >
      </div>
    </template>

    <el-table
      :border="true"
      v-loading="loading"
      :data="tableData"
      class="yg-table"
      ref="multipleTable"
      height="100%"
      row-key="id"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      @selection-change="changeData"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        align="center"
      ></el-table-column>
      <el-table-column label="设备编码" align="center" prop="device_code" />
      <el-table-column label="设备名称" align="center" prop="device_name" />
      <el-table-column label="设备类型" align="center" prop="device_brand" />
      <el-table-column label="生产日期" align="center" prop="production_date" />
      <el-table-column label="有效期" align="center" prop="shelf_date" />
      <el-table-column label="设备来源" align="center" prop="mobile">
        <template slot-scope="scope">
          {{ scope.row.device_belong === "1" ? "市场设备" : "商户设备" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#048790"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="2"
            @change="changeState($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-document-checked"
            @click="operation('view', scope.row)"
            >查看</el-button
          >
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="operation('edit', scope.row)"
            >编辑</el-button
          >
          <el-button type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Drawer
      :visible.sync="open"
      :title="formatType(typeTrawer)"
      :showFooter="typeTrawer !== 'view'"
      v-loading="btnLoading"
      :size="600"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
      @confirm="submitForm"
      @close="close"
    >
      <el-form
        ref="rulesform"
        :rules="rulesform"
        :model="form"
        label-width="120px"
        :disabled="typeTrawer == 'view'"
      >
        <el-form-item label="设备所属" prop="device_belong">
          <el-radio-group v-model="form.device_belong">
            <el-radio label="1">市场设备</el-radio>
            <el-radio label="2">商户设备</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input
            v-model="form.device_name"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <DeviceType v-model="form.device_type"></DeviceType>
        </el-form-item>
        <el-form-item label="设备编码" prop="device_code">
          <el-input
            v-model="form.device_code"
            placeholder="请输入设备编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备品牌">
          <el-select v-model="form.device_brand" placeholder="请选择设备品牌">
            <el-option
              v-for="item in device_brand_option"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="form.production_date"
            type="date"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="保质期至">
          <el-date-picker
            v-model="form.shelf_date"
            type="date"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="所属配置">
          <el-cascader
            v-model="form.device_instance"
            ref="device_instance"
            :options="device_instance_options"
            :props="device_instance_props"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            v-model="form.ip_address"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="端口号">
          <el-input-number
            v-model="form.port"
            :controls="false"
            placeholder="请输入端口号"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="令牌">
          <el-input v-model="form.Token" placeholder="请输入设令牌"></el-input>
        </el-form-item>
        <el-form-item label="其他参数">
          <el-input
            v-model="form.other_parameters"
            placeholder="请输入其他参数"
          ></el-input>
        </el-form-item>
        <el-form-item label="故障提醒">
          <el-radio-group v-model="form.fault_reminder">
            <el-radio-button label="1">打开</el-radio-button>
            <el-radio-button label="0">关闭</el-radio-button>
          </el-radio-group>
          <div class="tips">
            当设备发生故障时，通知关联的负责人；负责人在设备类型中设置
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </Drawer>
  </Table-page>
</template>

<script>
// 设备管理
import {
  getList,
  addRow,
  updateRow,
  delRow,
  exampleList,
  stopRow,
} from "@/request/api/lot/device/index";
import { getDicts } from "@/request/api/common";
import DeviceType from "./DeviceType.vue";
export default {
  data() {
    return {
      open: false,
      loading: false,
      btnLoading: false,
      tableData: [{ id: 1, mobile: 666 }],
      search: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        form: [
          {
            label: "设备名称",
            name: "device_name__icontains",
            type: "input",
          },
          {
            label: "设备编码",
            name: "device_code__icontains",
            type: "input",
          },
          {
            label: "设备来源",
            name: "device_belong",
            type: "select",
            placeholder: "请选择设备来源",
            options: [
              {
                label: "市场设备",
                value: "1",
              },
              {
                label: "商户设备",
                value: "2",
              },
            ],
          },
          {
            label: "有效期",
            name: "shelf_date",
            type: "unlinkdaterange",
          },
          {
            label: "状态",
            name: "state",
            type: "select",
            options: [
              {
                label: "全部",
                value: " ",
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
        device_belong: "1",
        fault_reminder: 1,
        state: "1",
      },
      rulesform: {
        device_belong: [
          { required: true, message: "请选择设备所属", trigger: "change" },
        ],
        device_code: [
          { required: true, message: "请输入设备编码", trigger: "change" },
        ],
      },
      // 新建还是编辑
      typeTrawer: "",
      // 选中的数据
      multipleSelection: [],
      // 设备品牌
      device_brand_option: [],
      device_instance_options: [],
      device_instance_props: {
        label: "name",
        value: "id",
        children: "device_list",
      },
      timer: null,
    };
  },
  created() {
    this.getList();
  },
  components: { DeviceType },
  methods: {
    // 状态变化
    changeState(e, row) {
      if (e == 2) {
        row.state = "1";
        this.$confirm(`是否停用设备 ${row.device_name} ？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then((res) => {
          row.state = "2";
          updateRow(row.id, row).then((res) => {
            this.$success("已成功停用");
          });
        });
      } else {
        updateRow(row.id, row).then((res) => {
          this.$success("开启成功");
        });
      }
    },
    // 选中数据变化
    changeData(e) {
      this.multipleSelection = e;
    },

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
      this.$refs.multipleTable.toggleAllSelection(false);
    },
    formatType(type) {
      if (type == "add") return "新建";
      if (type == "edit") return "编辑";
      if (type == "view") return "详情";
    },
    submitForm() {
      this.$refs.rulesform.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          switch (this.typeTrawer) {
            case "add":
              addRow(this.form).then((res) => {
                this.$success("添加成功");
                this.btnLoading = false;
                this.open = false;
                this.getList();
              });
              break;
            case "edit":
              updateRow(this.form.id, this.form)
                .then((res) => {
                  this.$success("修改成功");
                  this.btnLoading = false;
                  this.open = false;
                  this.getList();
                })
                .catch((err) => {
                  this.$error("修改失败");
                });
              break;
          }
        } else {
        }
      });
    },
    // 删除
    del(row) {
      this.$confirm(`是否删除设备 ${row.device_name} ?`, "提示", {
        type: "warning",
      })
        .then((res) => {
          delRow(row.id).then((res) => {
            this.$success("删除成功");
            this.getList();
          });
        })
        .catch((_) => {
          this.$error("取消操作");
        });
    },
    // 一键停用
    stopAll() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("是否停用所有勾选的设备?", "提示", {
          type: "warning",
        }).then(() => {
          this.loading = true;
          stopRow({ stop_list: this.multipleSelection.map((v) => v.id) })
            .then((res) => {
              this.$success("已成功停用");
              this.getList();
              this.$refs.multipleTable.clearSelection();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      } else {
        this.$info("请先勾选设备");
      }
    },
    importEx() {
      this.$router.push({
        path: `/importEquipment`,
      });
    },
    getList() {
      this.loading = true;
      let data = this.queryFormat(this.queryParams, this.search);
      if (data.shelf_date) {
        data.production_date__icontains = new Date(data.shelf_date[0]);
        data.shelf_date__icontains = new Date(data.shelf_date[1]);
        Reflect.deleteProperty(data, "shelf_date");
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
    operation(type, row) {
      this.loading = true;
      this.typeTrawer = type;
      if (type !== "add") {
        this.form = JSON.parse(JSON.stringify(row));
      }
      // 获取设备品牌
      Promise.all([exampleList(), getDicts("equipmentBrand")])
        .then((res) => {
          let [instance, brand] = res;
          this.device_instance_options = instance.data.flat().map((v) => {
            v.name = v.control_name;
            v.id = v.control_id;
            return v;
          });
          brand.data.forEach((v) => (v.value = v.label));
          this.device_brand_option = res.data;
          this.open = true;
        })
        .catch((err) => {
          this.open = false;
        })
        .finally((err) => {
          this.loading = false;
        });
    },
    close() {
      this.form = {
        device_belong: "1",
        fault_reminder: 1,
        state: "1",
      };
      this.$refs["rulesform"].resetFields();
      this.open = false;
    },
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

