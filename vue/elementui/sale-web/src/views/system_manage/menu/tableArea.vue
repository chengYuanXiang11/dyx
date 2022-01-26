<template>
  <div class="listTemplateTable">
    <!-- default-expand-all -->
    <el-table
   :height="rootState.listTableHeight"
    :data="tableList"
    style="width: 100%;"
    border
    row-key="id"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    @cell-mouse-enter="showButtom"
    @cell-mouse-leave="hideButtom"
    @cell-click="showButtonAlways"
    @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="菜单名称"
          align="left"
          width="180px"
          prop="name">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="排序"
          align="left"
           sortable
          width="80px"
          prop="id">
          </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="菜单类型"
          align="left"
          width="80px"
          prop="resType ">
          <template slot-scope="scope">
            <span v-show="scope.row.resType == 'button'" style="color: #199ed8">按钮</span>
            <span v-show="!(scope.row.resType == 'button')">菜单</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="访问路径"
          align="left"
          prop="url">
        </el-table-column>
         
        <el-table-column
          show-overflow-tooltip
          label="参数"
          align="left"
          prop="rootParams">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="图标"
          width="180px"
          align="left"
          prop="icon">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="资源路径"
          align="left"
          prop="menuRoute">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80px" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom" class="displayHide">
              <el-button type="info" size="mini"><i class="el-icon-setting"></i><i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="true" @click.native="updateEvent(scope.row)">修改</el-dropdown-item>
                <el-dropdown-item v-if="true" @click.native="$emit('deleteEvent', scope.row.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import api from '../../../utils/api'
// import AutoArea from './autoArea'
import { mapState, mapGetters } from 'vuex';
export default {
  computed:{
    ...mapState({
      rootState: state=>state,
      menuState: state=>state.Menu
    }),
      tableList:function(){
       this.menuState.tableList.map((value)=>{
          this.delete(value)
        })
         return this.menuState.tableList
        },
  },
  methods: {
    // 删除对象
    delete(value){
      if(value.children === undefined) return
        if(value.children[0] === undefined){
            this.$delete(value,'children')
          }else{
            value.children.map((value)=>{
             this.delete(value)
            })
          }

          
    },
    handleSelectionChange(val){ this.menuState.selectList = val; },
    updateEvent(data){
      this.menuState.dialogType = "update";
      this.menuState.dialogShow = true;
      this.menuState.cascader =""
      this.menuState.dialogData = this.plugins.deepFullCopy(data);
    },
    showButtom(row, column, cell, event){ this.plugins.cellEnterOrOut($, event, column.label, 1, '操作', ".el-dropdown"); },
    hideButtom(row, column, cell, event){ this.plugins.cellEnterOrOut($, event, column.label, 2, '操作', ".el-dropdown"); },
    showButtonAlways(row, column, cell, event){ this.plugins.cellEnterOrOut($, event, column.label, 3, '操作', ".el-dropdown"); }
  }
}
</script>
