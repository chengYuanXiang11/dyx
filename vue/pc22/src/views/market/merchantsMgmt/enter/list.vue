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
    <el-table v-loading="loading" :data="tableData" border height="100%">
      <el-table-column show-overflow-tooltip label="租赁商位" prop="locationNumber" />
      <el-table-column
        show-overflow-tooltip
        label="商位类型"
        prop="leaseType"
        :formatter="typeFormatter"
      />
      <el-table-column show-overflow-tooltip label="签约人" prop="contractPerson" />
      <el-table-column show-overflow-tooltip label="签约时间" prop="contractTime">
        <template slot-scope="scope">{{ scope.row.contractTime | datefilter }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="状态" prop="address">
        <template slot-scope="scope">
          <el-tag :type="statusTagFormatter(scope.row.leaseStatus)">{{ statusFormatter(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row.id, 'enterView')">查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="edit(scope.row.id, 'enterUpload')"
            v-if="scope.row.leaseStatus == 4"
          >签约</el-button>
        </template>
      </el-table-column>
    </el-table>
  </Table-page>
</template>
<script>
import {
  getListInfo
} from "@/request/api/market/merchantsMgmt/enter";
import moment from "moment";
export default {
  data() {
    return {
      // 查询参数
      queryParams: {},
      search: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        form: [
        ],
      },

      radio1: "1",
      drawerType: "",
      loading: true,
      btnLoading: false,
      total: 0,
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 20,

      },
    };
  },
  filters: {
    datefilter(value) {
      if(value) return moment(value).format("YYYY-MM-DD HH:mm:ss")
      else return ""
    },
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
    typeFormatter(row) {
      if (row.leaseType == "1") {
        return "商铺"
      } else if (row.leaseType == "2") {
        return "宿舍"
      } else if (row.leaseType == "3") {
        return "仓库"
      } else {
        return row.leaseType
      }
    },
    statusTagFormatter(val) {
      if (val == '1' || val == '6') {
        return 'warning'
      } else if (val == '2') {
        return 'danger'
      } else if (val == '3' || val == '7') {
        return 'info'
      } else if (val == '4' || val == '5') {
        return 'success'
      }
    },
    statusFormatter(row) {
      if (row.leaseStatus == 1) {
        return "审批中"
      } else if (row.leaseStatus == 2) {
        return "已拒绝"
      } else if (row.leaseStatus == 3) {
        return "已失效"
      } else if (row.leaseStatus == 4) {
        return "已通过"
      } else if (row.leaseStatus == 5) {
        return "待开始"
      } else if (row.leaseStatus == 6) {
        return "合约中"
      } else if (row.leaseStatus == 7) {
        return "已到期"
      } else {
        return row.leaseStatus
      }
    },
    edit(id, type) {
      this.$router.push({
        path: `/leaseManageView/${type}`,
        query: { id, type }
      })

    },
    getList() {
      this.loading = true;
      getListInfo(this.$route.query.id, this.queryFormat(this.queryParams, this.search))
        .then((response) => {
          this.tableData = response.data.rows;
          this.search.total = response.data.total;
        })
        .finally((error) => {
          this.loading = false;
        });
    },

  },
};
</script>
