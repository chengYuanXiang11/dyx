<template>
  <FormPage
    @cancel="cancel"
    @submit="saveForm"
    submitBtnText="确定"
    cancelBtnText="取消"
    :loading="loading"
  >
    <el-form ref="form" :model="formItem" label-width="96px">
      <h4>租赁情况</h4>
      <br />
      <el-descriptions>
        <el-descriptions-item label="租赁类型">{{ leaseTypeFormatter(formItem.leaseType) }}</el-descriptions-item>
        <el-descriptions-item label="商位名称">{{ formItem.merchantName }}</el-descriptions-item>
        <el-descriptions-item label="商位号">{{ formItem.locationName }}</el-descriptions-item>
        <el-descriptions-item label="面积(㎡)">{{ formItem.proportion }}</el-descriptions-item>
        <el-descriptions-item label="位置">{{ formItem.areaName }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formItem.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formItem.stopTime }}</el-descriptions-item>
      </el-descriptions>

      <h4>租金</h4>
      <el-form-item label="支付方案:">
        <el-form-item label="支付金额周期">
          <span class="text">每</span>
          <el-input-number :controls="false" v-model.number="formItem.paymentScheme.period"></el-input-number>
          <span class="text"></span>
          <el-select v-model="formItem.paymentScheme.time">
            <el-option
              v-for="item in optionsZjTwo"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="text"></span>
          <el-input-number :controls="false" v-model.number="formItem.paymentScheme.money"></el-input-number>
          <span class="text">元</span>
        </el-form-item>
        <el-form-item label="租金缴费方式">{{ typeFormatter(formItem.payType.type) }}</el-form-item>
        <el-form-item
          label="正常缴费时间"
        >{{ timeFormatter(formItem.payType.time, formItem.payType.type) }}</el-form-item>
        <el-form-item label="提醒时间">
          <span class="flexRow">
            <el-switch v-model="formItem.remindTime.status" :active-value="1" :inactive-value="0" @change="remindTimeChange"></el-switch>
            <span v-if="formItem.remindTime.status == 1" class="spanRow">
              <span class="text">提前</span>
              <el-form-item prop="remindTime.day" :rules="rules">
                <el-input-number
                  :controls="false"
                  :min="1"
                  v-model="formItem.remindTime.day"
                  :disabled="formItem.paymentScheme.time == 'day'"
                ></el-input-number>
              </el-form-item>
              <span class="text" style="margin-left: 15px;">天</span>
              <el-form-item prop="remindTime.time" :rules="rules">
                <el-select v-model.number="formItem.remindTime.time" placeholder=" ">
                  <el-option
                    v-for="(item,index) in options"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>

              <span class="text">点</span>
            </span>
          </span>
        </el-form-item>
      </el-form-item>
      <el-form-item label="保证金金额">{{ formItem.earnestMoney }}元</el-form-item>
      <!-- <el-form-item label="自动扣费">
        <el-switch v-model="formItem.autoFeeDeduction" :active-value="1" :inactive-value="0"></el-switch>
        <span class="text" v-show="formItem.autoFeeDeduction == 1">到达缴费时间时,自动缴费</span>
      </el-form-item> -->

      <h4>水费</h4>
      <el-form-item label="水费价格" :rules="rules">
        <span class="customized">
          <span class="zj-radio">
            <span class="text">每吨</span>
            <el-form-item label-width="0" prop="waterRate.waterPrice.money" :rules="rules">
              <el-input-number
                :controls="false"
                :min="0"
                v-model.number="formItem.waterRate.waterPrice.money"
              ></el-input-number>
            </el-form-item>
            <span class="text">元</span>
          </span>
        </span>
      </el-form-item>
      <!--  <el-form-item label="提醒时间">
        <span class="text">水卡余额低于</span>
        <el-input-number :controls="false" v-model="formItem.waterRate.reminderTime.sumLess"></el-input-number>
        <span class="text">元时,提醒缴费</span>
      </el-form-item>
      <el-form-item label="自动充值">
        <el-switch
          v-model="formItem.waterRate.autoRecharge.status"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
        <span v-show="formItem.waterRate.autoRecharge.status == 1">
          <span class="text">水卡余额低于</span>
          <el-input-number :controls="false" v-model="formItem.waterRate.autoRecharge.sumLess"></el-input-number>
          <span class="text">元时,自动充值</span>
          <el-input-number :controls="false" v-model="formItem.waterRate.autoRecharge.recharge"></el-input-number>
          <span class="text">元</span>
        </span>
      </el-form-item>-->

      <h4>电费</h4>
      <el-form-item label="电费价格" :rules="rules">
        <span class="customized">
          <span class="zj-radio">
            <span class="text">每kw/h</span>
            <el-form-item label-width="0" prop="powerRate.powerPrice.money" :rules="rules">
              <el-input-number
                :controls="false"
                :min="0"
                v-model="formItem.powerRate.powerPrice.money"
              ></el-input-number>
            </el-form-item>
            <span class="text">元</span>
          </span>
        </span>
      </el-form-item>
      <!-- <el-form-item label="提醒时间">
        <span class="text">电卡余额低于</span>
        <el-input-number :controls="false" v-model="formItem.powerRate.reminderTime.sumLess"></el-input-number>
        <span class="text">元时,提醒缴费</span>
      </el-form-item>
      <el-form-item label="自动充值">
        <el-switch
          v-model="formItem.powerRate.autoRecharge.status"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
        <span v-show="formItem.powerRate.autoRecharge.status == 1">
          <span class="text">电卡余额低于</span>
          <el-input-number :controls="false" v-model="formItem.powerRate.autoRecharge.sumLess"></el-input-number>
          <span class="text">元时,自动充值</span>
          <el-input-number :controls="false" v-model="formItem.powerRate.autoRecharge.recharge"></el-input-number>
          <span class="text">元</span>
        </span>
      </el-form-item>
      -->
    
     <!--  <div v-for="(item,index) in formItem.otherRate" :key="index">
        <h4>{{ item.costType }}</h4>
        <el-form-item label="收费周期" :rules="rules">
          <span class="customized">
            <span class="zj-radio">
              <span class="text">每</span>
              <el-form-item
                label-width="0"
                :prop="'otherRate.' + index + '.chargeCycle.period'"
                :rules="rules"
              >
                <el-input-number :controls="false" :min="1" v-model="item.chargeCycle.period"></el-input-number>
              </el-form-item>
              <span class="text"></span>
              <el-form-item
                label-width="0"
                :prop="'otherRate.' + index + '.chargeCycle.time'"
                :rules="rules"
              >
                <el-select v-model="item.chargeCycle.time" placeholder>
                  <el-option
                    v-for="v in optionsZjTwo"
                    :key="v.value"
                    :label="v.label"
                    :value="v.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </span>
          </span>
        </el-form-item>
        <el-form-item label="收费金额" :prop="'otherRate.' + index + '.charge'" :rules="rules">
          <el-input-number :controls="false" v-model="item.charge"></el-input-number>
          <span class="text">元</span>
        </el-form-item>
        <el-form-item label="缴费方式">
          <span>{{ typeFormatter(item.payType) }}</span>
        </el-form-item>
        <el-form-item label="正常缴费时间">
          <span>每1年的12月31日</span>
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-switch
            v-model="item.remindTime.status"
            :active-value="1"
            :inactive-value="0"
            disabled
          ></el-switch>
          <span
            class="text"
            v-show="item.remindTime.status == 1"
          >提前{{ item.remindTime.day }}天{{ item.remindTime.time }}点</span>
        </el-form-item>
        <el-form-item label="自动扣费">
          <el-switch v-model="item.autoFeeDeduction" :active-value="1" :inactive-value="0" disabled></el-switch>
          <span class="text" v-show="item.autoFeeDeduction == 1">到达缴费时间时,自动扣费</span>
        </el-form-item>
      </div> -->

      <!-- <el-form-item label-width="0">
        <div class="btn">
          <el-button type="primary" @click="saveForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>-->
    </el-form>
  </FormPage>
</template>

<script>
import {
  getView,
  getFeeSave
} from "@/request/api/market/merchantsMgmt/leaseManageAdd";
export default {
  data() {
    return {
      loading: false,
      formItem: {
        paymentScheme: {
          period: "",
        },
        payType: {
          type: "",
          time: ""
        },
        remindTime: {
          status: "",
          day: "",
          time: ""
        },
        waterRate: {
          waterPrice: {
            money: ""
          },
          /*  reminderTime: {
             sumLess: ""
           },
           autoRecharge: {
             status: ""
           } */
        },
        powerRate: {
          powerPrice: {
            money: ""
          },
          /*  reminderTime: {
             sumLess: ""
           },
           autoRecharge: {
             status: ""
           } */
        }
      },
      optionsZjTwo: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '日', value: 'day' },
      ],
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      rules: [{ required: true, message: '不能为空' }]
    }
  },
  watch: {
    'formItem.paymentScheme.time'(newVal) {
      if (this.formItem.remindTime.status == 1 && newVal == 'day') {
        this.$set(this.formItem.remindTime, 'day', 1)
      }
    }
  },
  created() {
    let _this = this
    getView(this.$route.query.id).then((result) => {
      _this.formItem = result.data
    }).catch((err) => {

    });
  },
  methods: {
    remindTimeChange(){
      this.$set(this.formItem.remindTime,'day',1)
      this.$set(this.formItem.remindTime,'time',"")
      // this.formItem.remindTime.day = 1
      // this.formItem.remindTime.time = ""
    },
    saveForm() {
      let _this = this
      this.$refs.form.validate(function (valid) {
        if (valid) {
          _this.$confirm("确认保存吗?", '提示', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            console.log(_this.formItem);
            getFeeSave(_this.$route.query.id, _this.formItem).then(res => {
              if (res.code == '200') {
                _this.$success("操作成功")
                _this.cancel()
              }
            })
          })

        }
      })
    },
    cancel() {
      let query = this.$route.query.queryData
      this.$closePage(`/leaseManage/${query.type}`,query)
    },
    leaseTypeFormatter(val) {
      if (val == 1) {
        return '商铺'
      } else if (val == 2) {
        return '宿舍'
      } else if (val == 3) {
        return '仓库'
      } else {
        return val
      }
    },
    typeFormatter(val) {
      if (val == 1) {
        return '按合同日期'
      } else if (val == 2) {
        return '按固定日期'
      } else {
        return val
      }
    },
    timeFormatter(val, type) {
      if (type == 1) {
        return this.formItem.startTime
      } else {
        if (val == 0) {
          return `每${this.formItem.paymentScheme.period}日`
        } else {
          if (val.indexOf('-') == -1) {
            return `每${this.formItem.paymentScheme.period}月${val}日`
          } else {
            return `每${this.formItem.paymentScheme.period}年${val.split('-')[0]}月${val.split('-')[1]}日`
          }
        }
      }


    },

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number {
  width: 80px;
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
      width: 80px;
    }
    ::v-deep .el-select .el-input {
      width: 70px;
      margin: 0 15px;
    }
  }
}

.text {
  margin: 0 5px;
}

.btn {
  text-align: center;
}

::v-deep .el-input {
  width: 80px;
}
::v-deep .el-select .el-input {
  width: 64px;
}
::v-deep .el-form-item {
  margin-bottom: 15px;
}
.flexRow {
  display: flex;
  ::v-deep .el-switch {
    height: 36px;
  }
  ::v-deep .el-input {
    width: 90px;
  }
  ::v-deep .el-select .el-input {
    width: 64px;
    margin: 0 15px;
  }
  .spanRow {
    display: flex;
  }
}
</style>