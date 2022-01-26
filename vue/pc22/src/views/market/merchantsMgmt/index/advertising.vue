<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="公告标题" prop="announcementTitle">
        <el-input v-model="form.announcementTitle"></el-input>
      </el-form-item>
      <el-form-item label="主图">
        <UploadImg v-model="imgList" :limit="1"></UploadImg>
        <span class="tip">上传文件只能是BMP/JPG/PNG/PDF格式!</span>
      </el-form-item>
      <el-form-item label="公告内容" prop="announcementContent">
        <editor-quill @childQuill="childQuill"></editor-quill>
      </el-form-item>
      <el-form-item label="公告范围" prop="announcementScope">
        <el-select v-model="form.announcementScope" placeholder="请选择商户" multiple filterable>
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in optionsList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公告排序" prop="announcementSort">
        <el-input v-model="form.announcementSort"></el-input>
      </el-form-item>
      <el-form-item label="有效时间至">
        <el-date-picker
          v-model="form.validTime"
          type="date"
          placeholder="请选择时间"
          format="yyyy-MM-dd"
          :disabled="isValidDis"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <span class="sty">
          <el-checkbox v-model="isValid" @change="isValidChange">永久有效</el-checkbox>
        </span>
      </el-form-item>
      <el-form-item label="定时发布">
        <el-date-picker
          v-model="form.timedRelease"
          type="date"
          placeholder="请选择时间"
          format="yyyy-MM-dd"
          :disabled="isReleaseDis"
        ></el-date-picker>
        <span class="sty">
          <el-checkbox v-model="isRelease" @change="isReleaseChange">立刻发布</el-checkbox>
        </span>
      </el-form-item>
      <el-form-item label-width="0">
        <div style="text-align:center">
          <el-button type="primary" @click="release">发布</el-button>
          <el-button type="primary" @click="preview('preview')">预览</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import editorQuill from './quillEditor.vue'
import {
  postList,
  getMerchant
} from "@/request/api/market/merchantsMgmt/index";
export default {
  name:"merchantAdvertising",
  components: {
    editorQuill,
  },
  data() {
    return {
      isValid: false,
      isRelease: false,
      form: {
        announcementPic: "",//主图
        announcementContent: "",//公告内容
        announcementTitle: "",
        announcementScope: "",
        announcementSort: "",
        validTime: "",
        timedRelease: "",
        effect: ""
      },
      rules: {
        announcementTitle: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        announcementContent: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        announcementScope: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        announcementSort: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
      },
      imageUrl: "",
      imgList: [
        // "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
      isValidDis: false,
      isReleaseDis: false,
      optionsList: [],
      pickerOptions:{
        disabledDate(time){
          return time.getTime()<Date.now()
        }
      }
    }
  },
  mounted() {
    let _this = this
    getMerchant({ pageNum: 'all' }).then((res) => {
      // console.log(res);
      if (res.data.length > 0) {
        _this.optionsList = res.data.map(item => {
          return {
            id: item.id,
            name: item.merchantName
          }

        })
        _this.$refs.form.clearValidate()
      }
    }).catch((err) => {

    });
  },
  methods: {
    isValidChange(val) {
      // console.log(val);
      if (val) {
        this.isValidDis = true
        this.$set(this.form, 'validTime', '2999-01-01')
      } else {
        this.isValidDis = false
        this.$set(this.form, 'validTime', '')
      }
    },
    isReleaseChange(val) {
      // console.log(val);
      if (val) {
        this.form.effect = 1
        this.isReleaseDis = true
        this.$set(this.form, 'timedRelease', '')
      } else {
        this.form.effect = 2
        this.isReleaseDis = false
      }
    },
    // 富文本数据
    childQuill(val) {
      // console.log(val);
      // this.form.announcementContent = val
      this.$set(this.form,'announcementContent',val)
    },
    release() {
      let _this = this
      this.$refs.form.validate(valid => {
        if (valid) {
          _this.form.announcementPic = _this.imgList.join()
          _this.form.validTime = (new Date(_this.form.validTime)).getTime()
          _this.form.timedRelease = (new Date(_this.form.timedRelease)).getTime()
          _this.$confirm('确认发布吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            postList(_this.form).then(res => {
              if (res.code == 200) {
                _this.closePage()
              }
            })
          })
        }
      })


    },
    cancel() {
      this.closePage()
    },
    preview(type) {
      console.log(this.form.announcementContent);
      this.$router.push({
        // path: `/preview/${type}`,
        name: 'preview',
        query: {
          type
        },
        params: {
          type,
          content: this.form.announcementContent
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.sty {
  margin-left: 5px;
}
.tip {
  font-size: 12px;
  color: #606266;
}
::v-deep .el-input {
  width: 400px;
}
</style>