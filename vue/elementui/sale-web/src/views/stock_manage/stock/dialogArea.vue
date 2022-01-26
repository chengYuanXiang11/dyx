<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="this.stockState.dialogType == 'update'?'锁定库存':'出库操作'"
      :visible.sync="stockState.dialogShow"
      :close-on-click-modal="false"
      width="800px"
      height="500px"
      @open="_open"
      @close="_close"
      right>
      <el-form
      
        ref="form"
       :rules="rules"
        :model="stockState.dialogData"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item label="所属机构" prop="orgId">
              <el-cascader
                v-model="stockState.dialogData.orgId"
                :props="{ emitPath: false, checkStrictly: true, value: 'id' }"
                :options="orgList"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item> -->
                <el-form-item label="所属机构" prop="sendname">
              <el-input v-model.trim="stockState.dialogData.sendname" :disabled="true" placeholder="请输入发货机构名称"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model.trim="stockState.dialogData.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="订单描述" prop="comment">
              <el-input v-model.trim="stockState.dialogData.comment" placeholder="请输入订单详情"></el-input>
            </el-form-item>
             <el-form-item label="商品单价" prop="price">
              <el-input v-model.trim="stockState.dialogData.price" placeholder="可修改商品单价"></el-input>
            </el-form-item>
             <el-form-item label="订单总价" prop="Zprice">
              <el-input v-model.trim="Zprice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="商品列表" prop="roleList">
              <el-select v-model="stockState.dialogData.roleList" multiple placeholder="请选择">
                <el-option
                  v-for="item in [{label: '角色1',value: 1},{label: '角色2',value: 2}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
             <el-form-item label="收货机构" prop="takename">
              <el-input v-model.trim="stockState.dialogData.takename" placeholder="请输入收货机构"></el-input>
            </el-form-item>
             <el-form-item label="联系方式" prop="phone">
              <el-input v-model.trim="stockState.dialogData.phone" placeholder="请输入收货机构联系方式"></el-input>
            </el-form-item>
            <el-form-item label="货位号" prop="itemname" >
              <el-input :disabled="true" v-model.trim="stockState.dialogData.itemname" ></el-input>
            </el-form-item>
            <el-form-item label="可用库存"  prop="Aavailable">
              <el-input :disabled="true" v-model.trim="stockState.dialogData.Aavailable"></el-input>
            </el-form-item>
            <el-form-item :label="this.stockState.dialogType == 'update'?'锁定数量':'出库数量'" prop="locked"   :rules="[
                  { required: true, message: '锁定数量不能为空' },
                  { type: 'number', message: '锁定数量为数字值'},
                  { type: 'number',max:stockState.dialogData.Aavailable,message:'超出了库存量'},
                  { type: 'number',min:1,message:'锁定量必须大于0'}

        
                ]">
              <el-input  v-model="Locked" placeholder="请输入用户地址"
               
              ></el-input>
            </el-form-item>
           
          </el-col>
        </el-row>
      </el-form>
      <div class="dialogOperator">
        <el-button
          type="primary"
          size="small"
          @click="$emit('addOrUpdateEvent')"
          :disabled="stockState.dialogBottomShake"
        >保存</el-button>
        <el-button type="primary" size="small" @click="stockState.dialogShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({ stockState: (state) => state.Stock }),
    Zprice(){
      this.stockState.dialogData.Zprice= this.stockState.dialogData.price * this.stockState.dialogData.locked
     if(isNaN(this.stockState.dialogData.Zprice))this.stockState.dialogData.Zprice=0
     return   this.stockState.dialogData.Zprice
    },
    Locked:{
      set:function(value){
        if(value === '') value =0
        this.stockState.dialogData.locked= parseInt(value)
			},
      get:function(value){
      return parseInt(this.stockState.dialogData.locked)
      }
    }
  },
  data() {
    return {
      orgList: [],
    };
  },
  methods: {
    _open() {
      this.stockState.dialogReset = false;
      this.getOrgTree();
      this.stockState.dialogData =  this.stockState.tableList[0]
      console.log( this.stockState.dialogData)
    },
    _close() {
      this.$refs["form"].resetFields();
    },
    //获取机构列表
    getOrgTree() {
      // this.api.get("/organization/listTree").then((res) => {
      //   if (res.code == 200) {
      //     this.orgList = res.data;
      //   }
      // });
    },
    //获取机构列表
    getRoleList(orgId) {},
    inputFouce() {
      this.stockState.dialogShowIcon = true;
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
