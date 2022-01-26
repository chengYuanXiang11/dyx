<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="this.menuState.dialogType == 'update'?'修改菜单':'新增菜单'"
      :visible.sync="menuState.dialogShow"
      :close-on-click-modal="false"
      @selection-change="handleSelectionChange"
      width="800px"
      height="500px"
      @open="_open"
      @close="_close"
      right
    >
      <el-form
        ref="menuForm"
        :rules="rules.MENUMANAGER_RULE"
        :model="menuState.dialogData"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="父级菜单" required>
                <!-- 级联 -->
                <el-cascader
                  ref="tree"
                  :options="menuState.listRoot"
                  v-model="menuState.cascader"
                  :show-all-levels="false"
                  :props="{value:'id',label:'name',checkStrictly: true}"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model.trim="menuState.dialogData.name" placeholder="请输入菜单名称"></el-input>
              </el-form-item>
              <el-form-item label="资源路径" prop="menuRoute">
                <el-input v-model.trim="menuState.dialogData.menuRoute " placeholder="输入资源路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="访问路径" prop="url">
                <el-input v-model.trim="menuState.dialogData.url " placeholder="输入访问路径"></el-input>
              </el-form-item>

              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model.trim="menuState.dialogData.icon " placeholder="输入菜单图标"></el-input>
              </el-form-item>
              <el-form-item label="菜单按钮" prop="resType">
                <el-select v-model="menuState.dialogData.resType " placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialogOperator">
        <el-button
          type="primary"
          size="small"
          @click="$emit('addOrUpdateEvent')"
          :disabled="menuState.dialogBottomShake"
        >保存</el-button>
        <el-button type="primary" size="small" @click="menuState.dialogShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      options: [
        {
          value: "menu",
          label: "菜单",
        },
        {
          value: "button",
          label: "按钮",
        },
      ],
    };
  },
  computed: {
    ...mapState({ menuState: (state) => state.Menu }),
  },
  methods: {
    //获取parentId和id
    handleChange(id) {
      //如果是修改
      if (this.menuState.dialogType == "update") {
        let label = this.$refs.tree.getCheckedNodes()[0]
          ? this.$refs.tree.getCheckedNodes()[0].label
          : "";
        if (id[0] !== undefined) {
          this.menuState.dialogData.name = label;
          this.menuState.dialogData.id = id[id.length - 1];
          this.menuState.dialogData.parentId = id[id.length - 2];
          this.api
            .get("/menu/getById?id=" + this.menuState.dialogData.id)
            .then((res) => {
              this.menuState.dialogData = res.data;
            });
        }
      } else {
        this.menuState.dialogData.parentId = id[id.length - 1];
      }
    },
    _open() {
      this.menuState.dialogReset = false;
    },
    _close() {
      this.$refs["menuForm"].resetFields();
    },
    handleSelectionChange(val) {
      console.log(val);
    },
  },
};
</script>
<style lang="scss" scoped>
#app .listTemplateContainer .listTemplateDialog .el-autocomplete {
  width: 69% !important;
  .el-input {
    width: 100% !important;
  }
}
</style>
