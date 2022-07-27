<template>
  <div class="edit_container">
    <quill-editor
      class="ql-editor"
      v-model="content"
      ref="quillEditorRef"
      :options="quillOption"
      @focus="onEditorFocus($event)"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
    ></quill-editor>

    <!-- <el-upload
      class="avatar-uploader"
      :action="action"
      :show-file-list="false"
      :file-list="fileList"
      name="img"
      :on-success="uploadSuccss"
      :on-error="uploadError"
      :before-upload="beforeUpload"
      :limit="1"
      :headers="headers"
    >
    </el-upload>-->
    <!-- 框架图片上传组件 -->
    <div class="upload-component" v-show="false">
      <UploadImg v-model="imgList" :limit="99"></UploadImg>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import quillConfig from './quillconfig'
import 'quill/dist/quill.min.js'

import { getToken } from "@/utils/auth";
export default {
  components: {
    quillEditor
  },
  props: ['id', 'refs', 'quillContent'],
  data() {
    return {
      fileList: [],
      action: process.env.VUE_APP_BASE_API + "/system/savefile/",
      content: null, // 富文本内容
      quillOption: quillConfig,//各配置项
      imgList: [],
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    }
  },
  watch: {
    imgList(newVal) {
      // console.log(newVal);
      let quill = this.$refs.quillEditorRef.quill
      if (newVal.length > 0) {
        let length = quill.getSelection().index;
        quill.insertEmbed(length, 'image', newVal[0]);
        quill.setSelection(length + 1)
        this.imgList.pop()
      }
    }
  },
  created() {
    this.content = this.quillContent
  },
  mounted() {
    autotip: {
      document.getElementsByClassName('ql-editor')[0].dataset.placeholder = ''
      for (let item of quillConfig.titleConfig) {
        let tip = document.querySelector('.quill-editor ' + item.Choice)
        if (!tip) continue
        tip.setAttribute('title', item.title)
      }
    }
  },
  methods: {
    // 失去焦点事件
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    // 富文本内容改变事件
    onEditorChange({ quill, html, text }) {
      this.content = html
      this.$emit('childQuill', html)
    },
  }
}
</script>

<style scoped >
::v-deep .ql-editor {
  line-height: normal !important;
  /* width: 335px;  */
  min-height: 220px;
}
::v-deep .ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
::v-deep .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

::v-deep .ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

::v-deep .ql-snow .ql-picker.ql-font .ql-picker-label::before,
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
<style>
/* 自定义上传文件的icon */
/* .ql-upload {
  background-image: url("../assets/images/file.svg") !important;
  background-size: 16px 16px !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
} */
/* 隐藏文件上传的input type=file的样式 */
/* input.ql-upload {
  height: 0 !important;
  width: 0 !important;
  padding: 0 !important;
} */
</style>