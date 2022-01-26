// 故障提醒
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
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="contacts">
          <el-input
            v-model="query.name__icontains"
            placeholder="请输入设备名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="servicesType">
          <el-select
            v-model="query.type"
            placeholder="请选择设备类型"
            clearable
            size="small"
            style="width: 240px"
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
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn">
      <el-button
        type="primary"
        @click="batchOperation"
        :disabled="multipleSelection.length == 0"
      >批量编辑</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      class="yg-table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" prop="id" />
      <el-table-column label="设备编码" prop="code" />
      <el-table-column label="设备名称" prop="name" />
      <el-table-column label="设备类型" prop="type" />
      <el-table-column label="故障提醒数量" prop="warnnumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="query.total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />

    <Yg-Drawer
      v-model="showDrawer"
      :title="drawerType == '1' ? '编辑' : '批量编辑'"
      @confirm="confirmForm"
      @closed="drawerClosed"
      @cancel="drawerClosed"
      :confirmLoading="btnLoading"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="form-box">
        <div class="form-top">
          <span>选择数量</span>
          <span>{{ drawerType == '1' ? 1 : multipleSelection.length }}个</span>
        </div>
        <div class="title-top">故障设置</div>
        <el-form-item label="故障类型">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="设备离线"></el-checkbox>
            <el-checkbox label="xxx"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-card class="box-card" v-for="(item,index) in cardList" :key="index">
          <div slot="header">
            <span>{{ item.title }}</span>
          </div>
          <el-form-item label-width="60px" label="负责人" prop="person">
            <el-input v-model="item.person" placeholder="请输入客户姓名"></el-input>
          </el-form-item>
        </el-card>
      </el-form>
    </Yg-Drawer>
  </div>
</template>

<script>
import { getList } from "@/request/api/market/malfunctionRepair/failureToRemind";
export default {
  data() {
    return {
      showDrawer: false,
      drawerType: "",
      loading: true,
      btnLoading: false,
      
      tableData: [
        { id: 1, ticketcode: 'E6551SC15', repair_type: "北一门", address: "摄像头", addressOne: "1" },
        { id: 2, ticketcode: 'E6551SC15', repair_type: "南3门", address: "摄像头", addressOne: "1" },
      ],
      query: {
        pageNum: 1,
        pageSize: 20,
				total: 0,
      },
      form: {},
      rules: {},
      searchList: [
				{servicesTypeName:'测试123'},
				{servicesTypeName:'测试12'},
				{servicesTypeName:'测试1'}
			],
      multipleSelection: [],
      checkList: ['设备离线'],
      cardList: [
        {
          title: "设备离线",
          person: ""
        },
        {
          title: "xxxx",
          person: ""
        },
      ],

    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    getList() {
      getList(this.query)
        .then((resp) => {
          this.tableData = resp.data.results;
          this.query.total = resp.data.count;
					console.log(this.tableData)
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    // 编辑
    edit(id) {
      this.drawerType = 1
      this.showDrawer = true
    },
    // 批量编辑
    batchOperation() {
      this.drawerType = 0
      if (this.multipleSelection.length === 0) {
        this.$message.error("请至少选择一条数据进行操!")
        return
      }
      this.showDrawer = true
    },
    confirmForm() {
      const _this = this;
      _this.$refs["form"].validate((valid) => {
        if (valid) {
          // _this.btnLoading = true;
          // updateOfficeAddress(_this.form, _this.itemId)
          //   .then((res) => {
          //     _this.showDrawer = false;
          //     _this.$toast("操作成功！");
          //     _this.getList();
          //   })
          //   .finally((error) => {
          //     _this.btnLoading = false;
          //   });
        } else {
          _this.$toastError("请将表单填写完整");
        }
      });
    },
    drawerClosed() {
      this.showDrawer = false;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.query.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
			this.query = {
        pageNum: 1,
        pageSize: 20,
				total: 0,
      },
      this.handleQuery();
    },
  },
	created() {
	  this.getList();
	},
};
</script>

<style lang="scss" scoped>
.btn {
  margin-bottom: 10px;
}
::v-deep .form-box .el-form-item {
  margin-bottom: 5px;
}
::v-deep .el-card {
  margin-top: 20px;
}
.form-top {
  font-size: 14px;
  color: #333;
  > span:last-child {
    margin-left: 15px;
  }
}

.title-top {
  margin: 15px 0 5px;
  font-size: 16px;
  font-weight: bold;
}
</style>
