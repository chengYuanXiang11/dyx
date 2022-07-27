// 故障记录
<template>
  <div class="app-container">
    <div>
      <el-form ref="queryForm" :model="query" :inline="true" label-width="85x">
        <el-form-item label="设备编码" prop="merchantName">
          <el-input
            v-model="query.code__icontains"
            placeholder="请输入设备编码"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="servicesType">
          <el-select
            v-model="query.t__icontains"
            placeholder="请选择设备类型"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in searchList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.name"
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
          <el-date-picker v-model="query.create_datetime" type="datetime" placeholder="请选择故障时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="修复时间" prop="contacts" v-show="isShow">
          <el-date-picker v-model="query.update_datetime" type="datetime" placeholder="请选择修复时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="状态" prop="servicesType">
          <el-select
            v-model="query.state"
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
      <el-table-column label="设备编码" prop="code" />
      <el-table-column label="设备名称" prop="name" />
      <el-table-column label="设备类型" prop="type" />
      <el-table-column label="故障时间" prop="create_datetime" />
      <el-table-column label="修复时间" prop="update_datetime" />
      <el-table-column label="负责人" prop="principal" />
      <el-table-column label="状态">
				<template slot-scope='scope'>
					{{scope.row.state == "1" ? "未修复":"已修复"}}
				</template>
			</el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.state == '1'" @click="edit(scope.row.id)">修复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="query.total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  getList,
  updataState
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
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 20,
				total: 0
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
    edit(id) {
      let _this = this
      this.$confirm('是否确认更改修复状态?','提示',{
        confirmButtonText:"确认",
        cancelButtonText:"取消",
        type:"warning"
      }).then((result) => {
        
				let res = {
					state:'2'
				}
				updataState(id,res).then(resp=>{
					console.log(resp)
					this.$toast('操作成功！')
					this.getList()
				})
      }).catch((err) => {
        this.$message.info("已取消操作")
      });
			// let res = {
			// 	state:'2'
			// }
			// updataState(id,res).then(resp=>{
			// 	console.log(resp)
			// })
    },
    getList() {
      this.loading = false;
      // this.loading = true;
      getList(this.query)
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
					console.log(this.tableData)
        })
        .finally((error) => {
          this.loading = false;
        });
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