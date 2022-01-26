<template>
  <div class="listTemplateSearch">
    <el-form ref="roleForm" :inline="true" size="small" :model="stockState.searchForm" label-width="80px">
       <el-row>
         <el-col :span="24">
          <el-form-item label="用户名称">
            <el-input v-model.trim="stockState.searchForm.name" clearable placeholder="请输入用户称"></el-input>
          </el-form-item>
         </el-col>
       </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  computed:{
    ...mapState({ stockState: state=>state.User })
  }
}
</script>
