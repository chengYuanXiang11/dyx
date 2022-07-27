<template>
  <FormPage @cancel="cancel" @submit="save" submitBtnText="确定" cancelBtnText="取消">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      v-loading="loading"
      element-loading-text="正在加载中,请稍后..."
    >
      <el-form-item label="名称" prop="rentName" :rules="rulesBlur">
        <div class="inpWidth">
          <el-input v-model="form.rentName" placeholder="请输入名称"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="租赁类型" prop="leaseType" :rules="rulesMessage">
        <el-checkbox-group v-model="form.leaseType" @change="typeChange">
          <el-checkbox :label="1">商铺</el-checkbox>
          <el-checkbox :label="2">宿舍</el-checkbox>
          <el-checkbox :label="3">仓库</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商铺" v-if="isShops">
        <div class="inpWidth">
          <LeaseType v-model="form.leaseInfo.shops" placeholder="请选择人员" :LeaseType="1"></LeaseType>
        </div>
      </el-form-item>
      <el-form-item label="宿舍" v-if="isDormitory">
        <div class="inpWidth">
          <LeaseType v-model="form.leaseInfo.dormitory" placeholder="请选择人员" :LeaseType="2"></LeaseType>
        </div>
      </el-form-item>
      <el-form-item label="仓库" v-if="isWarehouse">
        <div class="inpWidth">
          <LeaseType v-model="form.leaseInfo.warehouse" placeholder="请选择人员" :LeaseType="3"></LeaseType>
        </div>
      </el-form-item>

      <el-form-item label="支付方案" :rules="rules">
        <div class="card-box">
          <el-card class="box-card" v-for="(item,index) in form.payment" :key="index">
            <div slot="header" class="clearfix">
              <span>方案{{ index + 1 }}</span>
              <i
                class="el-icon-delete"
                style="float: right; 
              padding: 10px 0px;
              cursor: pointer;
              color: red;
              font-size: 16px;"
                @click="deleteList(index)"
              ></i>
            </div>
            <div>
              <el-form-item label="支付金额周期">
                <span class="zj-radio">
                  <span class="text">每</span>
                  <el-form-item
                    label-width="0"
                    :prop="'payment.' + index + '.paymentScheme.period'"
                    :rules="rulesNum"
                  >
                    <el-input v-model.number="item.paymentScheme.period" clearable></el-input>
                  </el-form-item>
                  <span class="text"></span>
                  <el-form-item label-width="0" :rules="rules">
                    <el-select
                      v-model="item.paymentScheme.time"
                      placeholder
                      @change="timeChange(item.paymentScheme.time, index)"
                    >
                      <el-option
                        v-for="item in timeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <span class="text"></span>
                  <el-form-item
                    label-width="0"
                    :prop="'payment.' + index + '.paymentScheme.money'"
                    :rules="rulesNum"
                  >
                    <el-input v-model.number="item.paymentScheme.money" clearable></el-input>
                  </el-form-item>
                  <span class="text">元</span>
                </span>
              </el-form-item>
              <div style="margin:20px 0">
                <el-form-item label="房租缴费方式">
                  <span class="radioBox">
                    <el-radio-group
                      v-model="item.payType.type"
                      @change="clearChange(item.payType.type, index)"
                    >
                      <el-radio :label="1">按合同日期</el-radio>
                      <el-radio :label="2">
                        <span class="zj-radio flexBox">
                          <span class="text">按固定日期</span>
                          <span
                            v-if="item.paymentScheme.time == 'month' && item.payType.type == 2"
                            class="flexBox"
                          >
                            <span class="text">每月</span>
                            <el-form-item
                              label-width="0"
                              :prop="'payment.' + index + '.payType.daytime'"
                              :rules="rulesNum"
                            >
                              <el-select v-model="item.payType.daytime" placeholder=" ">
                                <el-option
                                  v-for="item in dayList"
                                  :key="item"
                                  :label="item"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                            <span class="text">日</span>
                          </span>
                          <span
                            v-else-if="item.paymentScheme.time == 'year' && item.payType.type == 2"
                            class="flexBox"
                          >
                            <span class="text">每{{ item.paymentScheme.period }}年</span>
                            <el-form-item
                              label-width="0"
                              :prop="'payment.' + index + '.payType.monthtime'"
                              :rules="rulesNum"
                            >
                              <el-select
                                v-model="item.payType.monthtime"
                                placeholder=" "
                                @change="monthChange(item.payType.monthtime, index)"
                              >
                                <el-option
                                  v-for="item in 12"
                                  :key="item"
                                  :label="item"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                            <span class="text">月</span>
                            <el-form-item
                              label-width="0"
                              :prop="'payment.' + index + '.payType.daytime'"
                              :rules="rulesNum"
                            >
                              <el-select v-model="item.payType.daytime" placeholder=" ">
                                <el-option
                                  v-for="item in dayList"
                                  :key="item"
                                  :label="item"
                                  :value="item"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                            <span class="text">日</span>
                          </span>
                        </span>
                      </el-radio>
                    </el-radio-group>
                  </span>
                </el-form-item>
              </div>

              <el-form-item label="提醒时间">
                <span class="zj-radio">
                  <el-switch
                    v-model="item.remindTime.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="remindTimeChange(item.remindTime.status, index)"
                  ></el-switch>
                  <span class="zj-radio" v-if="item.remindTime.status === 1">
                    <span class="text">提前</span>
                    <el-form-item
                      label-width="0"
                      :prop="'payment.' + index + '.remindTime.day'"
                      :rules="rulesNum"
                    >
                      <el-input-number
                        :controls="false"
                        :min="1"
                        v-model.number="item.remindTime.day"
                        :disabled="item.paymentScheme.time == 'day'"
                        clearable
                      ></el-input-number>
                    </el-form-item>
                    <span class="text">天</span>
                    <el-form-item
                      label-width="0"
                      :prop="'payment.' + index + '.remindTime.time'"
                      :rules="rulesNum"
                    >
                      <el-select v-model="item.remindTime.time" placeholder>
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
            </div>
          </el-card>
        </div>
      </el-form-item>

      <el-form-item>
        <span class="addStyle" @click="addList">+ 添加方案</span>
      </el-form-item>
      <el-form-item label="保证金金额(元)" prop="earnestMoney" :rules="rulesNum">
        <div class="inpWidth">
          <el-input-number :controls="false" :min="0" v-model.number="form.earnestMoney"></el-input-number>
        </div>
      </el-form-item>
      <!-- <el-form-item>
        <div style="text-align:center;">
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
} from "@/request/api/financial/income/rent/index";
export default {
  name: "addEdit",
  data() {
    return {
      loading: false,
      form: {
        rentName: "",
        leaseType: [],
        leaseInfo: {
          shops: [],
          dormitory: [],
          warehouse: []
        },
        payment: [
          {
            "paymentScheme": {
              "period": "",
              "time": "year",
              "money": ""
            },
            "payType": {
              "type": 1,
              "time": "",
              daytime: "",//日
              monthtime: ""//月
            },
            "remindTime": {
              "status": 0,
              "day": "",
              "time": ""
            }
          }
        ],
        earnestMoney: "",

      },
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      isShops: false,
      isDormitory: false,
      isWarehouse: false,
      timeList: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '日', value: 'day' },
      ],
      rules: [
        { required: true, message: '不能为空', trigger: 'change' },
      ],
      rulesMessage: [
        { required: true, message: '请选择租赁类型', trigger: 'change' },
      ],
      rulesBlur: [
        { required: true, message: '不能为空', trigger: 'blur' },
      ],
      rulesNum: [
        { required: true, message: '不能为空', trigger: 'change' },
        { type: 'number', message: '必须为数字值' }
      ],
      dayList: [],
    }
  },
  created() {
    let _this = this
    if (_this.$route.query.type == 'edit') {
      _this.loading = true
      getInfo(_this.$route.query.id).then(res => {
        _this.form = res.data
        _this.form.payment.map(item => {
          if (item.payType.type == 2) {
            if (item.paymentScheme.time == 'year') {
              let t = item.payType.time.split('-')
              _this.$set(item.payType, 'monthtime', Number(t[0]))
              _this.monthDay(item.payType.monthtime)
              _this.$set(item.payType, 'daytime', Number(t[1]))
            } else if (item.paymentScheme.time == 'month') {
              _this.$set(item.payType, 'daytime', item.payType.time)
              _this.dayList = 31
            }
          }
          _this.$set(item.remindTime, 'time', item.remindTime.time)

          _this.typeChange(res.data.leaseType)

        })
      }).finally(_ => {
        _this.loading = false
      })
    }
  },
  mounted() {

  },
  methods: {
    remindTimeChange(val, index) {
      this.form.payment[index].remindTime.day = 1
      this.form.payment[index].remindTime.time = ""
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
      if (this.isShops == false) this.form.leaseInfo.shops = [];
      if (this.isDormitory == false) this.form.leaseInfo.dormitory = [];
      if (this.isWarehouse == false) this.form.leaseInfo.warehouse = [];
    },
    clearChange(val, index) {
      this.$set(this.form.payment[index].payType, 'daytime', '')
      this.$set(this.form.payment[index].payType, 'monthtime', '')
    },
    monthChange(val, index) {
      this.$set(this.form.payment[index].payType, 'daytime', '')
      if (this.form.payment[index].paymentScheme.time == 'year' && this.form.payment[index].payType.type == 2) {
        this.monthDay(val)
      } else {
        this.dayList = 0
      }
    },
    monthDay(val) {
      if (val == 1 || val == 3 || val == 5 || val == 7 || val == 8 || val == 10 || val == 12) {
        this.dayList = 31
      } else if (val == 4 || val == 6 || val == 9 || val == 11) {
        this.dayList = 30
      } else if (val == 2) {
        this.dayList = 28
      }
    },
    timeChange(val, index) {
      this.$set(this.form.payment[index].payType, 'daytime', '')
      this.$set(this.form.payment[index].payType, 'monthtime', '')
      if (val == 'month') {
        this.dayList = 31
      }
      if (this.form.payment[index].remindTime.status == 1 && val == 'day') {
        this.$set(this.form.payment[index].remindTime, 'day', 1)
      }
    },
    addList() {
      this.form.payment.push({
        "paymentScheme": {
          "period": "",
          "time": "year",
          "money": ""
        },
        "payType": {
          "type": 1,
          "time": "",
          daytime: "",
          monthtime: ""
        },
        "remindTime": {
          "status": 1,
          "day": "",
          "time": ""
        }
      })
    },
    deleteList(index) {
      this.form.payment.splice(index, 1)
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

            _this.form.payment.map(item => {
              if (item.payType.type == 1) {
                delete item.payType.time
              } else {
                if (item.paymentScheme.time == 'year') {
                  item.payType.time = `${item.payType.monthtime}-${item.payType.daytime}`
                } else if (item.paymentScheme.time == 'month') {
                  item.payType.time = item.payType.daytime
                } else {
                  delete item.payType.time
                }
              }
              delete item.payType.monthtime
              delete item.payType.daytime
            })

            // console.log(_this.form);
            if (_this.$route.query.type == 'add') {
              addRow(_this.form).then(res => {
                if (res.code == '200') {
                  _this.loading = false
                  _this.$success("操作成功!")
                  _this.$closePage()
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
                  _this.$closePage()
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
      this.$closePage()
    }
  }
}
</script>

<style lang="scss" scoped>
.inpWidth {
  width: 400px;
}
.addStyle {
  color: #048790;
  font-size: 15px;
  cursor: pointer;
}
.card-box {
  border: 1px solid #dedede;
  width: 660px;
  box-sizing: border-box;
  padding: 20px;

  .zj-radio {
    display: flex;

    ::v-deep .el-switch {
      height: 36px;
    }

    .text {
      margin: 0 5px;
      white-space: nowrap;
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

  ::v-deep .el-card__header {
    padding: 8px 20px;
    background: #f3f3f3;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 618px;

    & + .box-card {
      margin-top: 15px;
    }
  }
}
.flexRow {
  display: flex;
  ::v-deep .el-switch {
    height: 36px;
  }
  /*   ::v-deep .el-input {
    width: 90px;
  }
  ::v-deep .el-select .el-input {
    width: 64px;
    margin: 0 15px;
  } */
  .spanRow {
    display: flex;
  }
}
</style>