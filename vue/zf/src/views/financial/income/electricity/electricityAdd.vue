<template>
  <FormPage
    @cancel="cancel"
    @submit="save"
    submitBtnText="确定"
    cancelBtnText="取消"
    :loading="loading"
  >
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称" prop="PowerRateName" :rules="rules">
        <div class="inpWidth">
          <el-input v-model="form.PowerRateName" maxlength="16" show-word-limit placeholder="请输入名称"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="租赁类型" prop="leaseType" :rules="rules">
        <el-checkbox-group v-model="form.leaseType" @change="typeChange">
          <el-checkbox :label="1">商铺</el-checkbox>
          <el-checkbox :label="2">宿舍</el-checkbox>
          <el-checkbox :label="3">仓库</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商铺" v-if="isShops">
        <div class="widthSty">
          <LeaseType v-model="form.leaseInfo.shops" placeholder="请选择人员" :LeaseType="1"></LeaseType>
        </div>
      </el-form-item>
      <el-form-item label="宿舍" v-if="isDormitory">
        <div class="widthSty">
          <LeaseType v-model="form.leaseInfo.dormitory" placeholder="请选择人员" :LeaseType="2"></LeaseType>
        </div>
      </el-form-item>
      <el-form-item label="仓库" v-if="isWarehouse">
        <div class="widthSty">
          <LeaseType v-model="form.leaseInfo.warehouse" placeholder="请选择人员" :LeaseType="3"></LeaseType>
        </div>
      </el-form-item>
      <el-form-item label="价格(元/每吨)" prop="price" :rules="rules">
        <div class="widthSty">
          <el-input v-model.number="form.price"></el-input>
        </div>
      </el-form-item>
     <!--  <el-form-item label="提醒时间">
        <span class="zj-radio">
          <el-switch v-model="form.reminderTime.status" :active-value="1" :inactive-value="0"></el-switch>
          <div class="zj-radio" v-if="form.reminderTime.status == 1">
            <span class="text">电卡月低于</span>
            <el-form-item label-width="0" prop="reminderTime.sumLess" :rules="rulesNum">
              <el-input v-model.number="form.reminderTime.sumLess"></el-input>
            </el-form-item>
            <span class="text">元时,提醒缴费</span>
          </div>
        </span>
      </el-form-item>
      <el-form-item label="自动充值">
        <span class="zj-radio">
          <el-switch v-model="form.autoRecharge.status" :active-value="1" :inactive-value="0"></el-switch>
          <span class="zj-radio" v-if="form.autoRecharge.status === 1">
            <span class="text">电卡余额低于</span>
            <el-form-item label-width="0" prop="autoRecharge.sumLess" :rules="rulesNum">
              <el-input v-model.number="form.autoRecharge.sumLess" clearable></el-input>
            </el-form-item>
            <span class="text">元时,自动充值</span>
            <el-form-item label-width="0" prop="autoRecharge.recharge" :rules="rulesNum">
              <el-input v-model.number="form.autoRecharge.recharge" clearable></el-input>
            </el-form-item>
            <span class="text">元</span>
          </span>
        </span>
      </el-form-item> -->

      <!-- <el-form-item>
        <div>
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>-->
    </el-form>
  </FormPage>
</template>

<script>
import {
  updateRow, addRow, getInfo
} from "@/request/api/financial/income/electricity/index";
export default {
  name: "waterAdd",
  data() {
    return {
      loading: false,
      form: {
        "leaseType": [],
        "PowerRateName": "",
        "price": "",
        /* "reminderTime": {
          "status": 0,
          "sumLess": ""
        },
        "autoRecharge": {
          "status": 0,
          "sumLess": "",
          "recharge": ""
        }, */
        leaseInfo: {
          shops: [],
          dormitory: [],
          warehouse: []
        },
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
    }
  },
  created() {
    let _this = this
    if (_this.$route.query.type == 'edit') {
      _this.loading = true
      getInfo(_this.$route.query.id).then(res => {
        _this.form = res.data
        _this.typeChange(res.data.leaseType)

      }).finally(_ => {
        _this.loading = false
      })
    }
  },
  mounted() {

  },
  methods: {
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
      if (this.isShops == false) this.form.leaseInfo.shops = [];
      if (this.isDormitory == false) this.form.leaseInfo.dormitory = [];
      if (this.isWarehouse == false) this.form.leaseInfo.warehouse = [];
    },
    save() {
      let _this = this
      this.$refs.form.validate(valid => {
        if (valid) {
          _this.$confirm('选择的位置，将适用于新规则', '确定保存吗?', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(_ => {
            _this.loading = true

            // console.log(_this.form);
            if (_this.$route.query.type == 'add') {
              addRow(_this.form).then(res => {
                if (res.code == '200') {
                  _this.loading = false
                  _this.$success("操作成功!")
                  _this.$closePage('/financial/income/electricity')
                }
              }).catch(_ => {
                _this.loading = false
                _this.$error("操作失败!")
              })
                .finally(_ => {
                  _this.loading = false
                })
            } else if (_this.$route.query.type == 'edit') {
              updateRow(_this.$route.query.id, _this.form).then(res => {
                if (res.code == '200') {
                  _this.loading = false
                  _this.$success("操作成功!")
                  _this.$closePage('/financial/income/electricity')
                }
              }).catch(_ => {
                _this.loading = false
                _this.$error("操作失败!")
              })
                .finally(_ => {
                  _this.loading = false
                })
            }

          })
        }
      })

    },
    cancel() {
      this.$closePage('/financial/income/electricity')
    }
  }
}
</script>

<style lang="scss" scoped>
.widthSty {
  width: 400px;
}
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
</style>