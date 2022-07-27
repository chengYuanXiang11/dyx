<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <div class="inpWidth">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="费用类型">
        <el-select v-model="form.type2" placeholder="请选择费用类型">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in typeList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="租赁类型">
        <el-checkbox-group v-model="form.type" @change="typeChange">
          <el-checkbox :label="1">商铺</el-checkbox>
          <el-checkbox :label="2">宿舍</el-checkbox>
          <el-checkbox :label="3">仓库</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商铺" v-if="isShops">
        <div class="inpWidth">
          <el-input v-model="form.v1"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="宿舍" v-if="isDormitory">
        <div class="inpWidth">
          <el-input v-model="form.v2"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="仓库" v-if="isWarehouse">
        <div class="inpWidth">
          <el-input v-model="form.v3"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="收费周期" :rules="rules">
        <span class="customized">
          <span class="zj-radio">
            <span class="text">每</span>
            <el-form-item label-width="0" :rules="rulesNum">
              <el-input v-model.number="form.period" clearable></el-input>
            </el-form-item>
            <el-form-item label-width="0" :rules="rules">
              <span class="text"></span>
              <el-select v-model.number="form.time3" placeholder>
                <el-option
                  v-for="item in optionsZjTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </span>
        </span>
      </el-form-item>
      <el-form-item label="收费金额(元)">
        <div class="inpWidth">
          <el-input v-model.number="form.v4"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="缴费方式">
        <span class="radioBox">
          <el-radio-group v-model="form.type1" @change="clearChange">
            <el-radio :label="1">按合同日期</el-radio>
            <el-radio :label="2">
              <span class="zj-radio flexBox">
                <span class="text">按固定日期</span>
                <span v-if="form.time3 == 'month' && form.type1 == 2" class="flexBox">
                  <span class="text">每月</span>
                  <el-form-item label-width="0" :rules="rulesNum">
                    <el-select v-model="form.zjSix" placeholder=" ">
                      <el-option v-for="item in dayList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <span class="text">日</span>
                </span>
                <span v-else-if="form.time3 == 'year' && form.type1 == 2" class="flexBox">
                  <span class="text">每{{ form.period }}年</span>
                  <el-form-item label-width="0" :rules="rulesNum">
                    <el-select v-model="form.zjSixTwo" placeholder=" " @change="monthChange">
                      <el-option v-for="item in 12" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <span class="text">月</span>
                  <el-form-item label-width="0" :rules="rulesNum">
                    <el-select v-model="form.zjSix" placeholder=" ">
                      <el-option v-for="item in dayList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <span class="text">日</span>
                </span>
              </span>
            </el-radio>
          </el-radio-group>
        </span>
      </el-form-item>
      <el-form-item label="提醒时间">
        <span class="zj-radio">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
          <span class="zj-radio" v-if="form.status === 1">
            <span class="text">提前</span>
            <el-input v-model.number="form.day" clearable></el-input>
            <span class="text">天</span>
            <!-- <el-input v-model.number="form.time1" clearable></el-input> -->
            <el-select v-model="form.time1" placeholder>
              <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <span class="text">点</span>
          </span>
        </span>
      </el-form-item>
      <el-form-item label="自动扣费">
        <span class="zj-radio">
          <el-switch v-model="form.status1" :active-value="1" :inactive-value="0"></el-switch>
          <span class="zj-radio" v-if="form.status1 === 1">到达缴费时间时,自动扣费</span>
        </span>
      </el-form-item>

      <el-form-item>
        <div style>
          <el-button type="primary" @click="save">确定</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // name:"waterAdd",
  data() {
    return {
      form: {
        type: []
      },
      isShops: false,
      isDormitory: false,
      isWarehouse: false,
      rules: [
        { required: true, message: '不能为空', trigger: 'change' },
      ],
      rulesNum: [
        { required: true, message: '不能为空', trigger: 'change' },
        { type: 'number', message: '必须为数字值' }
      ],
      typeList: [],
      dayList: [],
      optionsZjTwo: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '日', value: 'day' },
      ],
      options:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    clearChange(val) {
      this.$set(this.form, 'zjSix', '')
      this.$set(this.form, 'zjSixTwo', '')
    },
    monthChange(val) {
      this.$set(this.form, 'zjSix', '')
      if (val == 1 || val == 3 || val == 5 || val == 7 || val == 8 || val == 10 || val == 12) {
        this.dayList = 31
      } else if (val == 4 || val == 6 || val == 9 || val == 11) {
        this.dayList = 30
      } else if (val == 2) {
        this.dayList = 28
      }
    },
    typeChange(val) {
      // console.log(val);
      this.isShops = val.some(item => {
        return item == 1
      })
      this.isDormitory = val.some(item => {
        return item == 2
      })
      this.isWarehouse = val.some(item => {
        return item == 3
      })
    },
    save() {
      let _this = this
      this.$confirm('选择的位置，将适用于新规则', '确定保存吗?', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(_ => {
        console.log(this.form);
        _this.$toast("操作成功!")
      })
    },
    cancel() {
      this.closePage()
    }
  }
}
</script>

<style lang="scss" scoped>
.inpWidth {
  width: 400px;
  display: flex;
  white-space: nowrap;
}

.zj-radio {
  display: flex;

  ::v-deep .el-switch {
    height: 36px;
  }
  ::v-deep .el-input {
    width: 100px;
  }

  .text {
    margin: 0 5px;
    white-space: nowrap;
  }
}

.zj-custom {
  margin-right: 20px;
}
.customized {
  display: flex;
  align-items: center;
  .zj-radio {
    display: flex;
  }
  ::v-deep .el-radio:last-child {
    display: flex;
    align-items: center;
    margin: 15px 0;
  }
  .dis-inline {
    display: flex;
    align-items: center;
    ::v-deep .el-input {
      width: 70px;
    }
    ::v-deep .el-select .el-input {
      width: 70px;
      margin: 0 15px;
    }
  }
}

.radioBox {
  ::v-deep .el-radio,
  ::v-deep .el-radio-group {
    display: flex;
    align-items: center;
    height: 36px;
  }
  & .flexBox {
    display: flex;
    align-items: center;
    height: 36px;
  }
}
</style>