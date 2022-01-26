<template>
  <div class="app-container">
    <div>
      <el-form v-show="showSearch" ref="queryForm" :model="paging" :inline="true" label-width="85x">
        <el-form-item label="商户名称" prop="storeName">
          <el-input
            v-model="paging.storeName"
            placeholder="请输入商户名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="paging.status"
            placeholder="请选择状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusList"
              :key="dict.id"
              :label="dict.label"
              :value="dict.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拟经营品种" prop="saleCategory">
          <el-select
            multiple
            v-model="paging.saleCategory"
            placeholder="请选择拟经营品种"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in saleCategoryList"
              :key="dict.id"
              :label="dict.label"
              :value="dict.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型" prop="customerType">
          <el-select
            v-model="paging.merchantsType"
            placeholder="请选择商户类型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in customerTypeList"
              :key="dict.id"
              :label="dict.label"
              :value="dict.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="merchantName">
          <el-input
            v-model="paging.merchantName"
            placeholder="请输入联系人"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input
            v-model="paging.mobile"
            placeholder="请输入联系电话"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="operation">
      <el-button type="primary" @click="operation('add')">新建</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" class="yg-table">
      <el-table-column label="商户名称" prop="storeName" />
      <el-table-column label="经营品种" prop="saleCategory" :formatter="formatSaleCategory" />
      <el-table-column
        label="商户类型"
        prop="merchantsType"
        :show-overflow-tooltip="true"
        :formatter="formatCustomerType"
      />
      <el-table-column label="联系人" prop="merchantName" />
      <el-table-column label="联系电话" prop="mobile"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit('view', scope.row.id)">查看</el-button>
          <el-button size="mini" type="text" @click="edit('edit', scope.row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="operation('account', scope.row.id)">账户管理</el-button>
          <el-button size="mini" type="text" @click="lease(scope.row.id)">租赁管理</el-button>
          <!-- <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="paging.pageNum"
      :limit.sync="paging.pageSize"
      @pagination="getList"
    />
    <!-- 新建和沟通管理弹窗 -->
    <Yg-Drawer
      v-model="showDrawer"
      :title="drawerType == 'add' ? '新建' : '账户管理'"
      @confirm="confirmForm"
      @closed="drawerClosed"
      @cancel="drawerClosed"
      :confirmLoading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="125px" :rules="rules">
        <div v-if="drawerType == 'add'">
          <el-form-item label="商户类型" prop="merchantsType">
            <el-radio-group v-model="form.merchantsType">
              <el-radio v-for="m in customerTypeList" :key="m.id" :label="m.id">{{ m.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商户名称" prop="storeName">
            <el-input v-model="form.storeName" maxlength="30" show-word-limit placeholder="请输入商户名称"></el-input>
          </el-form-item>
          <el-form-item label="拟经营品种" prop="saleCategory">
            <el-select v-model="form.saleCategory" placeholder="请选择拟经营品种" multiple clearable>
              <el-option v-for="m in saleCategoryList" :key="m.id" :label="m.label" :value="m.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="merchantName">
            <el-input v-model="form.merchantName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNum">
            <el-input v-model="form.idCardNum" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </div>

        <el-descriptions title="账户情况" v-if="drawerType == 'account'">
          <el-descriptions-item label="账户总余额">{{ form.accountInfo.accountBlc }}</el-descriptions-item>
          <el-descriptions-item label="电费余额">{{ form.accountInfo.pwRateBlc }}</el-descriptions-item>
          <el-descriptions-item label="水费余额">{{ form.accountInfo.wtRateBlc }}</el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <div class="title-sty">账户设置</div>
        <el-form-item label="账户余额提醒时间" prop="blcRemindOpCl">
          <el-switch
            @change="handleChange(1)"
            v-model="arrearsSetting.blcRemindOpCl"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="提醒金额"
          prop="blcLackRemind"
          label-width="190px"
          v-if="arrearsSetting.blcRemindOpCl == 1"
        >
          当账户总余额不足
          <el-input-number v-model="arrearsSetting.blcLackRemind" :min="0" label="提醒金额" size="mini"></el-input-number>元时提醒负责人缴费
        </el-form-item>

        <el-form-item label="欠费措施" prop="arrearsMeOpCl">
          <el-switch
            @change="handleChange(2)"
            v-model="arrearsSetting.arrearsMeOpCl"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="提醒金额"
          prop="lackBlcCut"
          label-width="190px"
          v-if="arrearsSetting.arrearsMeOpCl == 1"
        >
          当账户余额不足
          <el-input-number v-model="arrearsSetting.lackBlcCut" label="提醒金额" size="mini"></el-input-number>元时,
        </el-form-item>
        <el-form-item
          label="停止供水"
          prop="waterCut"
          label-width="260px"
          v-if="arrearsSetting.arrearsMeOpCl == 1"
        >
          <el-switch v-model="arrearsSetting.waterCut" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item
          label="停止供电"
          prop="pawerCut"
          label-width="260px"
          v-if="arrearsSetting.arrearsMeOpCl == 1"
        >
          <el-switch v-model="arrearsSetting.pawerCut" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
    </Yg-Drawer>
    <!-- 查看和编辑弹窗 -->
    <Yg-Drawer
      v-model="showDrawerEdit"
      :title="drawerType == 'edit' ? '编辑' : '查看'"
      :showFooter="false"
      :confirmLoading="btnLoadingEdit"
      :wrapperClosable="false"
      @closed="drawerClosedEdit"
    >
      <el-form
        :disabled="drawerType != 'edit'"
        ref="formEdit"
        :model="formEdit"
        label-width="125px"
        :rules="rulesEdit"
      >
        <div class="title-sty">商户信息</div>
        <el-form-item label="商户名称" prop="storeName">
          <el-input v-model="formEdit.storeName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="经营品种" prop="saleCategory">
          <el-select
            multiple
            v-model="formEdit.saleCategory"
            placeholder="请选择拟经营品种"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in saleCategoryList"
              :key="dict.id"
              :label="dict.label"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商户类型" prop="merchantsType">
          <el-select
            v-model="formEdit.merchantsType"
            placeholder="请选择商户类型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in customerTypeList"
              :key="dict.id"
              :label="dict.label"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="社会统一信用代码" prop="creditCode">
          <el-input v-model="formEdit.creditCode" placeholder="请输入社会统一信用代码"></el-input>
        </el-form-item>
        <el-form-item label="营业执照照片" prop="businessLicense" v-if="drawerType == 'edit'">
          <UploadImg v-model="businessLicense" :limit="1"></UploadImg>
        </el-form-item>

        <el-form-item label="营业执照照片" prop="businessLicense" v-if="drawerType == 'view'">
          <div v-if="businessLicense != '' && businessLicense.length > 0">
            <el-image
              style="width: 148px; height: 148px"
              v-for="(m, i) in businessLicense"
              :key="i"
              :src="m"
              :preview-src-list="businessLicense"
            ></el-image>
          </div>
        </el-form-item>
        <div class="title-sty">法人信息</div>
        <el-form-item label="法人姓名" prop="merchantName">
          <el-input v-model="formEdit.merchantName" placeholder="请输入法人姓名"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号" prop="idCardNum">
          <el-input v-model="formEdit.idCardNum" placeholder="请输入法人身份证号"></el-input>
        </el-form-item>
        <el-form-item label="法人电话" prop="mobile">
          <el-input v-model="formEdit.mobile" placeholder="请输入法人电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证正面" prop="idCardFront" v-if="drawerType == 'edit'">
          <UploadImg v-model="idCardFront" :limit="1"></UploadImg>
          <!-- <span class="tips" v-if="idCardFront.length == 0">请上传身份证正面照片</span> -->
        </el-form-item>
        <el-form-item label="身份证反面" prop="idCardReverse" v-if="drawerType == 'edit'">
          <UploadImg v-model="idCardReverse" :limit="1"></UploadImg>
          <!-- <span class="tips" v-if="idCardReverse.length == 0">请上传身份证反面照片</span> -->
        </el-form-item>
        <el-form-item label="身份证正面" prop="pawerCut" v-if="drawerType == 'view'">
          <div v-if="idCardFront != '' && idCardFront.length > 0">
            <el-image
              style="width: 148px; height: 148px"
              v-for="(m, i) in idCardFront"
              :key="i"
              :src="m"
              :preview-src-list="idCardFront"
            ></el-image>
          </div>
        </el-form-item>
        <el-form-item label="身份证反面" prop="idCardReverse" v-if="drawerType == 'view'">
          <div v-if="idCardReverse != '' && idCardReverse.length > 0">
            <el-image
              style="width: 148px; height: 148px"
              v-for="(m, i) in idCardReverse"
              :key="i"
              :src="m"
              :preview-src-list="idCardReverse"
            ></el-image>
          </div>
        </el-form-item>
        <div class="title-sty">业务负责人</div>
        <el-form-item label="姓名" prop="businessManager">
          <el-input v-model="formEdit.businessManager" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="managerMobile">
          <el-input v-model="formEdit.managerMobile" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <div class="title-sty">招商经理</div>
        <el-form-item label="招商经理" prop="leasingManager">
          <el-tag
            type="primary"
            v-if="Object.keys(datas).length > 0"
            style="margin-right:10px;"
          >{{ datas.user_name }}</el-tag>
          <el-button
            type="primary"
            @click="showDialog = true"
            size="mini"
          >{{ Object.keys(datas).length > 0 ? '替换人员' : '选择人员' }}</el-button>
        </el-form-item>
        <el-form-item v-if="drawerType == 'edit'">
          <el-button type="primary" @click="confirmFormEdit('formEdit')">完成</el-button>
          <el-button @click="drawerClosedEdit('formEdit')">取消</el-button>
        </el-form-item>
      </el-form>
    </Yg-Drawer>
    <SelectUsersDialog
      :visible.sync="showDialog"
      :data="datas"
      model="user"
      :multiple="false"
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
} from "@/request/api/market/merchantsMgmt/merchantManagement";
export default {
  data() {
    return {
      showDialog: false,
      datas: {},
      // {
      //   user_id:1, id:1,
      //   user_name:"xxx" deptName:''
      // }
      // [{
      //   user_id:1,
      //   user_name:"xxx"
      // }]
      // {
      //   depts:[]
      //   users:[]
      // }
      // 显示搜索条件
      showSearch: true,
      loading: true,
      btnLoading: false,
      btnLoadingEdit: false,
      total: 0,
      tableData: [],
      paging: {
        merchantParent: this.$route.query.id,
        pageNum: 1,
        pageSize: 20,
        storeName: "",
        status: "",
        saleCategory: "",
        customerType: "",
        merchantName: "",
        mobile: "",
      },
      showDrawer: false,
      showDrawerEdit: false,
      drawerType: "",
      itemId: undefined,
      form: {
        merchantsType: "",
        storeName: "",
        saleCategory: [],
        merchantName: "",
        idCardNum: "",
        mobile: "",
        accountInfo: {
          accountBlc: "",
          pwRateBlc: "",
          wtRateBlc: ""
        }
      },
      arrearsSetting: {
        blcRemindOpCl: 1,
        blcLackRemind: "",
        arrearsMeOpCl: 1,
        lackBlcCut: "",
        waterCut: 1,
        pawerCut: 1,
      },

      rules: {
        merchantsType: [
          {
            required: true,
            message: "请输入商户类型",
            trigger: "blur",
          },
        ],
        storeName: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: "blur",
          },
        ],
        saleCategory: [
          {
            required: true,
            message: "请选择拟经营品种",
            trigger: "change",
          },
        ],
        merchantName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        idCardNum: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
        ],
      },

      saleCategoryList: [],
      customerTypeList: [],
      statusList: [
        {
          id: "1",
          label: "未认证"
        },
        {
          id: "2",
          label: "未生效"
        },
        {
          id: "3",
          label: "合约中"
        },
        {
          id: "4",
          label: "已到期"
        },
      ],
      formEdit: {
        storeName: "",
        saleCategory: [],
        merchantsType: "",
        creditCode: "",
        merchantName: "",
        idCardNum: "",
        mobile: "",
        businessManager: "",
        managerMobile: "",
        leasingManager: "",
      },
      rulesEdit: {
        storeName: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: "blur",
          },
        ],
        saleCategory: [
          {
            required: true,
            message: "请输入经营品种",
            trigger: "change",
          },
        ],
        merchantsType: [
          {
            required: true,
            message: "请输入商户类型",
            trigger: "blur",
          },
        ],
        merchantName: [
          {
            required: true,
            message: "请输入法人姓名",
            trigger: "blur",
          },
        ],
        idCardNum: [
          {
            required: true,
            message: "请输入法人身份证号",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入法人电话",
            trigger: "blur",
          },
        ],
      },
      businessLicense: [],//营业执照照片
      idCardFront: [],//身份证正面
      idCardReverse: [],//身份证反面
    };
  },
  created() {
    this.getList();
    this.getDicts("customerType").then((response) => {
      this.customerTypeList = response.data;
    });
    this.getDicts("businessCategory").then((response) => {
      this.saleCategoryList = response.data;
    });
  },
  methods: {
    lease(id){
      this.$router.push({
        path:'/leaseManage',
        query:{
          id:id
        }
      })
    },
    getDatas(e) {
      this.showDialog = false;
      this.datas = e;
    },
    // 查看编辑按钮
    edit(type, id) {
      this.drawerType = type
      this.itemId = id
      this.showDrawerEdit = true
      this.getInfo()
    },
    // 编辑弹窗确定按钮
    confirmFormEdit() {
      const _this = this;
      _this.$refs["formEdit"].validate((valid) => {
        if (valid) {
          // if (_this.idCardFront.length == 0 || _this.idCardReverse.length == 0) {
          //   _this.$toastError("请将表单填写完整");
          //   return false
          // }
          _this.btnLoadingEdit = true;
          let form = {
            storeName: _this.formEdit.storeName,
            saleCategory: _this.formEdit.saleCategory,
            merchantsType: _this.formEdit.merchantsType,
            creditCode: _this.formEdit.creditCode,
            merchantName: _this.formEdit.merchantName,
            idCardNum: _this.formEdit.idCardNum,
            mobile: _this.formEdit.mobile,
            businessManager: _this.formEdit.businessManager,
            managerMobile: _this.formEdit.managerMobile,
            leasingManager: _this.datas.user_id
          }
          form.businessLicense = _this.businessLicense.join(',')
          form.idCardFront = _this.idCardFront.join(',')
          form.idCardReverse = _this.idCardReverse.join(',')
          updateOfficeAddress(form, _this.itemId)
            .then((res) => {
              _this.showDrawerEdit = false
              _this.$toast("操作成功！");
              _this.getList();
            })
            .finally((error) => {
              _this.btnLoadingEdit = false;
            });
        } else {
          _this.$toastError("请将表单填写完整");
        }
      })

    },
    // 查看编辑弹窗取消按钮
    drawerClosedEdit() {
      this.showDrawerEdit = false
      this.resetForm("formEdit");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.paging.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleChange(num) {
      if (num == 1) {
        this.arrearsSetting.blcLackRemind = "";
      } else if (num == 2) {
        this.arrearsSetting.lackBlcCut = "";
      }
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
          if (self.drawerType == 'account') {
            let res = self.filterObj(response.data, [
              "id",
            ]);
            res.accountInfo = JSON.parse(response.data.accountInfo)
            self.arrearsSetting = response.data.arrearsSetting
            self.form = res;
          } else if (self.drawerType == 'edit' || self.drawerType == 'view') {
            self.formEdit = response.data
            let values = response.data.saleCategory.map((item) => {
              return item.id;
            });
            self.formEdit.saleCategory = values
            self.formEdit.merchantsType = response.data.merchantsType.id
            if (response.data.leasingManager != null) {
              self.datas.user_id = response.data.leasingManager.id
              self.datas.user_name = response.data.leasingManager.username
            }
            if (response.data.businessLicense != "" && response.data.businessLicense != null) {
              self.businessLicense = response.data.businessLicense.split(',')
            }
            if (response.data.idCardFront != "" && response.data.idCardFront != null) {
              self.idCardFront = response.data.idCardFront.split(',')
            }
            if (response.data.idCardReverse != "" && response.data.idCardReverse != null) {
              self.idCardReverse = response.data.idCardReverse.split(',')
            }
          }
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
      if (type == "add") {//商户类型默认给第一个值
        this.$set(this.form,'merchantsType',this.customerTypeList[0].id)
      }
      type == "account" && this.getInfo();
    },
    drawerClosed() {
      this.showDrawer = false;
      this.resetForm("form");
      this.initForm();
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
    initForm() {
      this.arrearsSetting.blcRemindOpCl = 1;
      this.arrearsSetting.blcLackRemind = "";
      this.arrearsSetting.arrearsMeOpCl = 1;
      this.arrearsSetting.lackBlcCut = "";
      this.arrearsSetting.waterCut = 1;
      this.arrearsSetting.pawerCut = 1;
    },
    confirmForm() {
      const self = this;
      self.$refs["form"].validate((valid) => {
        if (valid) {
          self.btnLoading = true;
          if (self.drawerType == "add") {
            self.form.arrearsSetting = self.arrearsSetting;
            self.form.merchantParent = self.$route.query.id;
            addOfficeAddress(self.form)
              .then((res) => {
                self.showDrawer = false;
                self.$toast("新增成功！");
                self.getList();
                self.initForm();
              })
              .finally((error) => {
                self.btnLoading = false;
              });
          } else {
            self.form.arrearsSetting = self.arrearsSetting;
            updateOfficeAddress(self.form, self.itemId)
              .then((res) => {
                self.showDrawer = false;
                self.$toast("操作成功！");
                self.getList();
                self.initForm();
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
    formatSaleCategory(row) {
      let values = row.saleCategory.map((item) => {
        return item.listName;
      });
      return values.join(",");
    },
    formatCustomerType(row) {
      if (row.merchantsType != null) {
        return row.merchantsType.listName;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title-sty {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
// .el-drawer__wrapper {
//   z-index: 2100;
// }
// .el-image-viewer__wrapper {
//   z-index: 2020 !important;
// }

.tips {
  color: #ff4d4f;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>

