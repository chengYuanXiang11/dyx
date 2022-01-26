<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="this.roleState.dialogType == 'update'?'修改角色':'新增角色'"
      :visible.sync="roleState.dialogShow"
      :close-on-click-modal="false"
      width="500px"
      height="500px"
      @open="_open"
      @close="_close"
      right>
      <el-form ref="form" :rules="rules.ROLE_RULE" :model="roleState.dialogData" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model.trim="roleState.dialogData.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" prop="type">
              <el-select v-model="roleState.dialogData.type" placeholder="请选择">
                <el-option
                  v-for="item in [{label: '甲方公司', value: 1},{label: '经销商', value: 2}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色描述" prop="comment">
              <el-input type="textarea" v-model.trim="roleState.dialogData.comment" :rows="3" placeholder="输入角色描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialogOperator">
        <el-button type="primary" size="small" @click="$emit('addOrUpdateEvent')" :disabled="roleState.dialogBottomShake">保存</el-button>
        <el-button type="primary" size="small" @click="roleState.dialogShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed:{
    ...mapState({ roleState: state=>state.Role })
  },
  methods: {
    _open(){  this.roleState.dialogReset = false; },
    _close(){ this.$refs["form"].resetFields(); },
    inputFouce(){ this.roleState.dialogShowIcon = true }
  }  
}
</script>
<style lang="scss" scoped>
#app .listTemplateContainer .listTemplateDialog .el-autocomplete{
  width: 69% !important;
  .el-input{
    width: 100% !important;
  }
}
</style>
