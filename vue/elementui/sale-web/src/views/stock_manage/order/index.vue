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
      orderState: state=>state.Order
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
    // 获取用户列表
    getTableList(current){
      if(current) this.rootState.current = current;
          this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", {$}); // 动态设置表格高度
      // this.api.post("/user/getList?current=" + this.rootState.current + "&size=" + this.rootState.size, this.orderState.searchForm).then((res)=>{
      //   if(res.code == 200){
      //     this.orderState.tableList = res.data.records;
      //     this.rootState.total = res.data.total;
      //     this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", {$}); // 动态设置表格高度
      //   }
      // });
    },
    // 新增或修改用户
    addOrUpdateEvent(){
      this.$refs.DialogArea.$refs["form"].validate((valid)=>{
        if(valid){
          // this.$store.dialogBottomShake = true;
          // this.$store.dispatch("ROOT_ADD_OR_UPDATE", {
          //   that: this, 
          //   url: 'user', 
          //   type: this.orderState.dialogType,
          //   data: this.orderState.dialogData, 
          //   cb:()=>{
          //     this.orderState.dialogShow = false;
          //     this.orderState.selectList = [];
          //     this.getTableList(1);
          // }}); 
        }
      })           
    },
    // 删除用户， idList为选中数据的id集合
    deleteEvent(idList){      
      // this.$store.dispatch("ROOT_CONFIRM", {that: this, msg: '此操作将删除记录, 是否继续?',cb: ()=>{
      //     this.api.put("/user/deleteList",{idList}).then((res)=>{
      //       if(res.code == 200){
      //         this.getTableList();
      //         this.orderState.selectList = [];
      //         this.$message.success(res.msg);
      //       }
      //     });
      //   }
      // })
    }
  }
}
</script>
