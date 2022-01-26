<template>
  <Table-page
    :page-size="search.pageSize"
    :total="search.total"
    :page-num="search.pageNum"
    :searchForm="search.form"
    label-widht="100px"
    @pagination="handlePagination"
    @search="handleSearch"
    :showLimit="3"
  >
    <template slot="action-bar">
      <el-button type="primary" icon="el-icon-plus" @click="addTodo">新建</el-button>
    </template>
    <el-table v-loading="loading" :data="tableData" border height="100%">
      <el-table-column label="商位编号" prop="merchantId" />
      <el-table-column label="租赁类型" prop="leaseType" :formatter="leaseTypeFormatter"></el-table-column>
      <el-table-column label="面积(㎡)" prop="proportion"></el-table-column>
      <el-table-column label="位置" prop="location"></el-table-column>
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" prop="stopTime"></el-table-column>
      <el-table-column label="状态" prop="leaseStatus">
        <template slot-scope="scope">
          <el-tag
            :type="tagsFormatter(scope.row.leaseStatus)"
          >{{ statusFormatter(scope.row.leaseStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="签约人" prop="contractPerson"></el-table-column>
      <el-table-column label="签约时间" prop="contractTime"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="viewTodo('view', scope.row.id)"
            v-if="scope.row.leaseStatus == 1 || scope.row.leaseStatus == 2 || scope.row.leaseStatus3 || scope.row.leaseStatus == 7"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="viewTodo('contract', scope.row.id)"
            v-if="scope.row.leaseStatus == 4"
          >签约</el-button>
          <el-button
            size="mini"
            type="text"
            @click="feeManage(scope.row.id)"
            v-if="scope.row.leaseStatus == 5 || scope.row.leaseStatus == 6"
          >费用管理</el-button>
        </template>
      </el-table-column>
    </el-table>

  </Table-page>
</template>

<script>
import {
  getList
} from "@/request/api/market/merchantsMgmt/leaseManage";
import TablePage from "@/components/Layout/Table-page/index.vue";
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        merchantId: this.$route.query.id
      },
      search: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        form: [
        ],
      },

      showDialog: false,
      loading: true,
      btnLoading: false,
      total: 0,
      tableData: [],
      paging: {
        pageNum: 1,
        pages: 20,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页方法
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.getList();
    },
    // 搜索方法
    handleSearch(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    tagsFormatter(val) {
      if (val == "1" || val == "6") {
        return "warning";
      }
      else if (val == "2") {
        return "danger";
      }
      else if (val == "3" || val == "7") {
        return "info";
      }
      else if (val == "4" || val == "5") {
        return "success";
      }
    },
    statusFormatter(val) {
      if (val == 1) {
        return "审批中";
      }
      else if (val == 2) {
        return "已拒绝";
      }
      else if (val == 3) {
        return "已失效";
      }
      else if (val == 4) {
        return "已通过";
      }
      else if (val == 5) {
        return "待开始";
      }
      else if (val == 6) {
        return "合约中";
      }
      else if (val == 7) {
        return "已到期";
      }
      else {
        return val;
      }
    },
    leaseTypeFormatter(val) {
      if (val.leaseType == 1) {
        return "商铺";
      }
      else if (val.leaseType == 2) {
        return "宿舍";
      }
      else if (val.leaseType == 3) {
        return "仓库";
      }
      else {
        return val.leaseType;
      }
    },
    addTodo() {
      this.$router.push({
        path: "/leaseManageAdd",
        query: {
          id: this.$route.query.id,
          merchantName: this.$route.query.merchantName
        }
      });
    },
    viewTodo(type, id) {
      this.$router.push({
        path: `/leaseManageView/${type}`,
        query: {
          id: id,
          type: type
        }
      });
    },
    feeManage(id) {
      this.$router.push({
        path: "/leaseManageFee",
        query: {
          id: id
        }
      });
    },
    getList() {
      this.loading = true;
      getList(this.queryFormat(this.queryParams, this.search))
        .then((response) => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
        })
        .finally((error) => {
          this.loading = false;
        });
    },
  },
  components: { TablePage }
};
</script>

<style lang="scss" scoped>
</style>

