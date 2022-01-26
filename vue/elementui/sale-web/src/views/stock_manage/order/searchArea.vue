<template>
  <div class="listTemplateSearch">
    <el-form ref="roleForm" :inline="true" size="small" :model="orderState.searchForm" label-width="80px">
       <el-row>
         <el-col :span="24">
          <el-form-item label="商品名称">
            <el-input v-model.trim="orderState.searchForm.name" clearable placeholder="请输入商品名称"></el-input>
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
    ...mapState({ orderState: state=>state.Order })
  }
}
</script>
