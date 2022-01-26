<template>
  <div class="app-container">
    <div class="operation">
      <el-button type="primary" @click="addTodo">新建</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" class="yg-table">
      <el-table-column label="商位编号" prop="servicesTypeName" />
      <el-table-column label="租赁类型" prop="servicesNum"></el-table-column>
      <el-table-column label="位置" prop="servicesNum"></el-table-column>
      <el-table-column label="开始时间" prop="servicesNum"></el-table-column>
      <el-table-column label="结束时间" prop="servicesNum"></el-table-column>
      <el-table-column label="状态" prop="servicesNum"></el-table-column>
      <el-table-column label="签约人" prop="servicesNum"></el-table-column>
      <el-table-column label="签约时间" prop="servicesNum"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="viewTodo(scope.row.id)">查看</el-button>
          <el-button size="mini" type="text" @click="viewTodo(scope.row.id)">签约</el-button>
          <el-button size="mini" type="text" @click="feeManage(scope.row.id)">费用管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="paging.pageNum"
      :limit.sync="paging.pageSize"
      @pagination="getList"
    />

    <SelectUsersDialog
      :visible.sync="showDialog"
      :data="datas"
      model="user"
      :multiple="false"
      placeholder="请选择人员"
      @confirm="getDatas"
    ></SelectUsersDialog>
  </div>
</template>

<script>
import {
  getList
} from "@/request/api/market/merchantsMgmt/leaseManage";
export default {
  data() {
    return {
      showDialog: false,
      datas: [],
      loading: true,
      btnLoading: false,
      total: 0,
      tableData: [
        { id: 1, servicesTypeName: "A-110", servicesNum: "无" }
      ],
      paging: {
        pageNum: 1,
        pageSize: 20,
      },

    };
  },
  created() {
    this.getList();
  },
  methods: {
    getDatas(e) {

    },
    addTodo() {
      this.$router.push({
        path: '/leaseManageAdd'
      })
    },
    viewTodo() {

    },
    feeManage() {

    },
    getList() {
      this.loading = false;

      //   this.loading = true;
      //   getList(this.paging)
      //     .then((response) => {
      //       this.tableData = response.data.results;
      //       this.total = response.data.count;
      //     })
      //     .finally((error) => {
      //       this.loading = false;
      //     });
    },

  },
};
</script>

<style lang="scss" scoped>
</style>

