<template>
  <el-row style="height: 100%;overflow: auto;padding: 0 20px;">
    <el-col style="height: 100%">
      <div class="listTemplateContainer border hl-container">
        <SearchArea @getTableList="getTableList"/>
        <TableArea />
        <Page @getTableList="getTableList" />
      </div>
    </el-col>
  </el-row>

</template>

<script>
import SearchArea from './searchArea'
import TableArea from './tableArea'
import Page from '../../../components/Pagination/test1'
import {mapState} from 'vuex'
export default {
  computed:{
    ...mapState({
      rootState: state=>state,
      logState: state=>state.Log
    })
  },
  components: {
    SearchArea,
    TableArea,
    Page
  },
  methods:{
    getTableList(current){
      if(current) this.rootState.current = current;
      this.api.post("/log/getList?current=" + this.rootState.current + "&size=" + this.rootState.size, this.logState.searchForm).then((res)=>{
        if(res.code == 200){
          this.logState.tableList = res.data.records;
          this.rootState.total = res.data.total;
          this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", {$}); // 动态设置表格高度
        }
      });
    }
  }
}
</script>