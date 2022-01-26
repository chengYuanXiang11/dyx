<template>
  <div class="app-container">
    <div class="operation">
      <el-button type="primary" @click="operation('add')">新建</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" class="yg-table">
      <el-table-column label="服务类别" prop="servicesTypeName" />
      <el-table-column label="服务人数" prop="servicesNum"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="person(scope.row.id)">人员</el-button>
          <el-button size="mini" type="text" @click="del(scope.row.id)" v-if="scope.row.servicesNum==0">删除</el-button>
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
      title="新建"
      @confirm="confirmForm"
      @closed="drawerClosed"
      @cancel="drawerClosed"
      :confirmLoading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="服务名称" prop="servicesTypeName">
          <el-input maxlength="30" v-model="form.servicesTypeName" placeholder="请输入类别名称"></el-input>
        </el-form-item>
      </el-form>
    </Yg-Drawer>

    <SelectUsersDialog
      :visible.sync="showDialog"
      :data="datas"
      model="user"
      placeholder="请选择人员"
      @confirm="getDatas"
    ></SelectUsersDialog>
  </div>
</template>

<script>
import {
  getList,
  addOfficeAddress,
  getInfo,
  updateOfficeAddress,
  delOfficeAddress,
  choicePerson
} from "@/request/api/market/merchantServices/serviceCategory";
export default {
  data() {
    return {
      showDialog: false,
      datas: [],
      loading: true,
      btnLoading: false,
      total: 0,
      tableData: [],
      paging: {
        pageNum: 1,
        pageSize: 20,
      },
      showDrawer: false,
      drawerType: "",
      itemId: undefined,
      form: {
        city: [],
      },
      rules: {
        servicesTypeName: [
          {
            required: true,
            message: "请输入服务名称",
            trigger: "blur",
          },
        ],
      },

    };
  },
  created() {
    this.getList();
  },
  methods: {
    getDatas(e) {
      let _this = this
      this.showDialog = false;
      this.datas = e;
      let obj = {}
      obj.pk = this.itemId
      obj.servicesStaff = e.map(item => {
        return item.user_id
      })
      choicePerson(obj).then(() => {
        _this.getList()
        _this.$toast("操作成功！");
      }).catch(() => { })
    },
    // 人员
    person(id) {
      this.itemId = id
      this.showDialog = true;
    },
    getList() {
      this.loading = true;
      getList(this.paging)
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
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
      const self = this;
      self.$refs["form"].validate((valid) => {
        if (valid) {
          self.btnLoading = true;
          if (self.drawerType == "add") {
            addOfficeAddress(self.form)
              .then((res) => {
                self.showDrawer = false;
                self.$toast("新增成功！");
                self.getList();
              })
              .finally((error) => {
                self.btnLoading = false;
              });
          } else {
            updateOfficeAddress(self.form, self.itemId)
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
</style>

