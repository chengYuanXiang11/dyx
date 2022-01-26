<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    label-widht="70px"
    @pagination="handlePagination"
    @search="handleSearch"
    :showLimit="3"
  >
    <template slot="action-bar">
      <el-button type="primary" @click="operation('add')">新建</el-button>
    </template>
    <el-table v-loading="loading" :data="tableData" border height="100%">
      <el-table-column label="商户类型" prop="merchantsCategory" :formatter="merchantTypeFormater" />
      <el-table-column label="商户名称" prop="storeName" />
      <el-table-column label="姓名" prop="merchantName"></el-table-column>
      <el-table-column label="手机号" prop="mobile"></el-table-column>
      <el-table-column label="身份证号" prop="idCardNum"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="operation('account', scope.row.id)">账户情况</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建编辑 -->
    <Drawer
      :visible.sync="showDrawer"
      :title="(drawerType == 'add' ? '新建' : '编辑')"
      @confirm="confirmForm"
      @closed="drawerClosed"
      v-loading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="130px" :rules="rules">
        <el-form-item label="商户类型" prop="merchantsCategory">
          <el-radio-group v-model="form.merchantsCategory">
            <el-radio :label="2">采购户</el-radio>
            <el-radio :label="3">临时经营户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商户名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="merchantName">
          <el-input v-model="form.merchantName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNum">
          <el-input v-model="form.idCardNum" placeholder="请输入身份证号"></el-input>
        </el-form-item>
      </el-form>
    </Drawer>

    <!-- 账户管理 -->
    <Drawer
      :visible.sync="showDrawerAccount"
      title="账户情况"
      @confirm="confirmAccount"
      @closed="drawerAccount"
      v-loading="accountLoading"
      :showFooter="false"
    >
      <el-form ref="accountForm" :model="accountForm" label-width="125px">
        <el-descriptions title :column="1">
          <el-descriptions-item label="账户总余额">{{ totalAccount }} 元</el-descriptions-item>
          <el-descriptions-item
            :label="item.accountName"
            v-for="(item,index) in accountInfo"
            :key="index"
          >{{ item.accountBalance }} 元</el-descriptions-item>
        </el-descriptions>
      </el-form>
    </Drawer>
  </Table-page>
</template>

<script>
import {
  getList,
  addOfficeAddress,
  getInfo,
  updateOfficeAddress,
  delOfficeAddress,
} from "@/request/api/market/merchantsMgmt/temporary";
import { isPhone, isCardId } from '@/utils/isValid'
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        merchantsCategorys: '2,3',
      },
      search: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        form: [
          {
            name: "merchantsCategory",
            label: "商户类型",
            type: "select",
            options: [
              {
                label: "临时经营户",
                value: "3"
              },
              {
                label: "采购户",
                value: "2"
              },
            ]
          },
          {
            name: "storeName",
            label: "商户名称",
            type: "input",
          },
          {
            name: "merchantName",
            label: "姓名",
            type: "input",
          },
          {
            name: "mobile",
            label: "手机号",
            type: "input",
          },
          {
            name: "idCardNum",
            label: "身份证",
            type: "input",
          },


        ],
      },
      showDrawerAccount: false,
      accountLoading: false,
      loading: false,
      btnLoading: false,
      total: 0,
      tableData: [{ id: 1 }],
      showDrawer: false,
      drawerType: "",
      itemId: undefined,
      form: {
        merchantsCategory: 2,
        storeName: "",
        merchantName: "",
        mobile: "",
        idCardNum: ""
      },
      options: [
        { label: "个人商户", value: 1 },
        { label: "企业商户", value: 2 },
      ],
      rules: {
        merchantsCategory: [
          {
            required: true,
            message: "请选择商户类型",
            trigger: "change",
          },
        ],
        storeName: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: "blur",
          },
        ],
        merchantName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            trigger: "blur",
            validator: isPhone
          },
        ],

      },
      accountForm: {
      },
      accountInfo: [],
      totalAccount: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页方法
    handlePagination(e) {
      this.search.pageSize = e.pageSize;
      this.search.pageNum = e.pageNum;
      this.getList();
    },
    // 搜索方法
    handleSearch(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    // 账户管理弹窗确定
    confirmAccount() {
      this.showDrawerAccount = false

    },
    // 账户管理弹窗取消
    drawerAccount() {
      this.showDrawerAccount = false

    },
    merchantTypeFormater(row) {
      if (row.merchantsCategory == 2) {
        return '采购户'
      } else if (row.merchantsCategory == 3) {
        return '临时经营户'
      } else {
        return row.merchantsCategory
      }
    },
    getList() {
      this.loading = true;
      getList(this.queryFormat(this.queryParams, this.search))
        .then((response) => {
          this.tableData = response.data.results;
          this.search.total = response.data.count;
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    getInfo() {
      const self = this
      this.loading = true;
      getInfo(this.itemId)
        .then((response) => {
          if (self.drawerType == 'edit') {
            let form = {
              merchantsCategory: response.data.merchantsCategory,
              storeName: response.data.storeName,
              merchantName: response.data.merchantName,
              mobile: response.data.mobile,
              idCardNum: response.data.idCardNum
            }
            self.form = form;
          } else if (self.drawerType == 'account') {
            self.accountInfo = response.data.accountInfo
            self.accountInfo.map(item => {
              if (!isNaN(item.accountBalance)) {
                self.totalAccount += item.accountBalance
              }
            })
          }

        })
        .finally((error) => {
          self.$nextTick(() => {
            this.loading = false;
          });
        });
    },
    operation(type, id) {
      if (type == "edit" || type == "add") {
        this.showDrawer = true;

      } else {
        this.showDrawerAccount = true
      }
      this.drawerType = type;
      this.itemId = id;
      (type == "edit" || type == "account") && this.getInfo();
    },
    drawerClosed() {
      this.showDrawer = false;
      this.$refs.form.resetFields()
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
            self.$success("删除成功！");
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
                self.$success("新增成功！");
                self.getList();
              })
              .finally((error) => {
                self.btnLoading = false;
              });
          } else {
            updateOfficeAddress(self.form, self.itemId)
              .then((res) => {
                self.showDrawer = false;
                self.$success("编辑成功！");
                self.getList();
              })
              .finally((error) => {
                self.btnLoading = false;
              });
          }
        } else {
          self.$error("请将表单填写完整");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title-sty {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}
.el-select {
  width: 100%;
}
</style>

