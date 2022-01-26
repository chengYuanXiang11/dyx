<template>
  <div class="hl-pagination" style="text-align: right;">
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :page-size="10"
      @current-change="chanagePage"
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'totalPage'
    ])
  },
  methods: {
    chanagePage (curPage) {
      console.log(curPage)
    }
  }
}
</script>
