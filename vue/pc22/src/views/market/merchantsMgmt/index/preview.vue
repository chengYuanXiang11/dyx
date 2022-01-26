<template>
  <div class="app-container">
    <div class="ql-container ql-snow">
      <div class="ql-editor" v-html="quillContent"></div>
    </div>
  </div>
</template>

<script>
import {
  getInfo
} from "@/request/api/market/merchantsMgmt/index";
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.min.js'
export default {
  name: 'preview',
  data() {
    return {
      quillContent: ""
    }
  },
  created() {
    // console.log(this.$route);
  },
  mounted() {
    let _this = this
    if (this.$route.query.type == 'view') {
      getInfo(this.$route.query.id).then((res) => {
        // console.log(res);
        _this.quillContent = res.data.announcementContent
      }).catch((err) => {

      });
    } else {
      _this.quillContent = _this.$route.params.content
    }

  },

}
</script>