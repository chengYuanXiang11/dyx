<template>
  <div>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
      :rules="rules"
    >
      <el-form-item label="活动区域" prop="region">
        <el-select
          v-model="dynamicValidateForm.region.country"
          placeholder="请选择国家"
        >
          <el-option label="国家一" value="USA"></el-option>
          <el-option label="国家二" value="China"></el-option>
        </el-select>
        <el-select
          v-model="dynamicValidateForm.region.city"
          placeholder="请选择城市"
        >
          <el-option label="城市一" value="shanghai"></el-option>
          <el-option label="城市二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "engFrom",
  data() {
    return {
      dynamicValidateForm: {
        region: {
          city: "",
        },

        email: "",
      },
      rules: {
        region: [
          {
            type: "object",
            required: true,
            trigger: "change",
            fields: {
              country: {
                required: true,
                message: "请选择国家",
                trigger: "blur",
              },
              city: { required: true, message: "请选择城市", trigger: "blur" },
            },
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      console.log(this.dynamicValidateForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClick(tab, event) {
      // console.log(tab)
      this.rowIndex = this.activeName;
      this.tableData = [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ];
    },
  },
};
</script>
<style scoped>
::v-deep .el-table {
  width: 99.999% !important;
}
</style>