<template>
  <page>
    <FormPage
      submitBtnText="确认"
      cancelBtnText="重新导入"
      :hiddenFooter="active == 0 ? true : false"
      :loading="loading"
      @submit="submitForm"
      @cancel="cancel"
    >
      <div class="Top_warp">
        <el-steps space="100%" :active="active" finish-status="success">
          <el-step title="上传表格"></el-step>
          <el-step title="核对表格"></el-step>
        </el-steps>
        <Table-page
          :page-size="search.pageSize"
          :total="search.total"
          :page-num="search.pageNum"
          @pagination="handlePagination"
          v-if="active == 1"
        >
          <el-table
            v-loading="loading"
            :data="tableData"
            class="yg-table"
            height="100%"
            border
          >
            <el-table-column label="设备所属" prop="storeName" />
            <el-table-column label="设备编码" prop="merchantName" />
            <el-table-column label="设备名称" prop="mobile" />
            <el-table-column label="生产日期" prop="mobile" />
            <el-table-column label="有效期至" prop="mobile" />
          </el-table>
          <Drawer
            :visible.sync="openTable"
            title="导入失败(3条)"
            :size="600"
            @closed="closedImport"
            @cancel="closedImport"
          >
            <el-alert type="warning">
              <template #title>
                <div>标题1213</div>
              </template>
              <div>1.以下付款记录缺少信息</div>
              <div>2.以下付款记录缺少信息</div>
            </el-alert>

            <el-table :data="dataList" style="width: 100%" border>
              <el-table-column prop="id" label="商位号"></el-table-column>
              <el-table-column prop="prop" label="本期抄表"></el-table-column>
            </el-table>
          </Drawer>
        </Table-page>
        <div v-if="active === 0">
          <el-form :inline="true" class="demo-form-inline" label-position="top">
            <el-form-item label="表格导入">
              <Execl
                v-if="active <= 0"
                :style="{ filter: `blur(${filterBlur}px)` }"
                v-model="fileList"
                :multiple="false"
                :list="false"
                :drag="drag"
                @uploadStatue="uploadStatue"
                @beforUpload="beforUpload"
              ></Execl>
              <el-progress
                v-if="fileList.length > 0"
                class="progress"
                type="circle"
                :percentage="fileList[0].percentage"
                :status="percentStatus"
              ></el-progress>
            </el-form-item>
          </el-form>
          <div>
            <span> Excel中请务必包含「设备编码」数据项；</span>
            <p>
              <span> 如需参考模版 <el-link type="primary">下载</el-link></span>
            </p>
          </div>
        </div>
      </div>
    </FormPage>
  </page>
</template>

<script>
import { getList } from "@/request/api/lot/waterpower/waterMeter";
import Execl from "@/views/components/Execl/Execl.vue";
export default {
  data() {
    return {
      // 进度
      active: 0,
      // 文件
      fileList: [],
      // 上传状态
      percentStatus: null,
      drag: true,
      // 模糊
      filterBlur: 0,
      isShow: true,
      open: false,
      loading: false,
      btnLoading: false,
      tableData: [{ id: 1, mobile: 666 }],
      search: {
        total: 10,
        pageNum: 1,
        pageSize: 20,
      },
      form: {},
      dataList: [],
      openTable: true,
    };
  },
  components: { Execl },
  methods: {
    // 分页
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.search.pageSize = e.pageSize;
      this.getList();
    },
    // 步骤:下一步
    next() {
      if (++this.active > 2) this.active = 0;
      // 成功则删除掉列表中已导入的文件
      this.fileList = [];
    },
    // 步骤:上一步
    back() {
      this.percentStatus = null;
      if (--this.active < 0) this.active = 0;
    },
    // 上传成功或者失败
    uploadStatue(val) {
      if (val) {
        this.percentStatus = "success";
        setTimeout(() => {
          this.next();
          this.filterBlur = 0;
        }, 500);
      } else {
        this.percentStatus = "exception";
        setTimeout(() => {
          this.filterBlur = 0;
        }, 500);
      }
    },
    // 上传之前
    beforUpload() {
      this.filterBlur = 5;
    },
    testShow() {
      this.isShow = false;
      this.openTable = true;
    },
    saveTo() {
      this.closePage();
    },
    importAgain() {
      this.isShow = true;
    },
    onSuccess(res) {
      console.log(res);
      this.isShow = false;
      this.openTable = true;
    },
    closedImport() {
      this.openTable = false;
    },
    getList(val) {
      let _this = this;
      this.loading = true;
      getList(_this.search)
        .then((response) => {
          _this.tableData = response.data.rows;
          _this.total = response.data.total;
        })
        .finally((error) => {
          _this.loading = false;
        });
    },
    // 重新导入
    submitForm() {
      this.$success('确认导入')
    },
    // 确认导入
    cancel(){
      this.open = false;
      this.back()
      this.$error('重新导入')
    },
    closed() {
      this.open = false;
    },
  },
  created() {
    console.log(this.$route);
  },
};
</script>

<style scoped lang="scss">
.Top_warp {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 20px 20px 0px;
  height: 100%;
}
// 步骤条样式
/deep/ .el-steps {
  width: 100%;
  .el-step:last-child {
    flex-basis: 100px !important;
  }
}
@media screen and (max-width: 400px) {
  /deep/ .el-steps {
    flex-basis: 100% !important;
  }
}
// 进度样式
.progress {
  position: absolute;
  top: 0px;
  border: 1px dashed #d9d9d9;
  padding: 26px 116px;
  border-radius: 6px;
}
/deep/ .el-scrollbar__view {
  height: 100%;
  padding: 0px;
}

// 表格样式
/deep/ .table-page {
  width: 100%;
  padding: 0px;
}
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

