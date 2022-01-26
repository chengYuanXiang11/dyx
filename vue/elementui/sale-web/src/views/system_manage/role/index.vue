<template>
  <el-row style="height:100%;padding: 0 20px;">
    <el-col style="height:100%">
      <div class="listTemplateContainer border hl-container">
        <SearchArea />
        <OperatorArea @getTableList="getTableList"/>
        <TableArea @deleteEvent="deleteEvent" />
        <DialogArea ref="DialogArea" @addOrUpdateEvent="addOrUpdateEvent" />
        <Page @getTableList="getTableList" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SearchArea from './searchArea'
import OperatorArea from './operatorArea'
import TableArea from './tableArea'
import DialogArea from './dialogArea'
import Page from '../../../components/Pagination/test1'
import {mapState} from 'vuex'
export default {
  computed:{
    ...mapState({
      rootState: state=>state,
      roleState: state=>state.Role
    })
  },
  components: {
    SearchArea,
    OperatorArea,
    TableArea,
    DialogArea,
    Page,
  },
  data(){return{};},
  created(){ this.getTableList(); },
  methods:{
    // 获取角色列表
    getTableList(current){
      if(current) this.rootState.current = current;
      this.api.post("/role/getList?current=" + this.rootState.current + "&size=" + this.rootState.size, this.roleState.searchForm).then((res)=>{
        if(res.code == 200){
          this.roleState.tableList = res.data.records;
          this.rootState.total = res.data.total;
          this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", {$}); // 动态设置表格高度
        }
      });
    },
    // 新增或修改角色
    addOrUpdateEvent(){
      this.$refs.DialogArea.$refs["form"].validate((valid)=>{
        if(valid){
          this.$store.dialogBottomShake = true;
          this.$store.dispatch("ROOT_ADD_OR_UPDATE", {
            that: this, 
            url: 'role', 
            type: this.roleState.dialogType,
            data: this.roleState.dialogData, 
            cb:()=>{
              this.roleState.dialogShow = false;
              this.roleState.selectList = [];
              this.getTableList(1);
          }}); 
        }
      })           
    },
    // 删除角色， idList为选中数据的id集合
    deleteEvent(idList){      
      this.$store.dispatch("ROOT_CONFIRM", {that: this, msg: '此操作将删除记录, 是否继续?',cb: ()=>{
          this.api.put("/role/deleteList",{idList}).then((res)=>{
            if(res.code == 200){
              this.getTableList();
              this.roleState.selectList = [];
              this.$message.success(res.msg);
            }
          });
        }
      })
    }
  }
}
</script>
