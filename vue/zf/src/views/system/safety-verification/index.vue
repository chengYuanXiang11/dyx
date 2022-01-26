<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    @pagination="handlePagination"
  >
    <!-- this.form = {
      status: 1,
      validate: {
        status: 0,
        validate_type: [],
      },
      check_duration: {
        status: 0,
        duration: "",
      },
    }; -->
    <el-table v-loading="loading" :data="tableData" border height="100%">
      <el-table-column label="参数名称" prop="configName" />
      <el-table-column label="参数值" align="center">
        <template slot-scope="scope">
          <el-image
            class="homepagelogo"
            :src="scope.row.configValue"
            :preview-src-list="[scope.row.configValue]"
            v-if="scope.row.configKey == '1logo'"
          >
          </el-image>
          <span v-else-if="scope.row.configKey == 'pwdmemorytime'">{{
            scope.row.configValue == "10000" ? "长期" : scope.row.configValue
          }}</span>
          <span v-else-if="scope.row.configKey == 'checkgoods'"></span>
          <span v-else>{{ scope.row.configValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="configType" />

      <el-table-column
        label="备注"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['permission:role:{id}:delete']"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Drawer
      :visible.sync="parameterDialog"
      :title="DrawerTitle"
      @confirm="confirmForm"
      v-loading="confirmLoading"
      @closed="close"
      :size="700"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
        :rules="rules"
        label-suffix=":"
      >
        <el-form-item
          :label="stateLabel"
          prop="homepagelogo"
          v-if="configKey !== 'resetpwd' && configKey !== 'checkgoods'"
        >
          <el-switch
            v-model="form.state"
            active-color="#048790"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="2"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="时长 (天)"
          prop="duration"
          v-if="configKey == 'homepagelogo' || configKey == 'homesystemname'"
        >
          <el-input-number
            v-model="form.duration"
            controls-position="right"
            :min="1"
            :step="1"
            step-strictly
            :controls="false"
            placeholder="请输入登录时长，尺度为天"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item
          label-width="20px"
          prop="pwdmemorytime"
          v-else-if="configKey == 'singlesignon' && form.state === '1'"
        >
          <span>在场时长小于</span>
          <el-input-number
            class="input-number"
            v-model="form.durationGoods"
            controls-position="right"
            :min="1"
            :step="1"
            step-strictly
            :controls="false"
            placeholder="请输入"
          >
          </el-input-number>
          <span>分钟时，允许退货</span>
        </el-form-item>
        <!-- <el-form-item
          label="记住密码时长"
          prop="pwdmemorytime"
          v-else-if="configKey == 'pwdmemorytime'"
        >
          <el-select
            v-model="form.pwdmemorytime"
            placeholder="请选择登录记住密码时长"
          >
            <el-option label="7天" value="7"> </el-option>
            <el-option label="15天" value="15"> </el-option>
            <el-option label="30天" value="30"> </el-option>
            <el-option label="长期" value="10000"> </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="默认密码"
          prop="resetpwd"
          v-else-if="configKey == 'resetpwd'"
        >
          <el-input
            v-model="form.resetpwd"
            placeholder="请输入默认密码"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="缓存有效期"
          prop="checkgoods"
          v-else-if="configKey == 'checkgoods'"
        >
          <el-select
            v-model="form.checkgoods"
            placeholder="app端登录缓存有效期"
          >
            <el-option label="7天" value="7"> </el-option>
            <el-option label="15天" value="15"> </el-option>
            <el-option label="30天" value="30"> </el-option>
            <el-option label="长期" value="10000"> </el-option>
          </el-select>
        </el-form-item> -->
        <!-- 商品检查 -->
        <div v-if="configKey === 'checkgoods'">
          <DuplicateForm
            :form="form.configValue"
            labelWidth="120px"
            ref="formRef"
          ></DuplicateForm>
          <el-form-item label="调高核实">
            <el-switch
              v-model="form.configValue.heighten_verify.status"
              active-color="#048790"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="2"
              @change="verify_change($event,'heighten_verify')"
            ></el-switch>
            <DuplicateForm
              ref="heightenRef"
              :form="form.configValue.heighten_verify"
              v-if="form.configValue.heighten_verify.status === '1'"
            ></DuplicateForm>
          </el-form-item>
          <el-form-item label="调低核实">
            <el-switch
              v-model="form.configValue.turn_down_verify.status"
              active-color="#048790"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="2"
              @change="verify_change($event,'turn_down_verify')"
            ></el-switch>
            <DuplicateForm
              ref="turnDownRef"
              :form="form.configValue.turn_down_verify"
              v-if="form.configValue.turn_down_verify.status === '1'"
            ></DuplicateForm>
          </el-form-item>
        </div>

        <el-form-item label="备注" v-if="configKey !== 'singlesignon'">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </Drawer>
  </Table-page>
</template>

<script>
import { getList, updateParameter } from "@/request/api/system/parameter";
import DuplicateForm from "./DuplicateForm.vue";
export default {
  name: "Parameter",
  data() {
    return {
      search: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
      // 角色表格数据
      tableData: [
        {
          id: 214,
          create_datetime: "2021-09-13 13:51:03",
          update_datetime: "2021-12-07 11:53:35",
          creator_name: "test@999992",
          dept_belong_id: "35",
          configName: "web端登录记住密码时长",
          configKey: "homepagelogo",
          configValue:
            "http://mrppcapiuat.yugu8.com/pc/media/system/2021-12-07/9620fd2b-b883-4b0f-a712-5b61945004a5.png",
          configType: "图片",
          remark: "320*1200",
        },
        {
          id: 215,
          create_datetime: "2021-09-13 13:52:17",
          update_datetime: "2021-09-14 15:22:20",
          creator_name: "test@999992",
          dept_belong_id: "35",
          configName: "app端登录缓存有效期",
          configKey: "homesystemname",
          configValue: "智慧农批",
          configType: "文本",
          remark: "系统名称",
        },
        {
          id: 217,
          create_datetime: "2021-09-13 13:54:25",
          update_datetime: "2021-09-14 15:22:33",
          creator_name: "test@999992",
          dept_belong_id: "35",
          configName: "web单点登录",
          configKey: "pwdmemorytime",
          configValue: "7",
          configType: "文本",
          remark: "单位（天）",
        },
        {
          id: 218,
          create_datetime: "2021-09-13 13:54:58",
          update_datetime: "2021-09-14 15:22:40",
          creator_name: "test@999992",
          dept_belong_id: "35",
          configName: "重置的默认密码",
          configKey: "resetpwd",
          configValue: "11111111",
          configType: "文本",
          remark: "12345678",
        },
        {
          id: 219,
          create_datetime: "2021-09-13 13:55:13",
          update_datetime: "2021-09-14 15:22:53",
          creator_name: "test@999992",
          dept_belong_id: "35",
          configName: "商品检查",
          configKey: "checkgoods",
          configValue: "10000",
          configType: "文本",
          remark: "单位（天）",
        },
        {
          id: 220,
          create_datetime: "2021-09-13 13:56:41",
          update_datetime: "2021-09-14 15:33:30",
          creator_name: "test@999992",
          dept_belong_id: "35",
          configName: "退货设置",
          configKey: "singlesignon",
          configValue: "1",
          configType: "文本",
          remark: "单点登录是否开启",
        },
      ],
      queryParams: {},
      parameterDialog: false,
      confirmLoading: false,
      form: {
        state: "1",
        duration: 30,
        resetpwd: "",
        configValue: {
          validate: {
            status: "0",
            validate_type: [],
          },
          check_duration: {
            status: "0",
            duration: "",
          },
          heighten_verify: {
            status: "0",
            validate: {
              status: "0",
              validate_type: [],
            },
            check_duration: {
              status: "0",
              duration: "",
            },
          },
          turn_down_verify: {
            status: "0",
            validate: {
              status: "0",
              validate_type: [],
            },
            check_duration: {
              status: "0",
              duration: "",
            },
          },
        },

        durationGoods: 30,
      },
      // 验证可优化
      rules: {
        duration: [
          {
            required: true,
            message: "请填写有效时长",
            trigger: "change",
          },
        ],
        homesystemname: [
          {
            required: true,
            message: "首页系统名称不能为空",
            trigger: "blur",
          },
        ],
        pwdmemorytime: [
          {
            required: true,
            message: "请选择登录记住密码时长",
            trigger: "change",
          },
        ],
        resetpwd: [
          {
            required: true,
            message: "请输入重置的默认密码",
            trigger: "change",
          },
          {
            pattern: /^[0-9A-Za-z~!@#$%^&*]{8,16}$/,
            message: "密码为8-16位数字、字母、符号",
            trigger: "blur",
          },
        ],
        checkgoods: [
          {
            required: true,
            message: "请选择app端登录缓存有效期",
            trigger: "change",
          },
        ],
        singlesignon: [
          {
            required: true,
            message: "请选择是否开启单点登录",
            trigger: "change",
          },
        ],
      },
      configKey: "",
      configName: "",
    };
  },
  created() {
    this.getList();
    this.setDefaultValue();
  },
  computed: {
    stateLabel() {
      if (this.configKey === "singlesignon") {
        return "是否允许退货";
      } else {
        return "状态";
      }
    },
    DrawerTitle() {
      return `编辑 ${this.configName}`;
    },
  },
  components: { DuplicateForm },
  methods: {
    verify_change(e,type) {
      this.$set(this.form.configValue, type, {
        status: e,
        validate: {
          status: 0,
          validate_type: [],
        },
        check_duration: {
          status: 0,
          duration: "",
        },
      });
    },
    // 分页方法
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.getList();
    },
    getList() {
      this.loading = true;
      getList({ type: "2" })
        .then((res) => {
          this.tableData = res.data.results;
          this.search.total = res.data.count;
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    handleUpdate(row) {
      if(typeof row.configValue !=='object'){
         if (typeof JSON.parse(row.configValue) === "string") {
        row.configValue = JSON.parse(JSON.parse(row.configValue));
      } else {
        row.configValue = JSON.parse(row.configValue);
      }
      }
     
      this.form = JSON.parse(JSON.stringify(row));
      this.configName = row.configName;

      this.configKey = row.configKey;

      this.parameterDialog = true;
    },
    setDefaultValue() {
      this.form = {};
    },
    close() {
      this.$refs["form"].resetFields();
    },
    // 验证
    confirmForm() {
      // 编辑商品检查时候需要验证子组件是否通过
      if (this.configKey === "checkgoods") {
        let arr = [];
        if (this.$refs?.formRef) {
          arr.push(this.$refs.formRef.validate());
        }
        // 商品验证需要
        if (this.$refs?.heightenRef) {
          arr.push(this.$refs.heightenRef.validate());
        }
        if (this.$refs?.turnDownRef) {
          arr.push(this.$refs.turnDownRef.validate());
        }
        Promise.all(arr)
          .then((res) => {
            updateParameter(this.form.id, this.form)
              .then((res) => {
                this.close();
                this.getList();
                this.$success("修改成功！");
              })
              .finally((error) => {
                this.parameterDialog = false;
              });
          })
          .catch((err) => {
            console.log("验证no");
          });
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            // let data = {};
            // if (this.configKey == "homepagelogo") {
            //   data.configValue = this.form.homepagelogo[0];
            // } else {
            //   data.configValue = this.form[self.configKey];
            // }
            // data.remark = this.form.remark;
            //   updateParameter(self.form.id, data)
            //     .then((res) => {
            //       this.close();
            //       this.getList();
            //       this.$success("修改成功！");
            //     })
            //     .finally((error) => {
            //       self.confirmLoading = false;
            //     });
          }
        });
      }
    },
    // 提交
    submitForm() {},
  },
};
</script>
<style lang="scss" scoped>
.input-number {
  margin: 0px 10px;
}
</style>