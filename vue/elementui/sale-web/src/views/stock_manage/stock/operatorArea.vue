<template>
  <div class="listTemplateOperator">
    <el-button type="primary" size="small" @click="$emit('getTableList', 1)">查询</el-button>
    <el-button type="primary" size="small" @click="resetSearchForm">重置</el-button>
    <!-- <el-button type="primary" size="small" @click="addEvent">新增</el-button> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data(){return{};},
  computed:{
    ...mapState({ stockState: state=>state.Stock })
  },
  methods:{
    addEvent(){
      this.stockState.dialogType = 'add';
      this.stockState.dialogShow = true;
      this.plugins.resetObjectValue(this.stockState.dialogData);
    },
    resetSearchForm(){
      this.stockState.searchForm.name = "";
      this.$emit('getTableList', 1)
    }
  }
}
</script>
