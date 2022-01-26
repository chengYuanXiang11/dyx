// 报修类别
<template>
  <div class="app-container">
    <div class="operation">
      <el-button type="primary" @click="operation('add')">新建</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" class="yg-table">
      <el-table-column label="类别名称" prop="name" />
      <el-table-column label="负责人" prop="repairer"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="operation('edit', scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="del(scope.row.id)"
            >删除</el-button
          >
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
      :title="(drawerType == 'add' ? '新建' : '编辑') + '类别'"
      @confirm="confirmForm"
      @closed="drawerClosed"
      @cancel="drawerClosed"
      :confirmLoading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类别名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="repairer">
          <el-input v-model="form.repairer" placeholder="请输入维修人"></el-input>
        </el-form-item>
      </el-form>
    </Yg-Drawer>
  </div>
</template>

<script>
import {
  getList,
  addOfficeAddress,
  getInfo,
  updateOfficeAddress,
  delOfficeAddress,
} from "@/request/api/market/malfunctionRepair/repairCategory";
export default {
  data() {
    return {
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
        name: [
          {
            required: true,
            message: "请输入类别名称",
            trigger: "blur",
          },
        ],
        repairer: [
          {
            required: true,
            message: "请输入负责人",
            trigger: "change",
          },
        ],
      
      },
    
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
 .el-select{
    width: 100%;
}
</style>

