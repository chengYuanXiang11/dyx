<template>
  <div class="app-container">
    <div class="operation">
      <el-button type="primary" @click="operation('add')">新建</el-button>
    </div>
    <div>
      <el-form v-show="showSearch" ref="queryForm" :model="paging" :inline="true" label-width="85x">
        <el-form-item label="模糊搜索" prop="rulesName">
          <el-input
            v-model="paging.rulesName"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter="handleQuery"
          >
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handleQuery"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" class="yg-table">
      <el-table-column label="规则名称" prop="rulesName" show-overflow-tooltip />
      <el-table-column label="商品" prop="goodsName" show-overflow-tooltip>
        <template slot-scope="scope">{{ formatterName(scope.row.goodsName) }}</template>
      </el-table-column>
      <el-table-column
        v-for="(item) in tableHeader"
        :key="item.label"
        :label="item.servicesTypeName"
      >
        <template
          slot-scope="scope"
        >{{ formatServicesType(item.servicesTypeId, scope.row.servicesCost) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="details(scope.row.id)">查看</el-button>
          <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="paging.pageNum"
      :limit.sync="paging.pageSize"
      @pagination="getList"
    />
    <Yg-Drawer
      v-model="showDrawer"
      :title="drawerType == 'add' ? '新建' : '编辑'"
      @confirm="confirmForm"
      @closed="drawerClosed"
      @cancel="drawerClosed"
      :confirmLoading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="规则名称" prop="rulesName">
          <el-input v-model="form.rulesName" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="商品" prop="goods">
          <GoodsSelect v-model="form.goods"></GoodsSelect>
        </el-form-item>
        <el-form-item
          :label="item.servicesTypeName"
          v-for="(item,index) in servicesCost"
          :key="index"
        >
          <el-input-number v-model="item.price" :label="item.servicesTypeName"></el-input-number>
          <span style="margin-left:10px">元</span>
        </el-form-item>
      </el-form>
    </Yg-Drawer>

    <el-dialog :visible.sync="dialogVisible" width="580px" :close-on-click-modal="false">
      <div>
        <pre>
          <div v-for="(item,index) in messageList" :key="index">{{ item }}</div>
        </pre>
      </div>
      <div slot="footer">
        <div class="dialog-footer">
          <div>
            <i class="el-icon-warning-outline"></i>
            <span class="text-Sty">添加其它:不添加以上重复项</span>
          </div>
          <div>
            <el-button @click="saveDialog(2)">添加其他</el-button>
            <el-button type="primary" @click="saveDialog(1)">全部添加</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  addOfficeAddress,
  getInfo,
  updateOfficeAddress,
  delOfficeAddress,
  getCommodity,
  getTypeList
} from "@/request/api/market/merchantServices/serviceCharge";
export default {
  data() {
    return {
      dialogVisible: false,
      goods: [],
      showSearch: true,
      loading: true,
      btnLoading: false,
      total: 0,
      tableData: [],
      tableHeader: [],
      paging: {
        pageNum: 1,
        pageSize: 20,
        rulesName: ""
      },
      showDrawer: false,
      drawerType: "",
      itemId: undefined,
      form: {
        goods: [],
        confim: ""

      },
      rules: {
      },
      servicesCost: [],
      messageList: [],

    };
  },
  watch: {
    'form.goods': {
      handler(newVal) {
        // console.log(newVal);
        if (newVal != undefined) {
          let _this = this
          let list = newVal.map(item => {
            return item.categoryId
          })
          let obj = {
            servicesGoods: list
          }
          if (list.length > 0) {
            getCommodity(obj).then(res => {
              // console.log(res);
              _this.messageList = []
              if (res.data.exists == "true") {
                _this.messageList = res.data.info
                _this.dialogVisible = true
              } else {
                _this.form.confim = 1
              }
              _this.$refs.form.clearValidate('goods')
            })
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getList();
  },
  methods: {
    formatterName(val) {
      // return (JSON.parse(val).map(item => { return item.name })).join('、')
      return val.join(',')
    },
    formatServicesType(id, row) {
      let obj = row.find(item => item.servicesTypeId == id)
      return obj.price
    },
    saveDialog(num) {
      console.log(num);
      this.form.confim = num
      this.dialogVisible = false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.paging.pageNum = 1;
      this.getList();
    },
    details(id) {
      this.$router.push({
        path: "/serviceDetails",
        query: {
          id: id
        }
      })
    },
    getList() {
      let _this = this
      this.loading = true;
      getList(this.paging)
        .then((response) => {
          this.tableData = response.data.results.body;
          this.total = response.data.count;
          _this.$nextTick(function () {
            _this.tableHeader = response.data.results.headers
            // console.log(_this.tableHeader);

          })
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    getInfo() {
      const self = this,
        loading = this.$load();
      getInfo(this.itemId)
        .then((response) => {
          self.form = response.data;
          self.form.goods = response.data.servicesGoodInfo
          self.servicesCost = []
          response.data.servicesCost.forEach(function (v) {
            self.servicesCost.push({
              servicesTypeName: v.costName,
              price: v.price
            })
          })
        })
        .finally((error) => {
          self.$nextTick(() => {
            loading.close();
          });
        });
    },
    operation(type, id) {
      this.showDrawer = true;
      this.drawerType = type;
      this.itemId = id;
      let categoryList = []
      this.form.confim = ""
      if (type == 'add') {
        getTypeList().then(res => {
          // console.log(res);
          res.data.results.forEach(element => {
            categoryList.push({
              costTypeId: element.id,
              servicesTypeName: element.servicesTypeName,
              price: ""
            })
          });
          // console.log(categoryList);
          this.servicesCost = categoryList
        })
      }

      type == "edit" && this.getInfo();
    },
    drawerClosed() {
      this.showDrawer = false;
      (this.form = {
        name: "",
        repairer: ""
      }),
        this.resetForm("form");
    },
    del(id) {
      const self = this;
      self
        .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          delOfficeAddress(id).then((res) => {
            self.$toast("删除成功！");
            self.getList();
          });
        });
    },
    confirmForm() {
      let objForm = {}
      let servicesCost = []
      this.servicesCost.forEach(item => {
        servicesCost.push({
          costTypeId: item.costTypeId,
          price: item.price
        })
      })
      objForm.rulesName = this.form.rulesName
      if (this.form.confim != "") {
        objForm.confim = this.form.confim
      }
      objForm.servicesCost = servicesCost
      objForm.servicesGoods = this.form.goods.map(item => {
        return item.categoryId
      })
      console.log(objForm);
      const self = this;
      self.$refs["form"].validate((valid) => {
        if (valid) {
          self.btnLoading = true;
          if (self.drawerType == "add") {
            addOfficeAddress(objForm)
              .then((res) => {
                self.showDrawer = false;
                self.$toast("新增成功！");
                self.getList();
              })
              .finally((error) => {
                self.btnLoading = false;
              });
          } else {
            updateOfficeAddress(objForm, self.itemId)
              .then((res) => {
                self.showDrawer = false;
                self.$toast("编辑成功！");
                self.getList();
              })
              .finally((error) => {
                self.btnLoading = false;
              });
          }
        } else {
          self.$toastError("请将表单填写完整");
        }
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

