<template>
  <div class="listTemplateOperator">
    <el-button type="primary" size="small" @click="$emit('getTableList', 1)">查询</el-button>
    <el-button type="primary" size="small" @click="resetSearchForm">重置</el-button>
    <el-button type="primary" size="small" v-if="plugins.isPermission('ADD')" @click="addEvent">新增</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data(){return{};},
  computed:{
    ...mapState({ menuState: state=>state.Menu })
  },
  methods:{
    addEvent(){
      this.menuState.dialogType = 'add';
      this.menuState.dialogShow = true;
      this.menuState.cascader =""
      this.plugins.resetObjectValue(this.menuState.dialogData);
    },
    resetSearchForm(){
      this.menuState.searchForm.name = "";
      this.$emit('getTableList', 1)
    }
  }
}
</script>
