<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
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

    <el-table v-loading="loading" :data="tableData" border height="100%" :key="tableKey">
      <el-table-column label="商位编码" prop="code" show-overflow-tooltip />
      <el-table-column label="当前商户" prop="name" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="设备数量(个)" prop="num" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
          {{ formatterName(scope.row.goodsName) }}
        </template> -->
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
            @click="operation('view', scope.row.id)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="operation('edit', scope.row.id)"
            >关联设备</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Drawer
      :visible.sync="showDrawer"
      :title="drawerType == 'view' ? '查看' : '关联设备'"
      v-loading="btnLoading"
      :size="600"
      element-loading-text="拼命加载中，请稍后..."
      @confirm="confirmForm"
      @closed="drawerClosed"
      @cancel="drawerClosed"
    >
      <el-form ref="form" :model="form" label-width="80px" >
        <el-form-item label="商位编码" prop="costname">
          <el-input
            disabled
            v-model="form.quotientCode"
            placeholder="请输入费用名称"
          ></el-input>
        </el-form-item>

        <el-card
          class="box-card"
          v-for="(item, index) in form.list"
          :key="index"
        >
          <div slot="header" class="clearfix">
            <span>设备{{ index + 1 }}</span>
            <el-button
              style="float: right"
              size="mini"
              type="danger"
              plain
              @click.prevent="deleteItem(index)"
              >删除</el-button
            >
          </div>
          <div>
            <el-form-item
              :prop="'list.' + index + '.equipmentType'"
              label-width="100"
              :label="'设备类型'"
              :rules="[{ required: true, message: '不能为空' }]"
            >
              <el-select
                v-model="item.equipmentType"
                placeholder="请选择设备类型"
                v-if="drawerType == 'edit'"
              >
                <el-option
                  v-for="group in optionsType"
                  :key="group.value"
                  :label="group.label"
                  :value="group.value"
                >
                </el-option>
              </el-select>

              <el-input disabled v-model="item.equipmentType" v-else></el-input>
            </el-form-item>

            <el-form-item
              :prop="'list.' + index + '.equipmentName'"
              label-width="100"
              :label="'选择设备'"
              :rules="[{ required: true, message: '不能为空' }]"
            >
              <el-select
                v-model="item.equipmentName"
                v-if="drawerType == 'edit'"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="items in optionsName"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                >
                </el-option>
              </el-select>
              <el-input
                disabled
                v-else
                placeholder="请输入数字"
                v-model.number="item.equipmentName"
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
export default {
  data() {
    return {
      form: {
        // 商位编码
        quotientCode: "SF154GSD",
        list: [
          {
            equipmentType: "1",
            equipmentName: "2",
          },
        ],
      },
      optionsName: [],
      optionsType: [
        {
          label: "label:Alabama",
          value: "value:Alabama",
        },
        {
          label: "label:2",
          value: "value:3",
        },
      ],
      tabsList: [
        { name: "商铺", val: 1 },
        { name: "仓库", val: 2 },
        { name: "宿舍", val: 3 },
      ],
      tableKey:1,
      loading: false,
      btnLoading: false,
      tableData: [
        {
          code: "REY157G",
          num: "2",
          name: "杨大妈猪肉",
        },
        {
          code: "AAG14G",
          num: "3",
          name: "杨妈猪肉",
        },
        {
          code: "FDHDFH15",
          num: "1",
          name: "杨大猪",
        },
        {
          code: "DWRTET5484",
          num: "7",
          name: "杨水果肉",
        },
      ],
      search: {
        total: 10,
        pageNum: 1,
        pageSize: 20,
        lotLocation: 1,
      },
      value: "",
      queryParams: {},
      showDrawer: false,
      drawerType: "",
    };
  },

  created() {
    this.getList();
  },
  methods: {
    // 远程搜索
    remoteMethod(query) {

      if (query !== "") {
        this.optionsName = [
          {
            label: "label:Alabama",
            value: "value:Alabama",
          },
          {
            label: "label:2",
            value: "value:3",
          },
        ];
        // this.loading = true;
        // setTimeout(() => {
        //   this.loading = false;
        //   this.options = this.list.filter(item => {
        //     return item.label.toLowerCase()
        //       .indexOf(query.toLowerCase()) > -1;
        //   });
        // }, 200);
      } else {
        this.options = [];
      }
    },
    // 切换tabs
    tabsTodo(val) {
      this.tableKey = val
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
      this.form.list.push({
        costrules: [{ time: "", operation: 3 }],
        deductmoney: "",
        deductType: 1, // % 或 元
      });
      this.$refs.form.clearValidate();
    },
    // 删除情况
    deleteItem(index) 
    {
      this.form.list.splice(index, 1);
    },
    // 请求
    getList() {
      let _this = this;
      this.loading = true;
      console.log(this.queryFormat(this.queryParams, this.search))
      //   getList(this.queryFormat(this.queryParams, this.search))
      //     .then((response) => {
      //       this.tableData = response.data.results.body;
      //       this.search.total = response.data.count;
      //       _this.$nextTick(function () {
      //         _this.tableHeader = response.data.results.headers;
      //         // console.log(_this.tableHeader);
      //       });
      //     })
      //     .finally((error) => {
      //       this.loading = false;
      //     });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
 
    // 打开弹窗
    operation(type, id) {
      this.showDrawer = true;
      this.drawerType = type;
      this.itemId = id;
      let categoryList = [];
      // if (type == "add") {
      //   getTypeList().then((res) => {
      //     // console.log(res);
      //     res.data.results.forEach((element) => {
      //       categoryList.push({
      //         costTypeId: element.id,
      //         servicesTypeName: element.servicesTypeName,
      //         price: "",
      //       });
      //     });
      //     // console.log(categoryList);
      //     this.servicesCost = categoryList;
      //   });
      // }

      // type == "edit" && this.getInfo();
    },
    // 关闭弹窗
    drawerClosed() {
      this.showDrawer = false;
      // (this.form = {
      //   name: "",
      //   repairer: "",
      // }),
      //   this.$refs["form"].resetFields();
    },
    // 提交表单
    confirmForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          this.showDrawer = false;
          this.$success("新增成功！");
          this.btnLoading = false;
          // addOfficeAddress(objForm)
          //   .then((res) => {
          //     this.showDrawer = false;
          //     this.$success("新增成功！");
          //     this.getList();
          //   })
          //   .finally((error) => {
          //     this.btnLoading = false;
          //   });
        } else {
          this.$error("请将表单填写完整");
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

