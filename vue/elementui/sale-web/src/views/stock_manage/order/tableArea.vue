<template>
  <div class="listTemplateTable">
    <!-- default-expand-all -->
    <el-table
      :height="rootState.listTableHeight"
      :data="orderState.tableList"
      style="width: 100%; height:800px"
      border
      @cell-mouse-enter="showButtom"
      @cell-mouse-leave="hideButtom"
      @cell-click="showButtonAlways"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
           
      <el-table-column show-overflow-tooltip label="序号" align="center" width="70">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="订单编号" align="left" width="180px" prop="name"></el-table-column>

      <el-table-column show-overflow-tooltip label="商品名称" align="left" width="180px" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="登录账户" align="left" prop="account"></el-table-column>
      <el-table-column show-overflow-tooltip label="发货组织" align="left" prop="orgId"></el-table-column>
      <el-table-column show-overflow-tooltip label="联系方式" width="180px" align="left" prop="mobile"></el-table-column>
      <el-table-column show-overflow-tooltip label="邮箱" align="left" prop="email"></el-table-column>
      <el-table-column show-overflow-tooltip label="地址" width="180px" align="left" prop="address"></el-table-column>
      <el-table-column show-overflow-tooltip label="描述" align="left" prop="comment"></el-table-column>
      <el-table-column label="更多" width="80" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              发货人：{{scope.row.createName}}
              <br />
              发货时间：{{plugins.changeDate(scope.row.createDate, "yymmddhhmmss")}}
              <br />
              收货人：{{scope.row.lastUpdateName}}
              <br />
              预计收货时间：{{plugins.changeDate(scope.row.lastUpdateDate, "yymmddhhmmss")}}
              <br />
            </div>
            <span style="cursor: pointer;color: rgb(0, 121, 254)">更多</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="80px" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click" placement="bottom" class="displayHide">
            <el-button type="info" size="mini">
              <i class="el-icon-setting"></i>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="true" @click.native="updateEvent(scope.row,'dingdan')">查看订单</el-dropdown-item>
              <el-dropdown-item v-if="true" @click.native="updateEvent(scope.row,'zhuangtai')">查看状态</el-dropdown-item>
              <!-- <el-dropdown-item v-if="true" @click.native="updateEvent(scope.row)">重置密码</el-dropdown-item>
              <el-dropdown-item v-if="true" @click.native="$emit('deleteEvent', [scope.row.id])">删除</el-dropdown-item>  -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "../../../utils/api";
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      rootState: (state) => state,
      orderState: (state) => state.Order,
    }),
  },
  methods: {
    handleSelectionChange(val) {
      this.orderState.selectList = val;
    },
    updateEvent(data,type) {
      this.orderState.dialogType = type;
      this.orderState.dialogShow = true;
      this.orderState.dialogData = this.plugins.deepFullCopy(data);
      console.log( this.orderState.dialogData)
    },
    showButtom(row, column, cell, event) {
      this.plugins.cellEnterOrOut(
        $,
        event,
        column.label,
        1,
        "操作",
        ".el-dropdown"
      );
    },
    hideButtom(row, column, cell, event) {
      this.plugins.cellEnterOrOut(
        $,
        event,
        column.label,
        2,
        "操作",
        ".el-dropdown"
      );
    },
    showButtonAlways(row, column, cell, event) {
      this.plugins.cellEnterOrOut(
        $,
        event,
        column.label,
        3,
        "操作",
        ".el-dropdown"
      );
    },
  },
};
</script>
