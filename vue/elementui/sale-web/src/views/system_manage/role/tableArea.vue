<template>
  <div class="listTemplateTable">
    <!-- default-expand-all -->
    <el-table
    :height="rootState.listTableHeight"
    :data="roleState.tableList"
    style="width: 100%;"
    border
    @cell-mouse-enter="showButtom"
    @cell-mouse-leave="hideButtom"
    @cell-click="showButtonAlways"
    @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="序号"
          align="center"
          width="70">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="角色名称"
          align="left"
          prop="name">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="角色类型"
          align="left"
          prop="type">
          <template slot-scope="scope">
            <span>{{scope.row.type == 1?"甲方公司":"经销商"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="备注"
          align="left"
          prop="comment">
        </el-table-column>
        <el-table-column
          label="更多"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                创建人：{{scope.row.createName}}<br />
                创建时间：{{plugins.changeDate(scope.row.createDate, "yymmddhhmmss")}}<br />
                修改人：{{scope.row.lastUpdateName}}<br />
                修改时间：{{plugins.changeDate(scope.row.lastUpdateDate, "yymmddhhmmss")}}<br />
              </div>
              <span style="cursor: pointer;color: rgb(0, 121, 254)">更多</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80px" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom" class="displayHide">
              <el-button type="info" size="mini"><i class="el-icon-setting"></i><i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="true" @click.native="updateEvent(scope.row)">修改</el-dropdown-item>
                <el-dropdown-item v-if="true" @click.native="$refs.AutoArea.open(scope.row)">授权</el-dropdown-item>
                <el-dropdown-item v-if="true" @click.native="$emit('deleteEvent', [scope.row.id])">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <AutoArea ref="AutoArea" />
  </div>
</template>

<script>
import api from '../../../utils/api'
import AutoArea from './autoArea'
import { mapState, mapGetters } from 'vuex';
export default {
  computed:{
    ...mapState({
      rootState: state=>state,
      roleState: state=>state.Role
    })
  },
  components: {AutoArea},
  methods: {
    handleSelectionChange(val){ this.roleState.selectList = val; },
    updateEvent(data){
      this.roleState.dialogType = "update";
      this.roleState.dialogShow = true;
      this.roleState.dialogData = this.plugins.deepFullCopy(data);
    },
    showButtom(row, column, cell, event){ this.plugins.cellEnterOrOut($, event, column.label, 1, '操作', ".el-dropdown"); },
    hideButtom(row, column, cell, event){ this.plugins.cellEnterOrOut($, event, column.label, 2, '操作', ".el-dropdown"); },
    showButtonAlways(row, column, cell, event){ this.plugins.cellEnterOrOut($, event, column.label, 3, '操作', ".el-dropdown"); }
  }
}
</script>
