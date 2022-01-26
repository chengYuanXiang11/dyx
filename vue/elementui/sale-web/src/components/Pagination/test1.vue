<template>
  <div class="listTemplatePage">
    <el-pagination
      small
      background
      layout="prev, pager, next, jumper"
      :page-size="rootState.size"
      :current-page="rootState.current"
      @current-change="changePage"
      :total="rootState.total">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed:{
    ...mapState({
      rootState: state=>state
    })
  },
  data(){return{};},
  methods: {
    changePage(val){
      this.rootState.current = val;
      this.$emit("getTableList");
    }
  }

}

</script>
<style lang="scss" scoped>
.listTemplatePage{
  width: 100%;
  text-align: right;
  padding: 10px 25px 10px 0;
  height: 30px;
  line-height: 30px;
}
</style>
