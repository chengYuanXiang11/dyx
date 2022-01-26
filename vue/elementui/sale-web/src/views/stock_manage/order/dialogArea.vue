<template>
  <div class="listTemplateDialog">
    <el-dialog
      :title="this.orderState.dialogType == 'dingdan'?'查看订单':'查看状态'"
      :visible.sync="orderState.dialogShow"
      :close-on-click-modal="false"
      width="800px"
      height="800px"
      @open="_open"
      right
    >
      <el-timeline
        v-show="this.orderState.dialogType ==='zhuangtai'"
        :style="{height:'500px',overflow:'auto'}"
      >
        <el-timeline-item
          placement="top"
          class="timeline"
          v-for="(item,index) in orderState.dialogData.children "
          :key="index"
        >
          <el-card>
            <h4>{{item.name}}</h4>
            <h4>{{item.nodes}}</h4>
            <p>{{item.receipttime}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-col v-show="this.orderState.dialogType =='dingdan'">
        <el-col :span="12"  class="Orderform"> 
            <div>订单编号:{{orgList.id}}</div>
            <div>货物名称:{{orgList.name}}</div>
            <div>货物说明:{{orgList.comment}}</div>
            <div>货物数量:{{orgList.locked}}</div>
            <div>货物单位:{{orgList.unit}}</div>
            <div>货物单价:{{orgList.price}}</div>
        </el-col>
        <el-col :span="12"  class="Orderform">  
            <div>发货机构:{{orgList.sendname}}</div>
            <div>发货时间:{{orgList.deliverytime}}</div>
            <div>收货机构:{{orgList.Consigne}}</div>
            <div>预计收获时间:{{orgList.receipttime}}</div>
            <div>当前订单状态:{{orgList.receipttime}}</div>
            <div>货物总价:{{orgList.Zprice}}</div>
        </el-col>

      </el-col>

      <!-- <el-form ref="form" :rules="rules.USER_ROLE" :model="orderState.dialogData" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="orgId">
              <el-cascader 
                v-model="orderState.dialogData.orgId"
                :props="{ emitPath: false, checkStrictly: true, value: 'id' }"
                :options="orgList" 
                :show-all-levels="false">
              </el-cascader>
            </el-form-item>
            <el-form-item label="用户名称" prop="name">
              <el-input v-model.trim="orderState.dialogData.name" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
              <el-input v-model.trim="orderState.dialogData.mobile" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!orderState.dialogData">
              <el-input v-model.trim="orderState.dialogData.password" placeholder="请输入用户密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="comment" v-if="orderState.dialogData">
              <el-input v-model.trim="orderState.dialogData.passwordNew" placeholder="请输入新密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色列表" prop="roleList">              
              <el-select v-model="orderState.dialogData.roleList" multiple placeholder="请选择">
                <el-option
                  v-for="item in [{label: '角色1',value: 1},{label: '角色2',value: 2}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录账户" prop="account">
              <el-input v-model.trim="orderState.dialogData.account" placeholder="请输入登录账户"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="comment">
              <el-input v-model.trim="orderState.dialogData.email" placeholder="请输入用户邮箱"></el-input>
            </el-form-item>
            <el-form-item label="用户地址" prop="address">
              <el-input v-model.trim="orderState.dialogData.address" placeholder="请输入用户地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>-->
      <div class="dialogOperator">
        <!-- <el-button
          type="primary"
          size="small"
          @click="$emit('addOrUpdateEvent')"
          :disabled="orderState.dialogBottomShake"
        >下载</el-button>-->
        <el-button type="primary" size="small" @click="orderState.dialogShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({ orderState: (state) => state.Order }),
  },
  data() {
    return {
      orgList: [],
    };
  },
  methods: {
    _open() {
      this.orderState.dialogReset = false;
      // this.getOrgTree();
      this.orgList = this.orderState.dialogData;
    },

    //获取机构列表
    getOrgTree() {
      this.api.get("/organization/listTree").then((res) => {
        if (res.code == 200) {
          this.orgList = res.data;
        }
      });
    },
    //获取机构列表
    getRoleList(orgId) {},
    inputFouce() {
      this.orderState.dialogShowIcon = true;
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
.Orderform{
  display: flex;
  flex-direction: column;
  justify-content: center;
  div{
    padding: 20px;
  }
}
.dingload {
  height: 650px !important;
  overflow: auto;
}
.timeline:last-child {
  color: red;
}
</style>
