<template>
  <FormPage
    @cancel="cancelFun"
    @submit="submit"
    submitBtnText="提交"
    cancelBtnText="取消"
    :loading="loading"
  >
    <div>
      <span class="addClass">租赁信息</span>
      <el-button type="primary" class="el-icon-plus" size="small" @click="addTags">添加商位</el-button>
    </div>
    <div class="tags-list">
      <el-tag
        :type="tagIndex == tagsActive ? 'primary' : 'info'"
        :key="tagIndex"
        v-for="(tag,tagIndex) in dynamicTags"
        closable
        size="medium"
        :disable-transitions="false"
        @click="handleClick(tagIndex)"
        @close="handleClose(tagIndex)"
      >{{ tag }}</el-tag>
    </div>
    <el-form ref="form" :model="form[tagsActive]" label-width="130px">
      <div class="lease" v-for="(formItem,formIndex) in form" :key="formIndex">
        <div v-if="tagsActive == formIndex">
          <div>租赁</div>
          <el-form-item label="租赁类型" prop="leaseType" :rules="rules">
            <el-select
              v-model.number="formItem.leaseType"
              placeholder="请选择租赁类型"
              @change="typeChange(formItem.leaseType, formIndex)"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in optionsOne"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置" :rules="rules">
            <div class="select-more">
              <el-form-item label-width="0" prop="location.area" :rules="rules">
                <el-select
                  v-model="formItem.location.area"
                  placeholder="请选择区域"
                  filterable
                  clearable
                  @change="areaChange(formItem.location.area, formIndex)"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item,index) in pzOneList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0" prop="location.building" :rules="rules">
                <el-select
                  v-model="formItem.location.building"
                  placeholder="请选择建筑"
                  filterable
                  clearable
                  @change="floorChange(formItem.location.building, formIndex)"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item,index) in arrayList[formIndex].pzTwoList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0" prop="location.floor" :rules="rules">
                <el-select
                  v-model="formItem.location.floor"
                  placeholder="请选择楼层"
                  filterable
                  clearable
                  @change="swChange(formItem.location.floor, formIndex)"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item,index) in arrayList[formIndex].pzThreeList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="商位号" prop="locationNumber" :rules="rules">
            <el-select
              v-model="formItem.locationNumber"
              @change="changeShow"
              placeholder="请选择商位号"
              filterable
              clearable
            >
              <el-option
                :label="item.locationName"
                :value="item.locationId"
                v-for="(item,index) in arrayList[formIndex].optionsTwo"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商位面积(㎡)">{{ formItem.proportion }}</el-form-item>
          <el-form-item label="商位名称">
            <el-input v-model="formItem.merchantName" :maxlength="18" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime" :rules="rules">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="formItem.startTime"
              type="date"
              placeholder="选择日期时间"
              :picker-options="pickerOptionsStart"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="stopTime" :rules="rules">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="formItem.stopTime"
              type="date"
              placeholder="选择日期时间"
              :picker-options="pickerOptionsEnd"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div v-if="tagsActive == formIndex">
          <div>租金</div>
          <el-form-item label="支付方案" :rules="rules">
            <!-- 有数据情况 -->
            <div v-if="formItem.isShow == 1">
              <span v-show="false">{{ getRadioCustom }}</span>
              <el-form-item label label-width="0">
                <el-radio-group v-model="formItem.radioCustom">
                  <el-radio
                    :label="indexPay"
                    v-for="(itemPay,indexPay) in arrayList[formIndex].paymentList"
                    :key="indexPay"
                  >每{{ itemPay.paymentScheme.period }}{{ itemPay.paymentScheme.time | timeFilter }}{{ itemPay.paymentScheme.money }}元</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label=" " label-width="0">
                <div class="customized">
                  <el-radio-group v-model="formItem.radioCustom">
                    <el-radio :label="999999">
                      <div class="dis-inline">
                        <span class="zj-custom">自定义</span>
                        <span class="dis-inline">
                          <span class="text">每</span>
                          <el-form-item
                            label-width="0"
                            prop="paymentSchemeCustom.period"
                            :rules="formItem.radioCustom == 999999 ? rulesNum : []"
                            :show-message="formItem.radioCustom == 999999"
                          >
                            <el-input
                              v-model.number="formItem.paymentSchemeCustom.period"
                              clearable
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            label-width="0"
                            prop="paymentSchemeCustom.time"
                            :rules="rules"
                          >
                            <el-select
                              v-model="formItem.paymentSchemeCustom.time"
                              placeholder
                              @change="timeChange"
                            >
                              <el-option
                                v-for="item in optionsZjTwo"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item
                            label-width="0"
                            prop="paymentSchemeCustom.money"
                            :rules="formItem.radioCustom == 999999 ? rulesNum : []"
                            :show-message="formItem.radioCustom == 999999"
                          >
                            <el-input v-model.number="formItem.paymentSchemeCustom.money" clearable></el-input>
                          </el-form-item>
                          <span class="text">元</span>
                        </span>
                      </div>
                    </el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </div>

            <!-- 无数据情况 -->
            <div class="customized" v-if="formItem.isShow == 2">
              <span class="zj-radio">
                <span class="text">每</span>
                <el-form-item label-width="0" prop="paymentScheme.period" :rules="rulesNum">
                  <el-input v-model.number="formItem.paymentScheme.period" clearable></el-input>
                </el-form-item>
                <el-form-item label-width="0" prop="paymentScheme.time" :rules="rules">
                  <el-select v-model="formItem.paymentScheme.time" placeholder @change="timeChange">
                    <el-option
                      v-for="item in optionsZjTwo"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="0" prop="paymentScheme.money" :rules="rulesNum">
                  <el-input v-model.number="formItem.paymentScheme.money" clearable></el-input>
                </el-form-item>
                <span class="text">元</span>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="缴费方式">
            <span class="radioBox">
              <el-radio-group
                v-model="formItem.payType.type"
                :disabled="formItem.isShow == 1 && formItem.radioCustom != 999999"
              >
                <el-radio :label="1">按合同日期</el-radio>
                <el-radio :label="2">
                  <span class="zj-radio flexBox">
                    <span class="text">按固定日期</span>
                    <span
                      v-if="formItem.paymentScheme.time == 'month' && formItem.payType.type == 2"
                      class="flexBox"
                    >
                      <span class="text">每月</span>
                      <el-form-item label-width="0" prop="payType.zjSix" :rules="rules">
                        <el-select
                          v-model="formItem.payType.zjSix"
                          placeholder=" "
                          :disabled="formItem.isShow == 1 && formItem.radioCustom != 999999"
                        >
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
                      v-else-if="formItem.paymentScheme.time == 'year' && formItem.payType.type == 2"
                      class="flexBox"
                    >
                      <span class="text">每{{ formItem.paymentScheme.period }}年</span>
                      <el-form-item label-width="0" prop="payType.zjSixTwo" :rules="rules">
                        <el-select
                          v-model="formItem.payType.zjSixTwo"
                          placeholder=" "
                          @change="monthChange"
                          :disabled="formItem.isShow == 1 && formItem.radioCustom != 999999"
                        >
                          <el-option v-for="item in 12" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                      <span class="text">月</span>
                      <el-form-item label-width="0" prop="payType.zjSix" :rules="rules">
                        <el-select
                          v-model="formItem.payType.zjSix"
                          placeholder=" "
                          :disabled="formItem.isShow == 1 && formItem.radioCustom != 999999"
                        >
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
          <el-form-item label="正常缴费时间">
            {{ formItem.zjSeven }}
            <span v-show="false">{{ payTime }}</span>
          </el-form-item>
          <el-form-item label="首次缴费金额(元)">
            {{ formItem.firstPayPrice }}
            <span v-show="false">{{ payFee }}</span>
          </el-form-item>
          <el-form-item label="保证金金额(元)" prop="earnestMoney" :rules="rulesNum">
            <el-input-number :controls="false" :min="0" v-model.number="formItem.earnestMoney"></el-input-number>
          </el-form-item>
          <el-form-item label="提醒时间">
            <span class="flexRow">
              <el-switch
                v-model="formItem.remindTime.status"
                :active-value="1"
                :inactive-value="0"
                @change="remindeTimeChange"
                :disabled="formItem.isShow == 1 && formItem.radioCustom != 999999"
              ></el-switch>
              <span v-if="formItem.remindTime.status === 1" class="spanRow">
                <span class="text">提前</span>
                <el-form-item label-width="0" prop="remindTime.day" :rules="rulesNum">
                  <el-input-number
                    :controls="false"
                    :min="1"
                    v-model.number="formItem.remindTime.day"
                    :disabled="formItem.paymentScheme.time == 'day' || (formItem.isShow == 1 && formItem.radioCustom != 999999)"
                    clearable
                  ></el-input-number>
                </el-form-item>
                <span class="text">天</span>
                <el-form-item label-width="0" prop="remindTime.time" :rules="rulesNum">
                  <el-select
                    v-model.number="formItem.remindTime.time"
                    placeholder=" "
                    :disabled="formItem.isShow == 1 && formItem.radioCustom != 999999"
                  >
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
          <!-- <el-form-item label="自动扣费">
            <el-switch v-model="formItem.autoFeeDeduction" :active-value="1" :inactive-value="0"></el-switch>
            <span class="text" v-if="formItem.autoFeeDeduction === 1">到达缴费时间时,自动扣费</span>
          </el-form-item>-->
          <div>水费</div>
          <el-form-item label="水费价格" prop="waterRate.waterPrice.money" :rules="rulesNum">
            <span class="customized">
              <span class="zj-radio">
                <!-- <span class="text">每吨</span> -->
                <el-input-number
                  :controls="false"
                  :min="0"
                  v-model.number="formItem.waterRate.waterPrice.money"
                ></el-input-number>
                <span class="text">元 / 吨</span>
              </span>
            </span>
          </el-form-item>
          <!-- <el-form-item label="提醒时间">
            <span class="flexRow">
              <el-switch
                v-model="formItem.waterRate.reminderTime.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
              <span v-if="formItem.waterRate.reminderTime.status === 1" class="spanRow">
                <span class="text">水卡余额低于</span>
                <el-form-item
                  label-width="0"
                  prop="waterRate.reminderTime.sumLess"
                  :rules="rulesNum"
                >
                  <el-input v-model.number="formItem.waterRate.reminderTime.sumLess" :min="0"></el-input>
                </el-form-item>
                <span class="text">元时,提醒缴费</span>
              </span>
            </span>
          </el-form-item>
          <el-form-item label="自动充值">
            <span class="flexRow">
              <el-switch
                v-model="formItem.waterRate.autoRecharge.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
              <span v-if="formItem.waterRate.autoRecharge.status === 1" class="spanRow">
                <span class="text">水卡余额低于</span>
                <el-form-item
                  label-width="0"
                  prop="waterRate.autoRecharge.sumLess"
                  :rules="rulesNum"
                >
                  <el-input v-model.number="formItem.waterRate.autoRecharge.sumLess" clearable></el-input>
                </el-form-item>
                <span class="text">元时,自动充值</span>
                <el-form-item
                  label-width="0"
                  prop="waterRate.autoRecharge.sumLess"
                  :rules="rulesNum"
                >
                  <el-input v-model.number="formItem.waterRate.autoRecharge.recharge" clearable></el-input>
                </el-form-item>
                <span class="text">元</span>
              </span>
            </span>
          </el-form-item>-->
          <div>电费</div>
          <el-form-item label="电费价格" prop="powerRate.powerPrice.money" :rules="rulesNum">
            <span class="customized">
              <span class="zj-radio">
                <!-- <span class="text">每kw/h</span> -->
                <el-input-number
                  :controls="false"
                  :min="0"
                  v-model.number="formItem.powerRate.powerPrice.money"
                ></el-input-number>
                <span class="text">元 / (kw/h)</span>
              </span>
            </span>
          </el-form-item>
          <!-- <el-form-item label="提醒时间">
            <span class="flexRow">
              <el-switch
                v-model="formItem.powerRate.reminderTime.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
              <span v-if="formItem.powerRate.reminderTime.status === 1" class="spanRow">
                <span class="text">电费余额低于</span>
                <el-form-item
                  label-width="0"
                  prop="powerRate.reminderTime.sumLess"
                  :rules="rulesNum"
                >
                  <el-input v-model.number="formItem.powerRate.reminderTime.sumLess" clearable></el-input>
                </el-form-item>
                <span class="text">元时,提醒缴费</span>
              </span>
            </span>
          </el-form-item>
          <el-form-item label="自动充值">
            <span class="flexRow">
              <el-switch
                v-model="formItem.powerRate.autoRecharge.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
              <span class="spanRow" v-if="formItem.powerRate.autoRecharge.status === 1">
                <span class="text">水卡余额低于</span>
                <el-form-item
                  label-width="0"
                  prop="powerRate.autoRecharge.sumLess"
                  :rules="rulesNum"
                >
                  <el-input v-model.number="formItem.powerRate.autoRecharge.sumLess" clearable></el-input>
                </el-form-item>
                <span class="text">元时,自动充值</span>
                <el-form-item
                  label-width="0"
                  prop="powerRate.autoRecharge.recharge"
                  :rules="rulesNum"
                >
                  <el-input v-model.number="formItem.powerRate.autoRecharge.recharge" clearable></el-input>
                </el-form-item>
                <span class="text">元</span>
              </span>
            </span>
          </el-form-item>-->

          <!--  <div v-for="(otherItem,otherIndex) in formItem.otherRate" :key="otherIndex">
            <div>{{ otherItem.costType }}</div>
            <el-form-item label="收费周期" :rules="rules">
              <span class="customized">
                <span class="zj-radio">
                  <span class="text">每</span>
                  <el-form-item
                    label-width="0"
                    :prop="'otherRate.' + otherIndex + '.chargeCycle.period'"
                    :rules="rulesNum"
                  >
                    <el-input v-model.number="otherItem.chargeCycle.period" clearable></el-input>
                  </el-form-item>
                  <el-form-item
                    label-width="0"
                    :prop="'otherRate.' + otherIndex + '.chargeCycle.time'"
                    :rules="rules"
                  >
                    <span class="text"></span>
                    <el-select v-model.number="otherItem.chargeCycle.time" placeholder>
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
            <el-form-item
              label="收费金额(元)"
              :prop="'otherRate.' + otherIndex + '.charge'"
              :rules="rulesNum"
            >
              <el-input v-model.number="otherItem.charge" clearable></el-input>
            </el-form-item>
            <el-form-item
              label="缴费方式"
              :prop="'otherRate.' + otherIndex + '.payType'"
              :rules="rules"
            >
              <el-radio-group v-model="otherItem.payType" disabled>
                <el-radio :label="2">按固定日期</el-radio>
                <el-radio :label="1">按合同日期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="正常缴费时间">
              <el-input v-model="otherItem.wsfFive" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="首次缴费金额(元)"
              :prop="'otherRate.' + otherIndex + '.firstPayPrice'"
              :rules="rules"
            >
              <el-input v-model="otherItem.firstPayPrice"></el-input>
            </el-form-item>
            <el-form-item label="提醒时间">
              <span class="flexRow">
                <el-switch
                  v-model="otherItem.remindTime.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
                <span v-if="otherItem.remindTime.status === 1" class="spanRow">
                  <span class="text">提前</span>
                  <el-form-item
                    label-width="0"
                    :prop="'otherRate.' + otherIndex + '.remindTime.day'"
                    :rules="rulesNum"
                  >
                    <el-input v-model.number="otherItem.remindTime.day" clearable></el-input>
                  </el-form-item>
                  <span class="text">天</span>
                  <el-select v-model.number="otherItem.remindTime.time" placeholder=" ">
                    <el-option
                      v-for="(item,index) in options"
                      :key="index"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <span class="text">点</span>
                </span>
              </span>
            </el-form-item>
            <el-form-item label="自动扣费">
              <el-switch v-model="otherItem.autoFeeDeduction" :active-value="1" :inactive-value="0"></el-switch>
              <span class="text" v-if="otherItem.autoFeeDeduction === 1">到达缴费时间时自动扣费</span>
            </el-form-item>
          </div>-->
        </div>
      </div>
    </el-form>
  </FormPage>
</template>

<script>
import {
  getArea, getBuilding, getFloor, getSw, submitRequest, getDataInfo
} from "@/request/api/market/merchantsMgmt/leaseManageAdd";
import { number } from 'echarts';
export default {
  name: "leaseManageAdd",
  data() {
    return {
      loading: false,
      form: [],
      dynamicTags: [],
      tagsActive: 0,
      optionsOne: [
        { label: "商铺", value: 1 },
        { label: "宿舍", value: 2 },
        { label: "仓库", value: 3 },
      ],
      arrayList: [],
      num: 0,
      pzOneList: [],
      optionsZjTwo: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '日', value: 'day' },
      ],
      rules: [
        { required: true, message: '不能为空', trigger: 'change' },
      ],
      rulesNum: [
        { required: true, message: '不能为空', trigger: 'change' },
        { type: 'number', message: '必须为数字值' }
      ],
      dayList: [],
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],

    }
  },
  computed: {
    // 开始时间结束时间禁用
    pickerOptionsStart() {
      let _this = this
      return {
        disabledDate(time) {
          if (_this.form[_this.tagsActive].stopTime && _this.form[_this.tagsActive].stopTime !== "") {
            return time.getTime() >= new Date(_this.form[_this.tagsActive].stopTime).getTime()
          }
        }
      }
    },
    pickerOptionsEnd() {
      let _this = this
      return {
        disabledDate(time) {
          if (_this.form[_this.tagsActive].startTime && _this.form[_this.tagsActive].startTime !== "") {
            return time.getTime() <= new Date(_this.form[_this.tagsActive].startTime).getTime()
          }
        }
      }
    },
    // 首次缴费时间
    payTime() {
      let form = this.form[this.tagsActive]
      if (form.payType.type == 1) {
        let val = form.startTime
        return form.zjSeven = val //为合同日期的时候设置为开始时间
        /* if (val != "") {
          if (form.paymentScheme.time == 'year') {
            return form.zjSeven = '每' + form.paymentScheme.period + '年的' + val.slice(5, 7) + '月' + val.slice(8) + '日'
          } else if (form.paymentScheme.time == 'month') {
            return form.zjSeven = '每' + form.paymentScheme.period + '个月的' + val.slice(8) + '日'
          } else if (form.paymentScheme.time == 'day') {
            return form.zjSeven = `每${form.paymentScheme.period}日`
          } else {
            return form.zjSeven = ''
          }
        } */
      } else {
        if (form.paymentScheme.time == 'year') {
          if (form.payType.zjSixTwo != "" && form.payType.zjSix != "") {
            return (form.zjSeven = '每' + form.paymentScheme.period + '年的' + form.payType.zjSixTwo + '月' + form.payType.zjSix + '日')
          }
        } else if (form.paymentScheme.time == 'month') {
          if (form.payType.zjSix != "") {
            return (form.zjSeven = '每' + form.paymentScheme.period + '个月的' + form.payType.zjSix + '日')
          }
        } else if (form.paymentScheme.time == 'day') {
          return form.zjSeven = `每${form.paymentScheme.period}日`
        } else {
          return form.zjSeven = ''
        }

      }
    },
    // 首次缴费金额
    payFee() {
      let form = this.form[this.tagsActive]
      if (form.payType.type == 1) {
        return form.firstPayPrice = form.paymentScheme.money
      } else {
        let val = form.startTime
        let monthTime = form.payType.zjSixTwo < 10 ? ('0' + form.payType.zjSixTwo) : form.payType.zjSixTwo
        let dayTime = form.payType.zjSix < 10 ? ('0' + form.payType.zjSix) : form.payType.zjSix
        if (form.paymentScheme.time == 'year') {
          if (val != "" && monthTime != "" && dayTime != "") {
            let t1 = monthTime + '-' + dayTime //固定日期月日 
            let t2 = val.slice(0, 4) + '-' + monthTime + '-' + dayTime  //固定日期年月日 大于开始时间的情况  当年
            let t3 = String(Number(val.slice(0, 4)) + 1) + '-' + monthTime + '-' + dayTime //固定日期年月日 小于开始时间的情况  下一年
            if (this.getTimeFn(val.slice(5)) < this.getTimeFn(t1)) {//比较月日大小 小则不跨年
              let day = this.getDayFn(val, t2)  //天数计算
              let money = (((form.paymentScheme.money / form.paymentScheme.period) / 365) * day).toFixed(2) // (金额/时间/365)*天数
              return form.firstPayPrice = money
            } else if (this.getTimeFn(val.slice(5)) > this.getTimeFn(t1)) {//跨年
              let day = this.getDayFn(val, t3)
              let money = (((form.paymentScheme.money / form.paymentScheme.period) / 365) * day).toFixed(2)
              return form.firstPayPrice = money
            } else {
              return form.firstPayPrice = form.paymentScheme.money
            }
          }
        } else if (form.paymentScheme.time == 'month') {//当月 下月  跨年月=>等于12则下月为年份+1+1月+日
          if (val != "" && dayTime != "") {
            let t1 = val.slice(8)  //开始时间
            if (t1 < dayTime) { //当月
              let day = dayTime - t1
              let money = (((form.paymentScheme.money / form.paymentScheme.period) / 30) * day).toFixed(2)
              return form.firstPayPrice = money
            } else if (t1 > dayTime) {
              if (val.slice(5, 7) == '12') {//12月跨月跨年 下一年1月几号
                let t2 = String(Number(val.slice(0, 4)) + 1) + '-01' + '-' + dayTime //固定日期  年月日
                let day = this.getDayFn(val, t2)
                let money = (((form.paymentScheme.money / form.paymentScheme.period) / 30) * day).toFixed(2)
                return form.firstPayPrice = money
              } else {//跨月
                let t2 = val.slice(0, 4) + '-' + String(Number(val.slice(5, 7)) + 1) + '-' + dayTime
                let day = this.getDayFn(val, t2)
                let money = (((form.paymentScheme.money / form.paymentScheme.period) / 30) * day).toFixed(2)
                return form.firstPayPrice = money
              }
            } else {
              return form.firstPayPrice = form.paymentScheme.money
            }
          }
        } else {
          return form.firstPayPrice = form.paymentScheme.money
        }

      }
    },

    // 租金支付方案有数据时监听
    getRadioCustom() {
      // console.log(this.$refs.form)
      let tagIndex = this.tagsActive
      let radioIndex = this.form[tagIndex].radioCustom
      if (radioIndex === 999999) {//无数据
        this.form[tagIndex].paymentScheme = this.form[tagIndex].paymentSchemeCustom
      } else {//有数据
        this.form[tagIndex].paymentScheme = this.arrayList[tagIndex].paymentList[radioIndex].paymentScheme //支付方案
        this.form[tagIndex].remindTime = this.arrayList[tagIndex].paymentList[radioIndex].remindTime       //提醒时间
        this.form[tagIndex].payType.type = this.arrayList[tagIndex].paymentList[radioIndex].payType.type   //缴费方式

        if (this.form[tagIndex].payType.type == 2) {
          let val = this.arrayList[tagIndex].paymentList[radioIndex].payType.time
          if (val == 0) {
            this.form[tagIndex].payType.zjSixTwo = ""
            this.form[tagIndex].payType.zjSix = ""
          } else {
            if (typeof val == 'number') {
              val = val + ""
            }
            if (val.indexOf('-') == -1) {
              this.form[tagIndex].payType.zjSix = val
            } else {
              this.form[tagIndex].payType.zjSixTwo = val.split('-')[0]
              this.form[tagIndex].payType.zjSix = val.split('-')[1]
            }
          }

        }
      }
      return radioIndex //选中规则的下标

    }
  },
  created() {
    let _this = this
    // 区域
    this.pzOneList = []
    getArea({ pageNum: 'all' }).then(res => {
      _this.pzOneList = res.data.map(item => {
        return {
          label: item.area_name,
          value: item.id
        }
      })
    })
  },
  mounted() {
    this.addTags()
  },
  watch: {

  },
  filters: {
    timeFilter(value) {
      if (value == 'year') {
        return "年"
      } else if (value == 'month') {
        return "月"
      } else if (value == 'day') {
        return "天"
      } else {
        return value
      }
    }
  },
  methods: {
    // 变化后重置数据，支付方案为日时，提醒时间设置为1
    remindeTimeChange() {
      this.$set(this.form[this.tagsActive].remindTime, 'day', 1)
      this.$set(this.form[this.tagsActive].remindTime, 'time', "")
    },
    // 每次变化后清空 日
    timeChange(val) {
      this.form[this.tagsActive].payType.zjSix = ""
      this.form[this.tagsActive].payType.zjSixTwo = ""
      if (val == 'month') {
        this.dayList = 31
      }
      if (this.form[this.tagsActive].remindTime.status === 1 && val == 'day') {
        this.$set(this.form[this.tagsActive].remindTime, 'day', 1)
      }
    },
    monthChange(val) {
      this.form[this.tagsActive].payType.zjSix = []
      if (val == 1 || val == 3 || val == 5 || val == 7 || val == 8 || val == 10 || val == 12) {
        this.dayList = 31
      } else if (val == 4 || val == 6 || val == 9 || val == 11) {
        this.dayList = 30
      } else if (val == 2) {
        this.dayList = 28
      } else {
        this.dayList = 31
      }
    },
    getTimeFn(time) {
      if (time != "") {
        return ((new Date(time).getTime())) / (24 * 60 * 60 * 1000)
      }
    },
    // 每月天数计算  超过天数按最后一天算
    formatterTime(time) {
      let year = time.slice(0, 4) //年
      let val = time.slice(5, 7) //月
      let day = time.slice(8) //日
      if (val == 1 || val == 3 || val == 5 || val == 7 || val == 8 || val == 10 || val == 12) {
        if (day > 31) {
          day = 31
        }
      } else if (val == 4 || val == 6 || val == 9 || val == 11) {
        if (day > 30) {
          day = 30
        }
      } else if (val == 2) {
        let year = new Date().getFullYear()
        if (day > 28) {
          day = year % 4 == 0 ? 29 : 28
        }
      }
      return `${year}-${val}-${day}`
    },
    // 计算天数
    getDayFn(startTime, endTime) {
      if (startTime != "" && endTime != "") {// 2021-01-01 
        return ((new Date(this.formatterTime(endTime)).getTime()) - (new Date(this.formatterTime(startTime)).getTime())) / (24 * 60 * 60 * 1000)
      }
    },
    // 选择商户类型 变化后清空商位数据
    typeChange(val, index) {
      // console.log(val);
      let _this = this
      this.$set(_this.form[index], 'locationNumber', "")
      this.arrayList[index].optionsTwo = []
      if (val != "" && this.form[index].location.floor != "") {
        getSw({ leaseType: val, floormanage: this.form[index].location.floor }).then(res => {
          _this.arrayList[index].optionsTwo = res.data
        })
      }
      if (val === 1) {
        this.$set(_this.form[index], 'merchantName', this.$route.query.merchantName)
      } else {
        this.$set(_this.form[index], 'merchantName', "")
      }
    },
    // 区域监控
    areaChange(val, index) {
      let _this = this
      this.arrayList[index].optionsTwo = []
      this.arrayList[index].pzTwoList = []
      this.$set(_this.form[index].location, 'building', "")
      this.$set(_this.form[index].location, 'floor', "")
      this.$set(_this.form[index], 'locationNumber', "")
      if (val != "") {
        getBuilding({ pageNum: 'all', area_manage: val }).then(res => {
          _this.arrayList[index].pzTwoList = res.data.map(item => {
            return {
              label: item.building_name,
              value: item.id
            }
          })
        })
      }
    },
    // 建筑监控
    floorChange(val, index) {
      let _this = this
      this.arrayList[index].optionsTwo = []
      this.arrayList[index].pzThreeList = []
      this.$set(_this.form[index].location, 'floor', "")
      this.$set(_this.form[index], 'locationNumber', "")
      if (val != "") {
        getFloor({ pageNum: 'all', building_manage: val }).then(res => {
          _this.arrayList[index].pzThreeList = res.data.map(item => {
            return {
              label: item.order_num,
              value: item.id
            }
          })
        })
      }
    },
    // 楼层监控  
    swChange(val, index) {
      let _this = this
      this.arrayList[index].optionsTwo = []
      this.$set(_this.form[index], 'locationNumber', "")
      if (val != "" && this.form[index].leaseType != "") {
        getSw({ leaseType: this.form[index].leaseType, floormanage: val }).then(res => {
          _this.arrayList[index].optionsTwo = res.data
        })
      }
    },
    // 监控商位号的变化  
    // 1代表有数据  2代表无数据 
    changeShow(val) {
      let _this = this
      // console.log(val);
      // 获取面积
      let area = this.arrayList[this.tagsActive].optionsTwo.find(item => {
        return item.locationId == val
      })
      // console.log(area);
      if (area) {
        this.form[this.tagsActive].proportion = area.proportion
      } else {
        this.form[this.tagsActive].proportion = ""
        return //无商位数据则停止调用以下接口
      }

      //查询是否有商位规则
      let obj = {
        leaseType: this.form[this.tagsActive].leaseType,
        locationId: val
      }
      _this.loading = true
      getDataInfo(obj).then(res => {
        // console.log(res)
        // 租金
        if (res.data.rent_rule == "") {//无数据
          this.form[this.tagsActive].isShow = 2
        } else {
          this.form[this.tagsActive].isShow = 1
          this.form[this.tagsActive].earnestMoney = res.data.rent_rule.earnestMoney
          this.arrayList[this.tagsActive].paymentList = res.data.rent_rule.payment
        }
        // 水费
        this.form[this.tagsActive].waterRate.waterPrice.money = res.data.water_price
        // 电费
        this.form[this.tagsActive].powerRate.powerPrice.money = res.data.power_price
      }).finally(_ => {
        _this.loading = false
      })

    },
    // 提交
    submit() {
      let _this = this
      this.$refs.form.validate(function (valid) {
        if (valid) {

          _this.$confirm("确认提交吗?", '提示', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            _this.loading = true
            let data = JSON.parse(JSON.stringify(_this.form))
            data.map(item => {
              if (item.payType.type == 2) {
                if (item.paymentScheme.time == 'year') {
                  item.payType.time = `${item.payType.zjSixTwo}-${item.payType.zjSix}`
                } else if (item.paymentScheme.time == 'month') {
                  item.payType.time = item.payType.zjSix
                } else {
                  item.payType.time = 0
                }

              }
              if (item.payType.type == 1) {
                item.payType.time = item.startTime
              }
              // 删除临时存储字段
              delete item.payType.zjSix
              delete item.payType.zjSixTwo
              delete item.zjSeven
              delete item.isShow
              delete item.radioCustom
              delete item.paymentSchemeCustom  //删除后控制台可能报错 对保存结果无影响
            })
            // console.log(_this.form);
            let obj = {
              leaseApply: {
                merchantId: _this.$route.query.id,
                leaseInfo: data
              }
            }
            // console.log(obj);
            submitRequest(obj).then(res => {
              if (res.code == "200") {
                _this.loading = false

                _this.$message.success("操作成功!")
                _this.cancelFun()
              } else {
                _this.loading = false

                _this.$message.success("操作失败!")

              }
            }).catch(() => {
              _this.loading = false

              _this.$message.success("操作失败!")
            }).finally(_ => {
              _this.loading = false

            })
          })

        }
      })
    },
    // 取消
    cancelFun() {
      let query = this.$route.query
      this.$closePage(`/leaseManage/${query.type}`, query)
    },
    // 删除商位
    handleClose(tagIndex) {
      this.$confirm('确定删除此商户吗?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.arrayList.splice(tagIndex, 1)//同时删除接口请求存储的数据

        this.dynamicTags.splice(tagIndex, 1);
        this.form.splice(tagIndex, 1)
        this.tagsActive = this.dynamicTags.length - 1
      }).catch(() => { })
    },
    // 切换商位
    handleClick(tagIndex) {
      let _this = this
      // 表单必填信息填写完整才允许切换
      this.$refs.form.validate(function (valid) {
        if (valid) {
          _this.tagsActive = tagIndex
        } else {
          _this.$alert('请将此商位必填信息填写完整');

        }
      })
    },
    // 添加商位
    addTags() {
      let _this = this
      // 表单必填信息填写完整才允许添加
      let flag = false
      if (this.dynamicTags.length == 0) {
        flag = true
      }
      this.$refs.form.validate(function (valid) {
        if (valid) {
          flag = true
        } else {
          _this.$alert('请将此商位必填信息填写完整');
        }
      })
      if (flag) {
        // 存储接口动态数据，防止商位切换时数据错乱
        this.arrayList.push({
          pzTwoList: [],
          pzThreeList: [],
          optionsTwo: [],

          // 支付方案存储  接口有数据的情况
          paymentList: [

          ]
        })
        // 添加数据
        this.num += 1
        this.dynamicTags.push(`商位${this.num}`)
        this.form.push({
          leaseType: "",
          locationNumber: "",
          proportion: "",
          merchantName: "",
          startTime: "",
          stopTime: "",
          location: {
            area: "",
            building: "",
            floor: ""
          },

          isShow: 2,//是否有规则数据

          //start 存储商户有数据时的单选框值
          radioCustom: 999999,
          paymentSchemeCustom: { //直接赋值给下方paymentScheme
            period: "",
            time: "year",
            money: ""
          },
          // end

          paymentScheme: {
            period: "",
            time: "year",
            money: ""
          },
          payType: {
            type: 1,
            time: "",
            zjSix: '',//临时存储
            zjSixTwo: '',//临时存储
          },

          zjSeven: '',//页面数据展示
          firstPayPrice: '',
          earnestMoney: '',
          remindTime: {
            status: "",
            day: "",
            time: ""
          },
          // autoFeeDeduction: '',

          waterRate: {
            waterPrice: {
              money: ""
            },
            /* reminderTime: {
              sumLess: "",
              status: ""
            },
            autoRecharge: {
              sumLess: "",
              recharge: "",
              status: ""
            } */
          },

          powerRate: {
            powerPrice: {
              money: ""
            },
            /* reminderTime: {
              sumLess: "",
              status: ""
            },
            autoRecharge: {
              sumLess: "",
              recharge: "",
              status: ""
            } */
          },

          /* otherRate: [
            {
              wsfFive: "",//页面数据展示
              costType: "卫生费",
              chargeCycle: {
                period: "",
                time: ""
              },
              charge: "",
              payType: 2,
              firstPayPrice: "",
              remindTime: {
                status: "",
                day: "",
                time: ""
              },
              autoFeeDeduction: ""
            },
            {
              costType: "物业费",
              chargeCycle: {
                period: "",
                time: ""
              },
              charge: "",
              payType: 2,
              firstPayPrice: "",
              remindTime: {
                status: "",
                day: "",
                time: ""
              },
              autoFeeDeduction: ""
            },
          ], */

        })
        this.tagsActive = this.form.length - 1
      }



    },
  }

}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number {
  width: 92px;
}
.addClass {
  margin-right: 15px;
}
.btn {
  text-align: center;
}

.tags-list {
  margin: 20px 0;
  display: inline-block;
  box-sizing: border-box;
  padding: 6px 8px;
  border: 1px solid #d0d0d3;
  width: 600px;
  ::v-deep .el-tag {
    cursor: pointer;
  }
  ::v-deep .el-tag + .el-tag {
    margin-left: 10px;
  }
}
.lease {
  .text {
    margin: 0 5px;
  }
  ::v-deep .el-input {
    width: 440px;
  }
  ::v-deep .el-select + .el-select {
    margin-left: 10px;
  }
  .select-more {
    display: flex;
    > div:not(:first-child) {
      margin-left: 10px;
    }

    ::v-deep .el-select .el-input {
      width: 140px;
    }
    ::v-deep .el-input {
      width: 140px;
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
        width: 100px;
      }
      ::v-deep .el-select .el-input {
        width: 70px;
        margin: 0 15px;
      }
      ::v-deep .el-form-item.is-error .el-input__inner {
        border-color: #dcdfe6;
      }
    }
  }
  .zj-radio {
    // display: flex;
    // align-items: center;
    ::v-deep .el-input {
      width: 90px;
    }
    ::v-deep .el-select .el-input {
      width: 64px;
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