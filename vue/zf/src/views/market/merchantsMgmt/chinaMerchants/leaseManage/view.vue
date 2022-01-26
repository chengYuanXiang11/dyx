<template>
  <FormPage
    @cancel="cancel"
    @submit="saveForm"
    submitBtnText="确定"
    cancelBtnText="取消"
    :loading="loading"
    :showSubmitBtn="($route.query.type == 'enterUpload' || $route.query.type == 'contract') ? true : false"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="租赁申请">
        <el-tag
          :type="statusFormatter(form.leaseStatus)"
        >{{ leaseStatusFormatter(form.leaseStatus) }}</el-tag>
      </el-form-item>
      <el-form-item label-width="0">
        <el-descriptions title="商户信息:" :column="3">
          <el-descriptions-item label="商户性质">{{ form.merchantInfo.merchantsType }}</el-descriptions-item>
          <el-descriptions-item label="商户名称">{{ form.merchantInfo.storeName }}</el-descriptions-item>
          <el-descriptions-item label="经营品种">{{ form.merchantInfo.saleCategory.join() }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ form.merchantInfo.merchantName }}</el-descriptions-item>
          <el-descriptions-item label="身份证号码">{{ form.merchantInfo.idCardNum }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ form.merchantInfo.mobile }}</el-descriptions-item>
          <el-descriptions-item label="招商经理">{{ form.merchantInfo.leasingManager }}</el-descriptions-item>
        </el-descriptions>
      </el-form-item>
      <el-form-item label-width="0">
        <el-descriptions title="账户设置:" :column="1" :colon="false">
          <el-descriptions-item label>
            <span v-if="form.merchantInfo.arrearsSetting.arrearsMeasure.arrearsMeOpCl == 1">
              当账户余额为 {{ form.merchantInfo.arrearsSetting.arrearsMeasure.mainAccountCut }} 元时
              <span
                v-if="form.merchantInfo.arrearsSetting.arrearsMeasure.cutWater == 1"
              >停止供水</span>
              <span v-if="form.merchantInfo.arrearsSetting.arrearsMeasure.cutPower == 1"> 停止供电</span>
            </span>
            <span v-else>未开启</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-form-item>
      <h4>租赁信息</h4>
      <el-form-item label>
        <el-descriptions title="租赁" :column="3">
          <el-descriptions-item label="租赁类型">{{ leaseTypeFormatter(form.leaseType) }}</el-descriptions-item>
          <el-descriptions-item label="商位号">{{ form.locationName }}</el-descriptions-item>
          <el-descriptions-item label="商位名称">{{ form.merchantName }}</el-descriptions-item>
          <el-descriptions-item label="面积/容量(㎡)">{{ form.proportion }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ form.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ form.stopTime }}</el-descriptions-item>
        </el-descriptions>
        <h3>租金</h3>
        <el-descriptions title="支付方案:" :column="3">
          <el-descriptions-item label="支付金额周期">{{ paymentSchemeFormatter(form.paymentScheme) }}</el-descriptions-item>
          <el-descriptions-item label="租金缴费方式">{{ form.payType.type == 1 ? '按合同日期' : '按固定日期' }}</el-descriptions-item>
          <el-descriptions-item
            label="正常缴费时间"
          >{{ timeFormatter(form.payType.time, form.payType.type) }}</el-descriptions-item>
          <el-descriptions-item label="首次缴费金额">{{ form.firstPayPrice }}元</el-descriptions-item>
          <el-descriptions-item label="提醒时间">{{ remindTimeFormatter(form.remindTime) }}</el-descriptions-item>
          <el-descriptions-item label="保证金金额">{{ form.earnestMoney }}元</el-descriptions-item>
         <!--  <el-descriptions-item
            label="自动扣费"
            :span="2"
          >{{ form.autoFeeDeduction == 1 ? '到达缴费时间时,自动扣费' : '未开启' }}</el-descriptions-item> -->
        </el-descriptions>
        <el-descriptions title="水费" :column="1">
          <el-descriptions-item label="水费价格">每吨{{ form.waterRate.waterPrice.money }}元</el-descriptions-item>
          <!-- <el-descriptions-item label="提醒时间">
            <span
              v-if="form.waterRate.reminderTime.status == 1"
            >水卡余额低于{{ form.waterRate.reminderTime.sumLess }}元时，提醒负责人缴费</span>
            <span v-else>未开启</span>
          </el-descriptions-item>
          <el-descriptions-item label="自动充值">
            <span
              v-if="form.waterRate.autoRecharge.status == 1"
            >水卡余额低于{{ form.waterRate.autoRecharge.sumLess }}元时，自动充值{{ form.waterRate.autoRecharge.recharge }}元</span>
            <span v-else>未开启</span>
          </el-descriptions-item>-->
        </el-descriptions>
        <el-descriptions title="电费" :column="1">
          <el-descriptions-item label="电费价格">每KW/H {{ form.powerRate.powerPrice.money }}元</el-descriptions-item>
          <!-- <el-descriptions-item label="提醒时间">
            <span
              v-if="form.powerRate.reminderTime.status == 1"
            >电卡余额低于{{ form.powerRate.reminderTime.sumLess }}元时，提醒负责人缴费</span>
            <span v-else>未开启</span>
          </el-descriptions-item>
          <el-descriptions-item label="自动充值">
            <span
              v-if="form.powerRate.autoRecharge.status == 1"
            >电卡余额低于{{ form.powerRate.autoRecharge.sumLess }}元时，自动充值{{ form.powerRate.autoRecharge.recharge }}元</span>
            <span v-else>未开启</span>
          </el-descriptions-item>-->
        </el-descriptions>
        <!-- <el-descriptions
          :title="item.costType"
          :column="3"
          v-for="(item,index) in form.otherRate"
          :key="index"
        >
          <el-descriptions-item
            label="收费周期"
          >每{{ item.chargeCycle.period }} {{ otherTimeFor(item.chargeCycle.time) }}</el-descriptions-item>
          <el-descriptions-item label="收费金额">{{ item.charge }}元</el-descriptions-item>
          <el-descriptions-item label="缴费方式">{{ typeFormatter(item.payType) }}</el-descriptions-item>
          <el-descriptions-item label="正常缴费时间">每一个月的12日</el-descriptions-item>
          <el-descriptions-item label="首次缴费金额">{{ item.firstPayPrice }}元</el-descriptions-item>
          <el-descriptions-item label="提醒时间">
            <span
              v-if="item.remindTime.status == 1"
            >提前{{ item.remindTime.day }}天{{ item.remindTime.time }}点</span>
            <span v-else>未开启</span>
          </el-descriptions-item>
          <el-descriptions-item
            label="自动扣费"
          >{{ item.autoFeeDeduction == 1 ? '到达缴费时间时,自动扣费' : '未开启' }}</el-descriptions-item>
        </el-descriptions> -->
      </el-form-item>
      <el-form-item
        label="合同信息"
        v-if="$route.query.type == 'enterView' || $route.query.type == 'view'|| $route.query.type == 'merchantView'"
      >
        <el-descriptions :column="1">
          <el-descriptions-item label="合同">
            <span class="text">{{ formatterFile(imgList) }}</span>
            <!-- <el-link
              type="primary"
              :href="imgList.join() + '?response-content-type=application/octet-stream'"
              download
              v-if="imgList.length > 0"
            >下载</el-link>-->
            <el-link type="primary" v-if="imgList.length > 0" @click="downImg">下载</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="签约人">{{ contractPerson.name }}</el-descriptions-item>
        </el-descriptions>
      </el-form-item>

      <el-form-item
        label="合同信息"
        v-if="$route.query.type == 'enterUpload' || $route.query.type == 'contract'|| $route.query.type == 'merchantUpload'"
      >
        <Image-Upload v-model="imgList" :max="1"></Image-Upload>
      </el-form-item>
      <el-form-item
        label="签约人"
        v-if="$route.query.type == 'enterUpload' || $route.query.type == 'contract'|| $route.query.type == 'merchantUpload'"
      >
        <div style="width:400px">
          <SelectUsers v-model="datas" type="user" :multiple="false" placeholder="请选择人员"></SelectUsers>
        </div>
      </el-form-item>

      <!-- <el-form-item label-width="0">
        <div class="btn">
          <el-button type="primary" @click="saveForm" v-if="$route.query.type == 'enterUpload'">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>-->
    </el-form>
  </FormPage>
</template>

<script>
import { downImgBase64 } from "@/utils/isValid";
import {
  getView,
  getContract
} from "@/request/api/market/merchantsMgmt/leaseManageAdd";
export default {
  data() {
    return {
      loading: false,
      showDialog: false,
      datas: {},
      imgList: [
        // "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
      contractPerson: {
        id: "",
        name: ""
      },
      form: {
        merchantName: "",
        payType: {
          type: "",
          time: ""
        },
        waterRate: {
          waterPrice: {
            money: ""
          },
          /* reminderTime: {
            sumLess: ""
          },
          autoRecharge: {
            sumLess: ""
          } */
        },
        powerRate: {
          powerPrice: {
            money: ""
          },
          /* reminderTime: {
            sumLess: ""
          },
          autoRecharge: {
            sumLess: ""
          } */
        },
        merchantInfo: {
          merchantsType: "",
          saleCategory: [],
          arrearsSetting: {
            arrearsMeasure: {
              arrearsMeOpCl: "",
              mainAccountCut: "",
              cutWater: "",
              cutPower: ""
            }
          }
        },
        otherRate: [
          {
            chargeCycle: {
              period: ""
            },
            remindTime: {
              time: ""
            }
          }
        ]
      }
    }
  },
  created() {
    let _this = this
    getView(this.$route.query.id).then((result) => {
      _this.form = result.data
      _this.imgList = result.data.contractFile.split(',')
      _this.datas = {
        user_id: result.data.contractPerson.userId,
        user_name: result.data.contractPerson.userName
      }
      _this.contractPerson.name = result.data.contractPerson.userName

    }).catch((err) => {

    });
  },
  methods: {
    downImg() {
      let imgsrc = this.imgList.join()
      let name = this.formatterFile(this.imgList)
      downImgBase64(imgsrc, name);
    },
    formatterFile(val) {
      // console.log(val);
      if (val.length > 0) {
        let index = val.join().lastIndexOf('/')
        // console.log(val.join(),index);
        let name = val.join().substr(index + 1)
        // console.log(name);
        return name
      }
    },
    getDatas(e, close) {
      close()
      console.log(e);
      this.contractPerson.id = e.user_id
      this.contractPerson.name = e.user_name
    },
    saveForm() {
      let _this = this
      if (this.imgList.length == 0) {
        this.$error("请上传合同图片!")
        return false
      }
      let obj = {
        leaseId: this.$route.query.id,
        contractPerson: this.datas.user_id,
        contractFile: this.imgList.join(',')
      }
      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        getContract(obj).then(res => {
          if (res.code == '200') {
            _this.$success("操作成功!")
            _this.cancel()
          }
        })
      })

    },
    cancel() {
      let type = this.$route.query.type
      let query = this.$route.query.queryData
      if(type=='contract' || type=='view'){
        this.$closePage(`/leaseManage/${query.type}`,query)
      }else if(type=='enterView' || type == 'enterUpload'){
        this.$closePage(`/recordList`,query)
      }else if(type=='merchantView'||type=='merchantUpload'){
        this.$closePage(`/market/merchantsMgmt/enter`)
      }
      
    },
    otherTimeFor(val) {
      if (val == 'year') {
        return '年'
      } else if (val == 'month') {
        return '月'
      } else if (val == 'day') {
        return '日'
      } else {
        return val
      }
    },
    remindTimeFormatter(obj) {
      if (obj != undefined) {
        if (obj.status == 1) {
          let { day, time } = obj
          return `提前${day}天${time}点`
        } else {
          return '未开启'
        }

      }
    },
    paymentSchemeFormatter(obj) {
      if (obj != undefined) {
        let { money, period, time } = obj
        if (time == 'year') {
          return `每${period}年${money}元`
        } else if (time == 'month') {
          return `每${period}月${money}元`
        } else if (time == 'day') {
          return `每${period}日${money}元`
        }
      }

    },
    timeFormatter(val, type) {
      if (type == 1) {
        return this.form.startTime
      } else {
        let num = this.form.paymentScheme?this.form.paymentScheme.period:''
        if (val == 0) {
          return `每${num}日`
        } else {
          if (val.indexOf('-') == -1) {
            return `每${num}月${val}日`
          } else {
            return `每${num}年${val.split('-')[0]}月${val.split('-')[1]}日`
          }
        }
      }


    },
    typeFormatter(val) {
      if (val != undefined) {
        if (val == 1) {
          return '按合同日期'
        } else if (val == 2) {
          return '按固定日期'
        } else {
          return val
        }
      }
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
    statusFormatter(val) {
      if (val == '1' || val == '6') {
        return 'warning'
      } else if (val == '2') {
        return 'danger'
      } else if (val == '3' || val == '7') {
        return 'info'
      } else if (val == '4' || val == '5') {
        return 'success'
      }
    },
    leaseStatusFormatter(val) {
      if (val == 1) {
        return '审批中'
      } else if (val == 2) {
        return '已拒绝'
      } else if (val == 3) {
        return '已失效'
      } else if (val == 4) {
        return '已通过'
      } else if (val == 5) {
        return '待开始'
      } else if (val == 6) {
        return '合约中'
      } else if (val == 7) {
        return '已到期'
      } else {
        return val
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.text {
  margin-right: 10px;
}
.btn {
  text-align: center;
}
.el-tag + .el-tag {
  margin-left: 5px;
}

::v-deep .el-descriptions {
  margin-top: 20px;
}
::v-deep .el-descriptions__header {
  margin-bottom: 8px;
}
::v-deep .el-upload-list {
  width: 300px;
}
::v-deep .el-input {
  width: 300px;
}
</style>