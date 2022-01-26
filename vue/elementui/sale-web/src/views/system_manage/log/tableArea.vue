<template>
  <div class="listTemplateTable">
    <el-table
    :height="rootState.listTableHeight"
    :data="logState.tableList"
    style="width: 100%;"
    border>
    <el-table-column
        show-overflow-tooltip
        label="序号"
        align="center"
        width="80">
        <template slot-scope="scope">
          <span>{{scope.$index+(rootState.current - 1) * rootState.size + 1}}</span>
        </template>
    </el-table-column>
    <el-table-column
        show-overflow-tooltip
        label="服务名"
        align="left"
        width="150px"
        prop="appName">
    </el-table-column>
    <el-table-column
        show-overflow-tooltip
        label="操作人"
        align="left"
        width="100px"
        prop="operateName">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="请求IP"
        align="left"
        width="150px"
        prop="requestIp">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="日志描述"
        align="left"
        width="250"
        prop="logDesc">
        <template slot-scope="scope">
          <span v-show="scope.row.success=='FALSE'" style="color: #FF3B30">{{scope.row.logDesc  + " -> " + scope.row.errorMsg}}</span>
          <span v-show="scope.row.success=='SUCCESS'" style="color: #4BD863">{{scope.row.logDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作方式 -> 接口"
        align="left"
        width="250">
         <template slot-scope="scope">
          <span style="display: inline-block;width: 50px;">{{scope.row.operationType}}</span>
          ->
          <span >{{scope.row.methodName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="请求路径"
        align="left"
        prop="allMethodName">
      </el-table-column>
      <el-table-column
        label="更多"
        width="80"
        align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              日志类型：{{scope.row.logType}}<br />
              响应时间：{{scope.row.respTime}}ms<br />
              日志参数：{{scope.row.params}}<br />
              创建时间：{{plugins.changeDate(scope.row.createDate, "yymmddhhmmss")}}
            </div>
            <span style="cursor: pointer;color: rgb(0, 121, 254)">更多</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed:{
    ...mapState({ 
      rootState:state=>state,
      logState: state=>state.Log
    })
  }
}
</script>
