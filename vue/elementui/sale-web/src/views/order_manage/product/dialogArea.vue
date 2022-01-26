<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="this.userState.dialogType == 'update'?'修改产品':'新增产品'"
      :visible.sync="userState.dialogShow"
      :close-on-click-modal="false"
      width="500px"
      height="500px"
      @open="_open"
      @close="_close"
      right>
      <el-form ref="form" :rules="rules.USER_ROLE" :model="userState.dialogData" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model.trim="userState.dialogData.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="最新价格" prop="name">
              <el-input v-model.trim="userState.dialogData.name" placeholder="请输入最新价格"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" prop="name">
              <el-input v-model.trim="userState.dialogData.name" placeholder="请输入库存数量"></el-input>
            </el-form-item>
            <el-form-item label="销售数量" prop="name">
              <el-input v-model.trim="userState.dialogData.name" placeholder="请输入销售数量"></el-input>
            </el-form-item>
            <el-form-item label="产品描述" prop="name">
              <el-input v-model.trim="userState.dialogData.name" placeholder="请输入产品描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialogOperator">
        <el-button type="primary" size="small" @click="$emit('addOrUpdateEvent')" :disabled="userState.dialogBottomShake">保存</el-button>
        <el-button type="primary" size="small" @click="userState.dialogShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed:{
    ...mapState({ userState: state=>state.User })
  },
  data(){
    return {
      orgList: [],
    }     
  },
  methods: {
    _open(){  
      this.userState.dialogReset = false;
      this.getOrgTree();
    },
    _close(){ this.$refs["form"].resetFields(); },
    //获取机构列表
    getOrgTree(){
      this.api.get("/organization/listTree").then((res)=>{
        if(res.code == 200){
          this.orgList = res.data;
        }
      })
    },
    //获取机构列表
    getRoleList(orgId){

    },
    inputFouce(){ this.userState.dialogShowIcon = true }
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
