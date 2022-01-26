<template>
  <div class="listTemplateSearch">
    <el-form ref="logsForm" :inline="true" size="small" :model="logState.searchForm" label-width="80px">
       <el-row>
         <el-col :span="18">
          <el-form-item label="服务名称">
            <el-input v-model.trim="logState.searchForm.appName" clearable placeholder="请输入服务名称"></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input v-model.trim="logState.searchForm.operateName" clearable placeholder="请输入操作人"></el-input>
          </el-form-item>
          <el-form-item label=" ">
           <el-button type="primary" size="small" @click="$emit('getTableList', 1)">查询</el-button>
              <el-button type="primary" size="small" @click="getTableList">重置</el-button>
          </el-form-item>
         </el-col>
       </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import $ from 'jquery'
export default {
  computed:{
    ...mapState({
      logState: state=>state.Log
    })
  },
  methods:{
    getTableList(){
      this.logState.searchForm = { appName: "", operateName: "" };
      this.$emit("getLogsList", 1);
    }
  }
}

</script>
