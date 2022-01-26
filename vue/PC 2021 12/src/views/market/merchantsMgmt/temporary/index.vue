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
      <el-table-column label="商户类型" prop="merchantType" :formatter="merchantTypeFormater" />
      <el-table-column label="商户名称" prop="storeName" />
      <el-table-column label="姓名" prop="purchaserName"></el-table-column>
      <el-table-column label="手机号" prop="purchaserMobile"></el-table-column>
      <el-table-column label="身份证号" prop="purchaserMobile"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="account(scope.row.id)">账户管理</el-button>
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
        <el-form-item label="商户类型" prop="merchantType">
          <el-radio-group v-model="form.merchantType">
            <el-radio :label="1">采购户</el-radio>
            <el-radio :label="2">临时经营户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商户名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="purchaserName">
          <el-input v-model="form.purchaserName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="purchaserMobile">
          <el-input v-model="form.purchaserMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="purchaserMobile">
          <el-input v-model="form.purchaserMobile" placeholder="请输入身份证号"></el-input>
        </el-form-item>
      </el-form>
    </Drawer>

    <!-- 账户管理 -->
    <Drawer
      :visible.sync="showDrawerAccount"
      title="账户管理"
      @confirm="confirmAccount"
      @closed="drawerAccount"
      v-loading="accountLoading"
    >
      <el-form ref="accountForm" :model="accountForm" label-width="125px" :rules="rules">
        <el-descriptions title="账户情况" :column="1">
          <el-descriptions-item label="账户总余额">1232元</el-descriptions-item>
          <el-descriptions-item label="主账户">1000元</el-descriptions-item>
          <el-descriptions-item label="xx账户">200元</el-descriptions-item>
        </el-descriptions>

        <!-- <el-divider></el-divider> -->
        <div class="title-sty">账户设置</div>
        <el-form-item label="主账户余额提醒设置" label-width="138px" prop="blcRemindOpCl">
          <el-switch
            @change="handleChange(1)"
            v-model="arrearsSetting.blcRemindOpCl"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label
          prop="blcLackRemind"
          label-width="130px"
          v-if="arrearsSetting.blcRemindOpCl == 1"
        >
          账户总余额不足
          <el-input-number
            :controls="false"
            v-model="arrearsSetting.blcLackRemind"
            :min="0"
            label="提醒金额"
            size="mini"
          ></el-input-number>元时提醒负责人缴费
        </el-form-item>
        <el-form-item label="XX账户余额提醒设置" label-width="145px" prop="blcRemindOpCl">
          <el-switch
            @change="handleChange(1)"
            v-model="arrearsSetting.blcRemindOpCl"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label
          prop="blcLackRemind"
          label-width="130px"
          v-if="arrearsSetting.blcRemindOpCl == 1"
        >
          账户总余额不足
          <el-input-number
            :controls="false"
            v-model="arrearsSetting.blcLackRemind"
            :min="0"
            label="提醒金额"
            size="mini"
          ></el-input-number>元时提醒负责人缴费
        </el-form-item>

        <el-form-item label="欠费措施" prop="arrearsMeOpCl">
          <el-switch
            @change="handleChange(2)"
            v-model="arrearsSetting.arrearsMeOpCl"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <div v-if="arrearsSetting.arrearsMeOpCl == 1">
          <el-form-item label prop="lackBlcCut" label-width="130px">
            主账户余额不足
            <el-input-number
              :controls="false"
              v-model="arrearsSetting.lackBlcCut"
              label="提醒金额"
              size="mini"
            ></el-input-number>元时,
          </el-form-item>
          <el-form-item label="停止供水" prop="waterCut" label-width="200px">
            <el-switch v-model="arrearsSetting.waterCut" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="停止供电" prop="pawerCut" label-width="200px">
            <el-switch v-model="arrearsSetting.pawerCut" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>

          <el-form-item label label-width="130px">
            XX账户余额不足
            <el-input-number
              :controls="false"
              v-model="arrearsSetting.waLackBlcCut"
              label="提醒金额"
              size="mini"
            ></el-input-number>元时,
          </el-form-item>
          <el-form-item label="停止供水" label-width="200px">
            <el-switch v-model="arrearsSetting.waWaterCut" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="停止供电" label-width="200px">
            <el-switch v-model="arrearsSetting.waPawerCut" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </div>
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
import { isPhone } from '@/utils/validate'
export default {
  data() {
    return {
      // 查询参数
      queryParams: {},
      search: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        form: [
          {
            name: "status",
            label: "商户类型",
            type: "select",
            options: [
              {
                label: "临时经营户",
                value: "1"
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
            name: "purchaserName",
            label: "姓名",
            type: "input",
          },
          {
            name: "purchaserMobile",
            label: "手机号",
            type: "input",
          },
          {
            name: "purchaserMobile",
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
        merchantType: 1,
        storeName: "",
        purchaserName: "",
        purchaserMobile: "",
      },
      options: [
        { label: "个人商户", value: 1 },
        { label: "企业商户", value: 2 },
      ],
      rules: {
        merchantType: [
          {
            required: true,
            message: "请选择商户类型",
            trigger: "change",
          },
        ],
        shopName: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: "blur",
          },
        ],
        purchaserName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        purchaserMobile: [
          {
            required: true,
            // message: "请输入姓名",
            trigger: "blur",
            validator: isPhone
          },
        ],

      },
      accountForm: {},
      arrearsSetting: {
        blcRemindOpCl: 1,
        blcLackRemind: "",
        arrearsMeOpCl: 1,
        lackBlcCut: "",
        waterCut: 1,
        pawerCut: 1,

        waLackBlcCut: "",
        waWaterCut: 1,
        waPawerCut: 1,
        paLackBlcCut: "",
        paWaterCut: 1,
        paPawerCut: 1

      },

    };
  },
  created() {
    // this.getList();
  },
  methods: {
    // 分页方法
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.getList();
    },
    // 搜索方法
    handleSearch(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    // 账户管理
    account(id) {
      this.showDrawerAccount = true
    },
    // 账户管理弹窗确定
    confirmAccount() {
      this.showDrawerAccount = false

    },
    // 账户管理弹窗取消
    drawerAccount() {
      this.showDrawerAccount = false

    },
    handleChange(num) {

    },
    merchantTypeFormater(row) {
      if (row.merchantType == 1) {
        return '个人商户'
      } else if (row.merchantType == 2) {
        return '企业商户'
      } else {
        return row.merchantType
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
          self.form = response.data;
        })
        .finally((error) => {
          self.$nextTick(() => {
            this.loading = false;
          });
        });
    },
    operation(type, id) {
      this.showDrawer = true;
      this.drawerType = type;
      this.itemId = id;
      (type == "edit") && this.getInfo();
    },
    drawerClosed() {
      this.showDrawer = false;
      this.$refs.form.re
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

