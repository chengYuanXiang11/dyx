<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-descriptions :column="1" size="medium" border labelClassName="labelClassName">
        <el-descriptions-item label="商品明细">
          <el-tag size="small" effect="plain" v-for="(m,i) in goods" :key="i">{{ m }}</el-tag>
        </el-descriptions-item>
         <el-descriptions-item
        :label="item.costName"
        v-for="(item,index) in servicesCost"
        :key="index"
      >{{ item.price }}</el-descriptions-item>
      </el-descriptions>
    </el-form>
  </div>
</template>

<script>
import {
  getInfo
} from "@/request/api/market/merchantServices/serviceCharge";
export default {
  data() {
    return {
      form: {
      },
      goods: [],
      servicesCost: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const self = this
      self.servicesCost = []
      self.goods = []
      getInfo(this.$route.query.id)
        .then((response) => {
          // self.goods =response.data.servicesGoodInfo.map(item => { return item.name })
          self.goods = response.data.goodName
          self.servicesCost = response.data.servicesCost
        })

    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tag {
  margin: 5px 10px;
}
::v-deep .labelClassName {
  width: 150px;
}
</style>