<template>
  <div class="app-container">
    <div>
      <el-form ref="queryForm" :model="query" :inline="true" label-width="85x">
        <el-form-item label="故障类型" prop="servicesType">
          <el-select
            v-model="query.servicesType"
            placeholder="请选择故障类型"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in searchList"
              :key="dict.id"
              :label="dict.servicesTypeName"
              :value="dict.servicesTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码" prop="merchantName">
          <el-input
            v-model="query.merchantName"
            placeholder="请输入设备编码"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="servicesType">
          <el-select
            v-model="query.servicesType"
            placeholder="请选择设备类型"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in searchList"
              :key="dict.id"
              :label="dict.servicesTypeName"
              :value="dict.servicesTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="contacts">
          <el-input
            v-model="query.contacts"
            placeholder="请输入负责人"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="故障时间" prop="contacts" v-show="isShow">
          <el-date-picker v-model="query.servicesType" type="datetime" placeholder="请选择故障时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="修复时间" prop="contacts" v-show="isShow">
          <el-date-picker v-model="query.servicesType" type="datetime" placeholder="请选择修复时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="状态" prop="servicesType">
          <el-select
            v-model="query.servicesType"
            placeholder="请选择状态"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in searchList"
              :key="dict.id"
              :label="dict.servicesTypeName"
              :value="dict.servicesTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button
            type="primary"
            :icon="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            size="mini"
            @click="searchShow"
          >{{ isShow ? "收起" : "高级" }}</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" class="yg-table">
      <el-table-column label="故障类型" prop="ticketcode" />
      <el-table-column label="设备编码" prop="repair_type" />
      <el-table-column label="设备名称" prop="address" />
      <el-table-column label="设备类型" prop="addressOne" />
      <el-table-column label="故障时间" prop="addressOne" />
      <el-table-column label="修复时间" prop="addressOne" />
      <el-table-column label="负责人" prop="addressOne" />
      <el-table-column label="状态" prop="addressOne" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row.id, 1)">修复</el-button>
          <el-button size="mini" type="text" @click="edit(scope.row.id, 2)">等待修复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  getList,
  addOfficeAddress,
  getInfo,
  updateOfficeAddress,
  delOfficeAddress,
} from "@/request/api/market/malfunctionRepair/faultRecord";
export default {
  data() {
    return {
      // 高级
      isShow: false,
      showDrawer: false,
      drawerType: "",
      loading: true,
      btnLoading: false,
      total: 0,
      tableData: [
        { id: 1, ticketcode: 'E6551SC15', repair_type: "北一门", address: "摄像头", addressOne: "1" },
        { id: 2, ticketcode: 'E6551SC15', repair_type: "南3门", address: "摄像头", addressOne: "1" },
      ],
      query: {
        pageNum: 1,
        pageSize: 20,

      },
      form: {},
      rules: {},
      searchList: [],

    };
  },
  created() {
    this.getList();
  },
  methods: {
    edit(id, num) {
      let _this = this
      this.$confirm('是否确认更改修复状态?','提示',{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then((result) => {
        this.$toast('操作成功！')
      }).catch((err) => {
        this.$message.info("已取消操作")
      });
    },
    getList() {
      this.loading = false;
      // this.loading = true;
      // getList(this.query)
      //   .then((response) => {
      //     this.tableData = response.data.results;
      //     this.total = response.data.count;
      //   })
      //   .finally((error) => {
      //     this.loading = false;
      //   });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.query.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 高级搜索展示隐藏
    searchShow() {
      this.isShow = !this.isShow;
      // this.paging.customerType = "";
      // this.paging.saleCategory = "";
      // this.paging.customerSource = "";
    },
  },
};
</script>