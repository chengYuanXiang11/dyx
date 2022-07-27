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
      <el-radio-group v-model="search.lotLocation" @change="tabsTodo">
        <el-radio-button :label="m.val" v-for="(m, i) in tabsList" :key="i">
          {{ m.name }}
        </el-radio-button>
      </el-radio-group>
    </template>

    <el-table v-loading="loading" :data="tableData" border height="100%">
      <el-table-column
        label="商位编码"
        align="center"
        prop="code"
        show-overflow-tooltip
      />
      <el-table-column
        label="位置"
        align="center"
        prop="code"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="当前商户"
        align="center"
        prop="now_merchant"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="设备数量(个)"
        align="center"
        prop="device_count"
        show-overflow-tooltip
      >
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
            icon="el-icon-document-checked"
            @click="operation('view', scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-connection"
            @click="operation('edit', scope.row)"
            >关联设备</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Drawer
      :visible.sync="showDrawer"
      :title="drawerType == 'view' ? '查看' : '关联设备'"
      :loading="btnLoading"
      :size="600"
      element-loading-text="拼命加载中，请稍后..."
      @confirm="confirmForm"
      @close="drawerClosed"
      @cancel="drawerClosed"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商位编码" prop="code">
          <el-input
            disabled
            v-model="form.code"
            placeholder="请输入费用名称"
          ></el-input>
        </el-form-item>

        <el-card
          class="box-card"
          v-for="(item, index) in form.device_detail"
          :key="index"
        >
          <div slot="header" class="clearfix">
            <span>设备{{ index + 1 }}</span>
            <el-button
              style="float: right"
              size="mini"
              type="danger"
              plain
              class="el-icon-delete"
              v-if="drawerType == 'edit'"
              @click.prevent="deleteItem(index)"
            ></el-button>
          </div>
          <div>
            <el-form-item
              :prop="'device_detail.' + index + '.equipmentType'"
              :label="'设备类型'"
              :rules="[{ required: true, message: '设备类型不能为空' }]"
              ref="'device_detail.' + index + '.equipmentType'"
            >
              <el-cascader
                :disabled="drawerType == 'edit' ? false : true"
                v-model="item.equipmentType"
                :options="equipmentTypeOptions"
                :props="typeProps"
              ></el-cascader>
            </el-form-item>

            <el-form-item
              :prop="'device_detail.' + index + '.equipmentName'"
              :label="'选择设备'"
              :rules="[{ required: true, message: '设备不能为空' }]"
            >
              <el-select
                v-model="item.equipmentName"
                v-if="drawerType == 'edit'"
                filterable
                remote
                reserve-keyword
                value-key="id"
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
              >
                <el-option
                  v-for="items in equipmentOptions"
                  :key="items.id"
                  :label="`${items.device_name}`"
                  :value="items"
                >
                </el-option>
              </el-select>
              <el-input
                disabled
                v-else
                placeholder="请输入数字"
                v-model.number="item.equipmentName.device_name"
                class="input-with-select"
                min="0"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-card>
        <div class="add-title">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="addObj"
            v-if="drawerType == 'edit'"
            >添加设备</el-button
          >
        </div>
      </el-form>
    </Drawer>
  </Table-page>
</template>

<script>
// 关联设备
import {
  getList,
  putList,
  getListAll,
} from "@/request/api/lot/device/associated";
// 设备管理
import { getList as deviceList } from "@/request/api/lot/device/index";

//获取区域建筑楼层
import {
  getArea,
  getBuilding,
  getFloor,
} from "@/request/api/market/merchantsMgmt/leaseManageAdd";
export default {
  data() {
    return {
      tabsList: [
        { name: "商铺", val: "商铺" },
        { name: "仓库", val: "仓库" },
        { name: "宿舍", val: "宿舍" },
      ],
      form: {
        // 商位编码
        code: "",
        // 默认有一个
        device_detail: [{ equipmentName: {}, equipmentType: [] }],
      },
      search: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        lotLocation: "商铺",
        form: [
          {
            label: "商位编码",
            name: "code__icontains",
            type: "input",
          },
          {
            label: "区域",
            name: "code__icontains",
            type: "select",
          },
          {
            label: "建筑",
            name: "code__icontains",
            type: "select",
          },
          {
            label: "楼层",
            name: "code__icontains",
            type: "select",
          },
        ],
      },
      queryParams: {},
      // 设备列表
      equipmentOptions: [],
      equipmentTypeOptions: [],
      typeProps: {
        label: "type_name",
        value: "id",
        children: "next_info",
      },
      // 表格loding
      loading: false,
      // 表格数据
      tableData: [],
      // 弹窗显隐
      showDrawer: false,
      // 弹窗loding
      btnLoading: false,
      // 当前类型
      drawerType: "",
      // 区域 楼层 建筑信息
      areaOptions: [],
      buildingOptions: [],
      floorOptions: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 切换tabs
    tabsTodo(val) {
      this.getList();
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
    // 添加情况
    addObj() {
      this.form.device_detail.push({});
    },

    // 请求
    getList() {
      this.loading = true;
      getList(
        Object.assign(
          { type: this.search.lotLocation },
          this.queryFormat(this.queryParams, this.search)
        )
      )
        .then((res) => {
          this.tableData = res.data.results;
          this.search.total = res.data.count;
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    // 删除情况
    deleteItem(index) {
      this.form.device_detail.splice(index, 1);
    },
    // 选择设备的远程搜索
    remoteMethod(query) {
      if (query !== "") {
        deviceList().then((res) => {
          this.equipmentOptions = res.data.results;
        });
      } else {
        this.equipmentOptions = [];
      }
    },
    // 打开弹窗
    operation(type, row) {
      this.drawerType = type;
      this.form = JSON.parse(JSON.stringify(row));
      this.loading = true;
      let arr = [getListAll(), deviceList()];
      // 设备类型请求后再打开
      Promise.all(arr)
        .then((res) => {
          let [type, equipment] = res;
          this.equipmentTypeOptions = type.data.results.filter((v) => {
            if (v.parentId === null) {
              if (v.next_info.length === 0) {
                Reflect.deleteProperty(v, "next_info");
              }
              return true;
            }
          });
          this.equipmentOptions = equipment.data.results;
          this.showDrawer = true;
        })
        .finally((err) => {
          this.loading = false;
        });
    },
    // 关闭弹窗
    drawerClosed() {
      this.$refs["form"].resetFields();
    },
    // 提交表单
    confirmForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          putList(this.form.id, this.form)
            .then((res) => {
              this.showDrawer = false;
              this.$success("新增成功！");
              this.getList();
            })
            .finally((error) => {
              this.btnLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .table-main {
  margin-top: 0px !important;
}
.box-card {
  margin: 6px 0;
  .input-with-select {
    width: 216px;
  }
}
</style>

