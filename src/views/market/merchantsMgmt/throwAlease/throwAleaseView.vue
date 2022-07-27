<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="110px" disabled>
      <h5>租赁信息</h5>
      <el-descriptions :column="1">
        <el-descriptions-item label="退租商位">{{ form.locationNumber }}</el-descriptions-item>
        <el-descriptions-item label="商户名称">{{ form.storeName }}</el-descriptions-item>
        <el-descriptions-item label="商户姓名">{{ form.merchantName }}</el-descriptions-item>
        <el-descriptions-item label="商户电话">{{ form.mobile }}</el-descriptions-item>
      </el-descriptions>

      <h5>退租信息</h5>
      <el-descriptions :column="5" border direction="vertical">
        <el-descriptions-item label="商位号">{{ form.throwLeaseInfo.locationNumber }}</el-descriptions-item>
        <el-descriptions-item label="租赁类型">{{ form.throwLeaseInfo.leaseType }}</el-descriptions-item>
        <el-descriptions-item label="位置">{{ form.throwLeaseInfo.location }}</el-descriptions-item>
        <el-descriptions-item label="合同起止时间">{{ form.throwLeaseInfo.contractPeriod }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ form.throwLeaseInfo.leaseStatus }}</el-descriptions-item>
      </el-descriptions>
      <el-form-item label="退租类型" prop="throwLeaseType" :required="true">
        <div class="customized">
          <el-radio-group v-model="form.throwLeaseType">
            <el-radio :label="1">合同范围内退租</el-radio>
            <el-radio :label="2">违约退租</el-radio>
            <el-radio :label="3">其他情况</el-radio>
          </el-radio-group>
          <el-form-item label-width="5px" prop="radioOther">
            <el-input v-model="form.radioOther" placeholder="选择其他情况时必填"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="装修情况" :required="true">
        <span class="customized">
          <el-form-item prop="decorateSituation.decorate">
            <el-checkbox-group v-model="form.decorateSituation.decorate">
              <el-checkbox :label="1" name="type">墙面</el-checkbox>
              <el-checkbox :label="2" name="type">卫生间</el-checkbox>
              <el-checkbox :label="3" name="type">门窗</el-checkbox>
              <el-checkbox :label="4" name="type">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label-width="5px" prop="decorateSituation.otherdecorate">
            <el-input v-model="form.decorateSituation.otherdecorate" placeholder="选择其他时必填"></el-input>
          </el-form-item>
        </span>
      </el-form-item>
      <el-form-item label="物品检查交接" :required="true">
        <el-form-item label="装修恢复">
          <el-radio-group v-model="form.decorateRecovery">
            <el-radio :label="1">已恢复</el-radio>
            <el-radio :label="2">保持现状</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="钥匙归还">
          <el-radio-group v-model="form.returnKey">
            <el-radio :label="1">已归还</el-radio>
            <el-radio :label="2">未归还</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房屋状况">
          <el-radio-group v-model="form.houseStatus">
            <el-radio :label="1">完好</el-radio>
            <el-radio :label="2">损坏</el-radio>
          </el-radio-group>
          <span class="tips">(顶面、墙体、门窗、水电设施、室内设备用品、楼梯、消防设施等)</span>
        </el-form-item>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.goodsRemark" type="textarea" :rows="2"></el-input>
      </el-form-item>

      <h5>财务信息</h5>
      <el-descriptions :column="5" border direction="vertical">
        <el-descriptions-item label="水费余额">{{ form.financeInfo.wtRateBlc }}</el-descriptions-item>
        <el-descriptions-item label="电费余额">{{ form.financeInfo.pwRateBlc }}</el-descriptions-item>
        <el-descriptions-item label="账户余额">{{ form.financeInfo.accountBlc }}</el-descriptions-item>
        <el-descriptions-item label="保证金">{{ form.financeInfo.earnestMoney }}</el-descriptions-item>
      </el-descriptions>
      <el-form-item label="备注">
        <el-input v-model="form.allRemark" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="经手人" prop="managers">
        <el-input v-model="form.managers" disabled></el-input>
      </el-form-item>

      <el-form-item label-width="0">
        <div style="text-align:center">
          <!-- <el-button @click="cancel">取消</el-button> -->
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getInfo
} from "@/request/api/market/merchantsMgmt/throwAlease";
export default {
  data() {
    return {
      showDialog: false,
      datas: {},
      form: {
        locationNumber: "",
        throwLeaseType: 1,
        decorateSituation: {
          decorate: [],
          otherdecorate: ""
        },
        decorateRecovery: 1,
        storeName: "",
        merchantName: "",
        mobile: "",
        returnKey: 1,
        houseStatus: 1,
        goodsRemark: "",
        allRemark: "",
        managers: "",
        financeInfo: {
          wtRateBlc: "",
          pwRateBlc: "",
          pwRateBlc: "",
          earnestMoney: ""
        },
        throwLeaseInfo: {
          contractPeriod: "",
          leaseStatus: "",
          leaseType: "",
          location: "",
          locationNumber: ""
        },

        radioOther: "",//临时存储退租类型其他情况

      },
      user_id: "",
      options: [
        { label: "商铺", value: 1 },
        { label: "宿舍", value: 2 },
        { label: "仓库", value: 3 },
      ],
      optionsTwo: [

      ],

    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    cancel() {
      this.closePage()
    },
    getInfo() {
      let _this = this
      getInfo(this.$route.query.id).then(res => {
        _this.form = res.data
        _this.form.locationNumber = res.data.locationNumber
        _this.form.throwLeaseInfo.locationNumber = res.data.throwLeaseInfo.locationNumber
        if (res.data.throwLeaseType == 1 || res.data.throwLeaseType == 2) {
          _this.form.throwLeaseType = Number(res.data.throwLeaseType)
        } else {
          _this.form.radioOther = res.data.throwLeaseType
          _this.form.throwLeaseType = 3
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions {
  width: 60%;
}
.tips {
  font-size: 12px;
  color: #333;
  margin-left: 15px;
}
::v-deep .el-descriptions {
  margin-bottom: 15px;
}
.customized {
  display: flex;
  align-items: center;

  ::v-deep .el-input {
    width: 300px;
  }
}
h5 {
  margin-bottom: 15px;
}
::v-deep .el-select .el-input {
  width: 440px;
}
::v-deep .el-input,
::v-deep .el-textarea {
  width: 440px;
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
</style>