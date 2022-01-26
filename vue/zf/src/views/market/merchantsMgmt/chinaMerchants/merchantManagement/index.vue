<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    label-widht="100px"
    @pagination="handlePagination"
    @search="handleSearch"
    :showLimit="3"
  >
    <template slot="action-bar">
      <el-button type="primary" icon="el-icon-plus" @click="operation('add')">新建</el-button>
    </template>
    <el-table v-loading="loading" :data="tableData" border height="100%">
      <el-table-column label="商户名称" prop="storeName" />
      <el-table-column label="经营品种" prop="saleCategory" :formatter="formatSaleCategory" />
      <el-table-column
        label="客户性质"
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
          <el-button size="mini" type="text" @click="lease(scope.row.id, scope.row.storeName,'single')">租赁管理</el-button>
          <!-- <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建和账户管理弹窗 -->
    <Drawer
      :visible.sync="showDrawer"
      :title="drawerType == 'add' ? '新建' : '账户管理'"
      @confirm="confirmForm"
      @closed="drawerClosed"
      v-loading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="125px" :rules="rules">
        <div v-if="drawerType == 'add'">
          <el-form-item label="客户性质" prop="merchantsType">
            <el-radio-group v-model="form.merchantsType">
              <el-radio v-for="m in customerTypeList" :key="m.id" :label="m.id">{{ m.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商户名称" prop="storeName">
            <el-input v-model="form.storeName" maxlength="30" show-word-limit placeholder="请输入商户名称"></el-input>
          </el-form-item>
          <el-form-item label="经营品种" prop="saleCategory">
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

        <el-descriptions :column="1" v-if="drawerType == 'account'">
          <el-descriptions-item label="账户总余额">{{ totalAccount }} 元</el-descriptions-item>
          <el-descriptions-item
            :label="item.accountName"
            v-for="(item,index) in accountInfo"
            :key="index"
          >{{ item.accountBalance }} 元</el-descriptions-item>
        </el-descriptions>

        <div class="title-sty">账户设置</div>
        <div>
          <el-form-item label="欠费措施" prop="arrearsMeOpCl">
            <el-switch
              @change="handleChange(1)"
              v-model="arrearsSetting.arrearsMeasure.arrearsMeOpCl"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <div v-if="arrearsSetting.arrearsMeasure.arrearsMeOpCl == 1">
            <el-form-item label prop="lackBlcCut" label-width="130px">
              {{ arrearsSetting.arrearsMeasure.mainAccountName }}余额不足
              <el-input-number
                :controls="false"
                :min="0"
                v-model="arrearsSetting.arrearsMeasure.mainAccountCut"
                label="提醒金额"
                size="mini"
              ></el-input-number> 元时,
            </el-form-item>
            <el-form-item label="停止供水" prop="cutWater" label-width="200px">
              <el-switch
                v-model="arrearsSetting.arrearsMeasure.cutWater"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
            <el-form-item label="停止供电" prop="cutPower" label-width="200px">
              <el-switch
                v-model="arrearsSetting.arrearsMeasure.cutPower"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>

            <!-- <el-form-item label label-width="130px">
              水费账户余额不足
              <el-input-number
                :controls="false"
                :min="0"
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
            </el-form-item>-->
          </div>
        </div>
      </el-form>
    </Drawer>
    <!-- 查看和编辑弹窗 :wrapperClosable="false" :showFooter="false" 点击查看图片抽屉也会关闭-->
    <Drawer
      :visible.sync="showDrawerEdit"
      :title="drawerType == 'edit' ? '编辑' : '查看'"
      v-loading="btnLoadingEdit"
      @confirm="confirmFormEdit"
      @closed="drawerClosedEdit"
      :showFooter="drawerType == 'edit'"
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
        <el-form-item label="客户性质" prop="merchantsType">
          <el-select
            v-model="formEdit.merchantsType"
            placeholder="请选择客户性质"
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
          <Image-Upload v-model="businessLicense" :max="1" notip></Image-Upload>
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
          <Image-Upload v-model="idCardFront" :max="1" notip></Image-Upload>
          <!-- <span class="tips" v-if="idCardFront.length == 0">请上传身份证正面照片</span> -->
        </el-form-item>
        <el-form-item label="身份证反面" prop="idCardReverse" v-if="drawerType == 'edit'">
          <Image-Upload v-model="idCardReverse" :max="1" notip></Image-Upload>
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
          <SelectUsers v-model="datas" type="user" :multiple="false" placeholder="请选择人员"></SelectUsers>
        </el-form-item>
        <!-- <el-form-item v-if="drawerType == 'edit'">
          <el-button type="primary" @click="confirmFormEdit('formEdit')">完成</el-button>
          <el-button @click="drawerClosedEdit('formEdit')">取消</el-button>
        </el-form-item>-->
      </el-form>
    </Drawer>
  </Table-page>
</template>

<script>
import { isCardId, isPhone } from "@/utils/isValid"
import {
  getList,
  addOfficeAddress,
  getInfo,
  updateOfficeAddress,
  delOfficeAddress,
  getAccount,
  updateAccount
} from "@/request/api/market/merchantsMgmt/merchantManagement";
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        merchantParent: this.$route.query.id,
      },
      search: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        form: [
          {
            name: "storeName",
            label: "商户名称",
            type: "input",
          },
          {
            name: "merchantName",
            label: "联系人",
            type: "input",
          },
          {
            name: "mobile",
            label: "联系电话",
            type: "input",
          },
          {
            name: "status",
            label: "状态",
            type: "select",
          },
          {
            name: "customerType",
            label: "客户性质",
            type: "dict",
            code: "customerType",
          },
          {
            name: "saleCategory",
            label: "拟经营品种",
            type: "dict",
            code: "businessCategory",
          },

        ],
      },

      isShow: false,
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
        merchantName: "",
        mobile: "",
        merchantsType: ""
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

      },
      arrearsSetting: {
        arrearsMeasure: {
          arrearsMeOpCl: 1,
          mainAccountCut: "",
          mainAccountId: "",
          cutWater: 1,
          cutPower: 1,
          mainAccountName: ""
        }

      },

      rules: {
        merchantsType: [
          {
            required: true,
            message: "请输入客户性质",
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
            // message: "请输入身份证号",
            validator: isCardId,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            // message: "请输入手机号",
            validator: isPhone,
            trigger: "blur",
          },
        ],
      },

      saleCategoryList: [],
      customerTypeList: [],
      statusList: [],
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
            message: "请输入客户性质",
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
            // message: "请输入法人身份证号",
            validator: isCardId,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            // message: "请输入法人电话",
            validator: isPhone,
            trigger: "blur",
          },
        ],
      },
      businessLicense: [],//营业执照照片
      idCardFront: [],//身份证正面
      idCardReverse: [],//身份证反面
      accountInfo: [],
      totalAccount: 0
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
    let statusData = [
      {
        value: "1",
        label: "未认证"
      },
      {
        value: "2",
        label: "未生效"
      },
      {
        value: "3",
        label: "合约中"
      },
      {
        value: "4",
        label: "已到期"
      },
    ]
    this.statusList = statusData;
    this.search.form[3].options = statusData;
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
    lease(id, merchantName,type) {
      this.$router.push({
        path: `/leaseManage/${type}`,
        query: {
          id,
          merchantName,
          type
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
      if (this.drawerType == 'edit') {
        _this.$refs["formEdit"].validate((valid) => {
          if (valid) {
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
                _this.$success("操作成功！");
                _this.getList();
              })
              .finally((error) => {
                _this.btnLoadingEdit = false;
              });
          } else {
            _this.$error("请将表单填写完整");
          }
        })
      } else {
        this.showDrawerEdit = false
      }

    },
    // 查看编辑弹窗取消按钮
    drawerClosedEdit() {
      this.showDrawerEdit = false
      this.$refs.formEdit.resetFields();
    },
    handleChange(num) {

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
          if (self.drawerType == 'account') {
            self.accountInfo = response.data.accountInfo
            self.accountInfo.map(item => {
              if (!isNaN(item.accountBalance)) {
                self.totalAccount += item.accountBalance
              }
            })
            self.arrearsSetting = response.data.arrearsSetting

          } else if (self.drawerType == 'edit' || self.drawerType == 'view') {
            self.formEdit = response.data
            let values = response.data.saleCategory.map((item) => {
              return item.id;
            });
            self.formEdit.saleCategory = values
            self.formEdit.merchantsType = response.data.merchantsType.id
            if (response.data.leasingManager != null) {
              self.datas = {
                user_id: response.data.leasingManager.id,
                user_name: response.data.leasingManager.username
              }
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
            this.loading = false;
          });
        });
    },
    operation(type, id) {
      let _this = this
      this.showDrawer = true;
      this.drawerType = type;
      this.itemId = id;
      if (type == "add") {
        this.$set(this.form, 'merchantsType', this.customerTypeList[0].id)
        getAccount({ is_master: 1 }).then(res => {
          console.log(res);
          _this.arrearsSetting.arrearsMeasure.mainAccountName = res.data.rows[0].name
          _this.arrearsSetting.arrearsMeasure.mainAccountId = res.data.rows[0].code_id
        })
      }
      type == "account" && this.getInfo();
    },
    drawerClosed() {
      this.showDrawer = false;
      this.$refs.form.resetFields();
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
            self.form.arrearsSetting = self.arrearsSetting;
            self.form.merchantParent = self.$route.query.id;
            self.form.merchantsCategory = 1
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
            let arrearsSetting = {
              arrearsSetting: self.arrearsSetting
            }
            updateAccount(arrearsSetting, self.itemId)
              .then((res) => {
                self.showDrawer = false;
                self.$success("操作成功！");
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

