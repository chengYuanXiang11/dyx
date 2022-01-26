<template>
  <el-form
    :rules="rules"
    ref="form"
    :model="form"
    :label-width="labelWidth"
    label-suffix=":"
  >
    <el-form-item label="是否验证">
      <el-switch
        v-model="form.validate.status"
        active-color="#048790"
        inactive-color="#ff4949"
        active-value="1"
        inactive-value="0"
        @change="validateChange"
      ></el-switch>
      <el-form-item
        label-width="100px"
        class="lableLeft"
        prop="validate"
        label="验证方式"
        label-position="left"
        v-if="form.validate.status === '1'"
      >
        <el-checkbox-group v-model="form.validate.validate_type">
          <el-checkbox label="1">人脸验证</el-checkbox>
          <el-checkbox label="2">指纹验证</el-checkbox>
          <el-checkbox label="3">密码验证</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form-item>
    <el-form-item label="检查时长" label-position="left">
      <el-switch
        v-model="form.check_duration.status"
        active-color="#048790"
        inactive-color="#ff4949"
        active-value="1"
        inactive-value="0"
        @change="validateDurationChange"
      ></el-switch>
      <el-form-item
        class="lableLeft"
        label-width="100px"
        prop="check_duration"
        label="时长"
        v-if="form.check_duration.status === '1'"
      >
        <el-input-number
          v-model="form.check_duration.duration"
          :min="1"
          :step="1"
          step-strictly
          :controls="false"
          placeholder="请输入"
        >
        </el-input-number>
        <span class="check_size">分钟内，为正常检查</span>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Parameter",
  data() {
    return {
      rules: {
        validate: [
          {
            type: "object",
            required: true,
            trigger: "change",
            fields: {
              validate_type: {
                type: "array",
                required: true,
                message: "请勾选验证方式",
                trigger: "change",
              },
            },
          },
        ],
        check_duration: [
          {
            type: "object",
            required: true,
            trigger: "change",
            fields: {
              duration: {
                type: "number",
                required: true,
                message: "请输入时长",
                trigger: "change",
              },
            },
          },
        ],
      },
    };
  },
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    labelWidth: {
      type: String,
      default: "88px",
    },
  },
  created() {
    // console.log('this.form',this.form)

  },
  methods: {
    validateChange() {
      console.log(this.form);
      this.$set(this.form.validate, "validate_type", []);
    },
    validate() {
      return this.$refs.form.validate();
    },
    validateDurationChange() {
      this.$set(this.form.check_duration, "duration", 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.lableLeft /deep/ label {
  text-align: left;
  width: 88px !important;
}
// 输入框右侧字体
.check_size{
  margin-left: 5px;
}
</style>