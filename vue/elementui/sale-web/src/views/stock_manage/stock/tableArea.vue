<template>
  <div class="listTemplateTable">
    <!-- default-expand-all -->
    <!-- :row-class-name="tableRowClassName" -->

    <el-table
      :style="{border: ' 1px solidred'}"
      :height="rootState.listTableHeight"
      :data="stockState.tableList"
      style="width: 100%;"
      border
      @cell-mouse-enter="showButtom"
      @cell-mouse-leave="hideButtom"
      @cell-click="showButtonAlways"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip label="序号" align="center">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            popper-class="item"
            v-model="scope.row.a"
            :manual="true"
            :content="`库存量低于预警线`+`${scope.row.number}`"
            placement="top-start"
          >
            <span>{{scope.$index + 1}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="商品图片" align="left" prop="icon">
        <template slot-scope="scope">
          <img :src="scope.icon" alt />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="商品编码" align="center" prop="Serial "></el-table-column>
      <el-table-column show-overflow-tooltip label="商品名称" align="left" width="180px" prop="name"></el-table-column>

      <el-table-column show-overflow-tooltip label="商品单位" align="left" prop="unit"></el-table-column>
      <el-table-column show-overflow-tooltip label="商品描述" align="left" prop="comment"></el-table-column>
      <el-table-column show-overflow-tooltip label="商品单价" align="left" prop="price"></el-table-column>

      <el-table-column show-overflow-tooltip label="货位号" align="left" prop="itemname"></el-table-column>
      <el-table-column show-overflow-tooltip label="可用库存" align="center" prop="Aavailable"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="已锁定库存"
        align="center"
        width="100px"
        prop="locked"
      ></el-table-column>
      <el-table-column label="出库统计">
        <el-table-column prop="province" label="累计出库" width="120"></el-table-column>
        <el-table-column prop="average" label="平均单价" width="120"></el-table-column>
        <el-table-column prop="address" label="金额" width="300"></el-table-column>
      </el-table-column>
      <el-table-column label="所属机构">
        <el-table-column prop="province" label="机构名称" width="120"></el-table-column>
        <el-table-column prop="city" label="机构地址" width="120"></el-table-column>
        <el-table-column prop="address" label="联系方式" width="300"></el-table-column>
      </el-table-column>

      <el-table-column label="更多" width="80" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              创建人：{{scope.row.createName}}
              <br />
              创建时间：{{plugins.changeDate(scope.row.createDate, "yymmddhhmmss")}}
              <br />
              修改人：{{scope.row.lastUpdateName}}
              <br />
              修改时间：{{plugins.changeDate(scope.row.lastUpdateDate, "yymmddhhmmss")}}
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
              <!-- <el-dropdown-item v-if="true" @click.native="lockonEvent(scope.row)">修改</el-dropdown-item> -->
              <el-dropdown-item v-if="true" @click.native="lockonEvent(scope.row,'update')">锁定库存</el-dropdown-item>
              <!-- <el-dropdown-item v-if="true" @click.native="lockonEvent(scope.row)">重置密码</el-dropdown-item> -->
              <!-- <el-dropdown-item v-if="true" @click.native="$emit('deleteEvent', [scope.row.id])">出库</el-dropdown-item> -->
              <el-dropdown-item v-if="true" @click.native="lockonEvent(scope.row,'delete')">出库操作</el-dropdown-item>
              <el-dropdown-item
                v-if="true"
                @click.native="$emit('deleteEvent', [scope.row.id])"
              >删除库存</el-dropdown-item>
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
      stockState: (state) => state.Stock,
    }),
  },
  methods: {
    //背景变红  或者  悬浮提示
    // tableRowClassName({ row, rowIndex }) {
    //   if (row.Aavailable < row.number) {
    //     return "warning-row";
    //   } else {
    //     return "success-row";
    //   }
    //   return "";
    // },
    handleSelectionChange(val) {
      this.stockState.selectList = val;
    },
    lockonEvent(data,type) {
      this.stockState.dialogType = type;
      this.stockState.dialogShow = true;
      this.stockState.dialogData = this.plugins.deepFullCopy(data);
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
<style >
.el-table .warning-row {
  background: red;
}
.el-table .success-row {
  background: #f0f9eb;
}
.el-tooltip__popper.is-dark{
  background: red;
}
.el-tooltip__popper[x-placement^=top] .popper__arrow{
  border-top-color: red;
}
.el-tooltip__popper[x-placement^=top] .popper__arrow::after{
 border-top-color: red;}
.item{
  z-index: 100!important;
}
</style>
