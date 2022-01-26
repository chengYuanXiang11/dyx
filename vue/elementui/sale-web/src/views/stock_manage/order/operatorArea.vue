<template>
  <div class="listTemplateOperator">
    <el-button type="primary" size="small" @click="$emit('getTableList', 1)">查询当前余额</el-button>
    <el-button type="primary" size="small" @click="resetSearchForm">重置</el-button>
    <!-- <el-button type="primary" size="small" @click="addEvent">新增</el-button> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data(){return{};},
  computed:{
    ...mapState({ orderState: state=>state.Order })
  },
  methods:{
    addEvent(){
      this.orderState.dialogType = 'add';
      this.orderState.dialogShow = true;
      this.plugins.resetObjectValue(this.orderState.dialogData);
    },
    resetSearchForm(){
      this.orderState.searchForm.name = "";
      this.$emit('getTableList', 1)
    }
  }
}
</script>
