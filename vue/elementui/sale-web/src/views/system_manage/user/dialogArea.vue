<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="userState.dialogType == 'update'?(userState.activeName==2)?'修改经销商':'修改用户':(userState.activeName==2)?'新增经销商':'新增用户'"
      :visible.sync="userState.dialogShow"
      :close-on-click-modal="false"
      width="800px"
      height="500px"
      @open="_open"
      @close="_close"
      right>
      <el-form ref="form" :rules="rules.USER_ROLE" :model="userState.dialogData" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="orgId" v-if="userState.activeName==2">
              <el-cascader 
                v-model="userState.dialogData.orgId"
                :props="{ emitPath: false, checkStrictly: true, value: 'id' }"
                :options="orgList" 
                :show-all-levels="false">
              </el-cascader>
            </el-form-item>
            <el-form-item label="用户名称" prop="name">
              <el-input v-model.trim="userState.dialogData.name" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
              <el-input v-model.trim="userState.dialogData.mobile" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!userState.dialogData">
              <el-input v-model.trim="userState.dialogData.password" placeholder="请输入用户密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="comment" v-if="userState.dialogData">
              <el-input v-model.trim="userState.dialogData.passwordNew" placeholder="请输入新密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色列表" prop="roleList"  v-if="userState.dialogData.type===2">              
              <el-select v-model="userState.dialogData.roleList" multiple placeholder="请选择">
                <el-option
                  v-for="item in characterList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录账户" prop="account">
              <el-input v-model.trim="userState.dialogData.account" placeholder="请输入登录账户"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="comment">
              <el-input v-model.trim="userState.dialogData.email" placeholder="请输入用户邮箱"></el-input>
            </el-form-item>
            <el-form-item label="用户地址" prop="address">
              <el-input v-model.trim="userState.dialogData.address" placeholder="请输入用户地址"></el-input>
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
      characterList:[]
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
      this.api.get("/organization/listTree?type="+this.userState.activeName).then((res)=>{
        if(res.code == 200){
          this.orgList = res.data;
          console.log(res.data)
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
