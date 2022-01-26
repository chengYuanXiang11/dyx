<template>
  <div class="listTemplateSearch">
    <el-form ref="roleForm" :inline="true" size="small" :model="roleState.searchForm" label-width="80px">
       <el-row>
         <el-col :span="24">
          <el-form-item label="菜单名称">
            <el-input v-model.trim="roleState.searchForm.name" clearable placeholder="请输入角色名称"></el-input>
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
    ...mapState({ roleState: state=>state.Role })
  }
}
</script>
