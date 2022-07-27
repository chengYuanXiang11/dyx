<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="form" label-width="80px">
      <div>
        <el-descriptions :column="1">
          <el-descriptions-item label="巡检时间">{{ form.oneText }}</el-descriptions-item>
          <el-descriptions-item label="巡检人">{{ form.twoText }}</el-descriptions-item>
          <el-descriptions-item label="巡检单">{{ form.threeText }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="content">
        <div class="list-box" v-for="(val,num) in form.list" :key="num">
          <el-descriptions :column="1">
            <el-descriptions-item label="巡检项">{{ val.title }}</el-descriptions-item>
            <el-descriptions-item label="是否合格">{{ val.radioValue }}</el-descriptions-item>
          </el-descriptions>
          <template>
            <el-card class="box-card" v-for="(item,index) in val.data" :key="index">
              <div slot="header" class="clearfix">
                <span>任务1</span>
              </div>
              <el-descriptions :column="1">
                <el-descriptions-item label="任务名称">{{ item.name }}</el-descriptions-item>
                <el-descriptions-item label="整改人">{{ item.person }}</el-descriptions-item>
                <el-descriptions-item label="图片">
                  <el-image
                    v-for="(url, urlNum) in item.imgList"
                    :key="urlNum"
                    style="width: 180px; height: 180px"
                    :src="url"
                    :preview-src-list="item.imgList"
                  ></el-image>
                </el-descriptions-item>
              </el-descriptions>
              <div class="afterTitle">
                <div>整改后</div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="add(num, index)"
                  v-if="$route.query.type == 'result'"
                >新增结果</el-button>
              </div>
              <div v-for="(after,afterIndex) in item.after" :key="afterIndex">
                <el-descriptions :column="1">
                  <el-descriptions-item label="完成人">
                    <span>{{ after.afterPerson }}</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="时间">{{ after.afterTime }}</el-descriptions-item>
                  <el-descriptions-item label="说明">{{ after.afterExplain }}</el-descriptions-item>
                  <el-descriptions-item label="图片">
                    <el-image
                      v-for="(afterUrl, afterUrlNum) in after.afterImgList"
                      :key="afterUrlNum"
                      style="width: 180px; height: 180px"
                      :src="afterUrl"
                      :preview-src-list="after.afterImgList"
                    ></el-image>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </template>
        </div>
      </div>

      <div class="footer" v-if="$route.query.type == 'result'">
        <el-button type="primary" @click="saveForm">确定</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </div>
    </el-form>

    <el-dialog title :visible.sync="dialogVisible" width="650px" :before-close="dialogClose">
      <el-form ref="formDialog" :model="formDialog" label-width="100px">
        <el-form-item label="时间">
          <el-date-picker v-model="formDialog.afterTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="200"
            :rows="4"
            v-model="formDialog.afterExplain"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <UploadImg v-model="formDialog.afterImgList" :limit="3"></UploadImg>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="dialogSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formDialog: {
        afterTime: "",
        afterExplain: "",
        afterImgList: []
      },
      dialogVisible: false,
      form: {
        oneText: "2021-05-11",
        twoText: "王章、李泽楷、张飞",
        threeText: "月巡查",
        list: [
          {
            id: 1,
            title: "项目1",//项目
            radioValue: "不合格",
            data: [
              {//任务
                id: 11,
                name: "任务一",
                area: 1,
                person: "张三,张良",
                imgList: [
                  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                ],
                after: [//整改后
                  {
                    afterStatus: "通过",
                    afterPerson: "张良",
                    afterTime: "2021-07-16 10:31:10",
                    afterExplain: "这是一段文字",
                    afterImgList: [
                      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                    ]
                  },


                ]
              },
            ]
          },
          {
            id: 2,
            title: "项目2",//项目
            radioValue: "合格",
            data: []
          },
        ]
      },
      numI: "",
      indexI: ""
    }
  },
  methods: {
    add(num, index) {
      this.numI = num
      this.indexI = index
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
    },
    dialogSave() {
      console.log(this.formDialog);
      this.formDialog.afterPerson = "新增人"
      this.form.list[this.numI].data[this.indexI].after.push(this.formDialog)
      this.dialogVisible = false
    },
    saveForm() {
      alert('submit!');
    },
    cancelForm() {
      this.closePage()
    }

  }
}
</script>

<style lang="scss" scoped>
.list-box {
  max-width: 700px;
  height: auto;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  padding: 15px;
  margin-top: 15px;
  .footer-btn {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
  }
  .afterTitle {
    font-size: 15px;
    margin: 10px 0;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  ::v-deep .el-descriptions-item__container {
    align-content: center;
  }

  .box-card {
    width: 666px;
    margin-top: 15px;

    ::v-deep .el-input {
      width: 220px;
    }

    ::v-deep .el-card__header {
      background: rgba(217, 217, 217, 0.2);
    }
  }

  ::v-deep .el-image + .el-image {
    margin-left: 12px;
  }
}
.footer {
  width: 666px;
  margin-top: 15px;
  text-align: center;
}
</style>