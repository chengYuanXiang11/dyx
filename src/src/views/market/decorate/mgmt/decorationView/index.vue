<template>
  <div class="app-container">
    <div class="header">
      <el-avatar size="large" :src="circleUrl"></el-avatar>
      <div class="title">杨大妈水果的装修申请</div>
      <el-tag type="success">已通过</el-tag>
      <el-tag type="danger">未验收</el-tag>
    </div>
    <div class="form-box">
      <el-form ref="form" :model="form">
        <el-descriptions direction="horizontal" :column="1" border>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="申请人">kooriookami</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="手机号">18100000000</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="申请日期">苏州市</el-descriptions-item>
        </el-descriptions>
        <el-descriptions direction="horizontal" :column="1" border>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="装修位置">kooriookami</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="开始时间">18100000000</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="结束时间">苏州市</el-descriptions-item>
        </el-descriptions>
        <el-descriptions direction="horizontal" :column="1" border>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="装修项目1">kooriookami</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="规格">18100000000</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="价格">苏州市</el-descriptions-item>
        </el-descriptions>
        <el-descriptions direction="horizontal" :column="1" border>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="合计金额">kooriookami</el-descriptions-item>
        </el-descriptions>
        <el-descriptions direction="horizontal" :column="1" border>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="施工单位名称">kooriookami</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="施工负责人">kooriookami</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="电话">kooriookami</el-descriptions-item>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="施工人员数量">kooriookami</el-descriptions-item>
        </el-descriptions>
        <el-descriptions direction="horizontal" :column="1" border>
          <el-descriptions-item label-class-name="my-label" content-class-name="my-content" label="申请人签名">kooriookami</el-descriptions-item>
        </el-descriptions>

        <div class="footer">
            <el-button size="small" type="info" @click="cancel">取消</el-button>
            <el-button size="small" type="primary">发送装修许可证</el-button>
            <el-button size="small" type="primary">发送动火许可证</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      form: {}
    }
  },
  created(){

  },
  methods:{
    cancel(){
      this.closePage()
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  .title {
    font-size: 24px;
    color: #010621;
    margin-left: 18px;
  }

  ::v-deep .el-tag {
    margin-left: 12px;
  }
}
.form-box{
    max-width: 510px;

   ::v-deep .el-descriptions{
      margin-top: 16px;
    }

   ::v-deep .my-label{
      color: #010621;
      font-size: 14px;
      width: 208px;
      background: #FAFAFA;
    }
   ::v-deep .my-content{
      color: #010621;
      font-size: 14px;
    }
    .footer{
      margin-top: 20px;
    }
  }
</style>