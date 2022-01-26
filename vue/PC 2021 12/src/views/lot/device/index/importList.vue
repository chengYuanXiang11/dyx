<template>
  <div class="app-container">
    <div>
      <el-steps :space="200" :active="1" finish-status="success">
        <el-step title="上传表格"></el-step>
        <el-step title="核对表格"></el-step>
      </el-steps>

      <div v-if="!isShow">
        <el-table v-loading="loading" :data="tableData" class="yg-table">
          <el-table-column label="设备所属" prop="storeName" />
          <el-table-column label="设备编码" prop="merchantName" />
          <el-table-column label="设备名称" prop="mobile" />
          <el-table-column label="生产日期" prop="mobile" />
          <el-table-column label="有效期至" prop="mobile" />
        </el-table>

        <pagination
          :total="total"
          :page.sync="query.pageNum"
          :limit.sync="query.pageSize"
          @pagination="getList"
        />

        <div>
          <el-button @click="importAgain">重新导入</el-button>
          <el-button type="primary" @click="saveTo">确定</el-button>
        </div>
      </div>

      <div v-if="isShow">
        <el-descriptions>
          <el-descriptions-item label="导入">
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :on-success="onSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              <div slot="tip">
                如需参考模板
                <el-button type="text">
                  <el-link type="primary">下载</el-link>
                </el-button>
              </div>
            </el-upload>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <Yg-Drawer
      v-model="openTable"
      title="导入失败(3条)"
      @closed="closedImport"
      @cancel="closedImport"
      :show-footer="false"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="失败原因">
          <div>1.以下付款记录缺少信息</div>
          <div>2.以下付款记录缺少信息</div>
        </el-form-item>
          <el-table :data="dataList" style="width: 100%" border>
            <el-table-column prop="id" label="商位号"></el-table-column>
            <el-table-column prop="prop" label="本期抄表"></el-table-column>
          </el-table>
      </el-form>
    </Yg-Drawer>

    <el-button type="primary" @click="testShow" v-if="isShow">测试</el-button>
  </div>
</template>

<script>
import {
  getList,
} from "@/request/api/lot/waterpower/waterMeter";
export default {
  data() {
    return {
      isShow: true,
      open: false,
      loading: false,
      btnLoading: false,
      total: 0,
      tableData: [{ id: 1, mobile: 666 }],
      query: {
        pageNum: 1,
        pageSize: 20,
      },
      form: {},
      dataList: [],
      openTable: false
    };
  },
  methods: {
    testShow() {
      this.isShow = false
      this.openTable = true
    },
    saveTo() {
      this.closePage()
    },
    importAgain() {
      this.isShow = true
    },
    onSuccess(res) {
      console.log(res);
      this.isShow = false
      this.openTable = true
    },
    closedImport() {
      this.openTable = false
    },
    getList(val) {
      let _this = this
      this.loading = true;
      getList(_this.query)
        .then((response) => {
          _this.tableData = response.data.rows;
          _this.total = response.data.total;
        })
        .finally((error) => {
          _this.loading = false;
        });

    },
    submitForm() {
      let _this = this
      console.log(this.form);
      this.open = false
    },
    closed() {
      this.open = false
    }
  },
  created() {
    console.log(this.$route)
  },
};
</script>

<style scoped lang="scss">
.page-view {
  width: 800px;
  margin: 0 auto;
}
// ::v-deep .el-steps {
//   // justify-content: center;
//   // padding-left: 146px;
// }
::v-deep .el-descriptions {
  margin-top: 30px;
}
.upload-demo {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  margin-top: 30px;
}
</style>

