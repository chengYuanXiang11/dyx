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
      stockState: state=>state.Stock
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
    // 获取库存列表
    getTableList(current){
      if(current) this.rootState.current = current;
      this.api.post("/user/getList?current=" + this.rootState.current + "&size=" + this.rootState.size, this.stockState.searchForm).then((res)=>{
        if(res.code == 200){
          // this.stockState.tableList = res.data.records;
          this.stockState.tableList.parentId = 0
          this.rootState.total = res.data.total;
          // this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", {$}); // 动态设置表格高度
        }
      });
    },
    // 锁定 或者出 库存
    addOrUpdateEvent(){
      this.$refs.DialogArea.$refs["form"].validate((valid)=>{
        if(valid){
          this.$store.dialogBottomShake = true;
           this.stockState.dialogShow = false;
          console.log('商品', this.stockState.dialogData)
          // this.$store.dispatch("ROOT_ADD_OR_UPDATE", {
          //   that: this, 
          //   url: 'user', 
          //   type: this.stockState.dialogType,
          //   data: this.stockState.dialogData, 
          //   cb:()=>{
          //     this.stockState.dialogShow = false;
          //     this.stockState.selectList = [];
          //     this.getTableList(1);
          // }}); 
        }
      })           
    },
    // 删除用户， idList为选中数据的id集合
    deleteEvent(idList){      
      this.$store.dispatch("ROOT_CONFIRM", {that: this, msg: '此操作将删除记录, 是否继续?',cb: ()=>{
          // this.api.put("/user/deleteList",{idList}).then((res)=>{
            console.log('删除id'+'      '+idList)
          //   if(res.code == 200){
          //     this.getTableList();
          //     this.stockState.selectList = [];
          //     this.$message.success(res.msg);
          //   }
          // });
        }
      })
    }
  }
}
</script>
