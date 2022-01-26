<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="orgState.dialogType"
      :before-close="handleClose"
      :visible.sync="orgState.dialogShow"
      width="500px"
      height="500px"
      @close="closeClear"
      center
    >
      <el-form ref="form" :rules="rules" :model="orgState.dialogForm" label-width="80px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="orgState.dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所在机构" prop="parentId">
          <el-cascader
            v-model="orgState.dialogForm.parentId"
            :options="orgState.tableListTree"
            :show-all-levels="false"
            :props="{ checkStrictly: true, emitPath: false,value:'id' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="公司状态" prop="status">
          <el-select v-model="orgState.dialogForm.status" placeholder="公司状态">
            <el-option label="冻结" value="冻结"></el-option>
            <el-option label="活动" value="活动"></el-option>
            <el-option label=" 关闭/注销" value="关闭/注销"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="orgState.dialogForm.type" placeholder="类型">
            <el-option label="甲方公司" value="1"></el-option>
            <el-option label="经销商" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="orgState.dialogForm.address"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="orgState.dialogForm.comment"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialogOperator">
        <el-button type="primary" size="small" @click="submitForm('form')">确 定</el-button>
        <el-button type="primary" size="small" @click="resetForm('form')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "dialoArea",
  props: {},
  computed: {
    ...mapState({
      orgState: (state) => state.Organization,
    }),
  },
  data() {
    return {
      rules: {
        status: [
          { required: true, message: "请选择公司状态", trigger: "change" },
        ],
        parentId: [
          {
            required: true,
            message: "请选择所在机构",
            trigger: "change",
          },
        ],
        type: [
          { required: true, message: "请选择公司类型", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("upDateOrCreate");
        } else {
          return false;
        }
      });
    },
    //取消
    resetForm(formName) {
      this.orgState.dialogShow = false;
    },
    //关闭
    handleClose(done) {
      done();
    },
    // 弹窗关闭
    closeClear() {
      //清除验证规则
      this.$refs.form.resetFields();
      this.plugins.resetObjectValue(this.orgState.dialogForm);
    },
  },
};
</script>
<style  scoped>
</style>