<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="110px">
      <h5>租赁信息</h5>
      <el-form-item label="租赁类型" prop="leaseType" :rules="rules">
        <el-select v-model="form.leaseType" placeholder="请选择租赁类型" @change="typeChange">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in options"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="位置" :rules="rules">
        <div class="select-more">
          <el-form-item label-width="0" prop="location.area" :rules="rules">
            <el-select
              v-model="form.location.area"
              placeholder="请选择区域"
              filterable
              clearable
              @change="areaChange"
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
              v-model="form.location.building"
              placeholder="请选择建筑"
              filterable
              clearable
              @change="floorChange"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in pzTwoList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0" prop="location.floor" :rules="rules">
            <el-select
              v-model="form.location.floor"
              placeholder="请选择楼层"
              filterable
              clearable
              @change="swChange"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in pzThreeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="商位号" prop="locationNumber" :rules="rules">
        <el-select
          v-model="form.locationNumber"
          placeholder="请选择商位号"
          @change="swInfo"
          filterable
          clearable
        >
          <el-option
            :label="item.locationName"
            :value="item.locationId"
            v-for="(item,index) in optionsTwo"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商户名称">
        <el-input v-model="form.storeName" disabled></el-input>
      </el-form-item>
      <el-form-item label="商户姓名">
        <el-input v-model="form.merchantName" disabled></el-input>
      </el-form-item>
      <el-form-item label="商户电话">
        <el-input v-model="form.mobile" disabled></el-input>
      </el-form-item>

      <h5>退租信息</h5>
      <el-descriptions :column="6" border direction="vertical">
        <el-descriptions-item label="商位号">{{ form.throwLeaseInfo.locationNumber }}</el-descriptions-item>
        <el-descriptions-item label="租赁类型">{{ form.throwLeaseInfo.leaseType }}</el-descriptions-item>
        <el-descriptions-item label="面积(㎡)">{{ form.proportion }}</el-descriptions-item>
        <el-descriptions-item label="位置">{{ form.throwLeaseInfo.location }}</el-descriptions-item>
        <el-descriptions-item label="合同起止时间">{{ form.throwLeaseInfo.contractPeriod }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ form.throwLeaseInfo.leaseStatus }}</el-descriptions-item>
      </el-descriptions>
      <el-form-item label="退租类型" prop="throwLeaseType" :required="true">
        <div class="customized">
          <el-radio-group v-model="form.throwLeaseType" @change="throwLeaseTypeChange">
            <el-radio :label="1">合同范围内退租</el-radio>
            <el-radio :label="2">违约退租</el-radio>
            <el-radio :label="3">其他情况</el-radio>
          </el-radio-group>
          <el-form-item
            label-width="5px"
            prop="radioOther"
            :rules="form.throwLeaseType == 3 ? rulesBlur : []"
          >
            <el-input v-model="form.radioOther" placeholder="选择其他情况时必填"></el-input>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="装修情况" :required="true">
        <span class="customized">
          <el-form-item prop="decorateSituation.decorate" :rules="rules">
            <el-checkbox-group v-model="form.decorateSituation.decorate">
              <el-checkbox :label="1" name="type">墙面</el-checkbox>
              <el-checkbox :label="2" name="type">卫生间</el-checkbox>
              <el-checkbox :label="3" name="type">门窗</el-checkbox>
              <el-checkbox :label="4" name="type" @change="other">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label-width="5px"
            prop="decorateSituation.otherdecorate"
            :rules="isOther ? rules : []"
          >
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
      <el-form-item label="经手人" prop="managers" :rules="rules">
        <el-input v-model="form.managers" disabled>
          <el-button type="primary" slot="append" @click="selectUsers">选择人员</el-button>
        </el-input>
      </el-form-item>

      <el-form-item label-width="0">
        <div style="text-align:center">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>

    <SelectUsersDialog
      :visible.sync="showDialog"
      :data="datas"
      model="user"
      :multiple="false"
      placeholder="请选择人员"
      @confirm="getDatas"
    ></SelectUsersDialog>
  </div>
</template>

<script>
import {
  getArea,
  getBuilding,
  getFloor,
  getSw,
  submitRequest,
  getSwInfo
} from "@/request/api/market/merchantsMgmt/throwAlease";
export default {
  name: "throwAleaseAdd",
  data() {
    return {
      showDialog: false,
      datas: {},
      form: {
        leaseType: "",
        location: {
          area: "",
          building: "",
          floor: ""
        },
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
        proportion:"",


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
      rules: [
        { required: true, message: '不能为空', trigger: 'change' },
      ],
      rulesBlur: [
        { required: true, message: '不能为空', trigger: 'change' },
      ],
      pzOneList: [],
      pzTwoList: [],
      pzThreeList: [],
      isOther: false,
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
  methods: {
    selectUsers() {
      this.showDialog = true;
    },
    getDatas(e, close) {
      close();
      console.log(e);
      this.form.managers = e.user_name
      this.user_id = e.user_id
    },
    submit() {
      let _this = this
      this.$refs.form.validate(valid => {
        if (valid) {
          _this.$confirm("是否确认提交?", '提示', {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(_ => {
            _this.form.managers = _this.user_id
            if (_this.form.throwLeaseType == 3) {
              _this.form.throwLeaseType = _this.form.radioOther
            }
            delete _this.form.radioOther
            // console.log(_this.form);
            submitRequest(_this.form).then(res => {
              if (res.code == 200) {
                _this.$toast("提交成功")
                _this.closePage()
              }
            })
          })
        }
      })
    },
    cancel() {
      this.closePage()
    },
    throwLeaseTypeChange(val) {
      if (val != 3) {
        this.$refs.form.clearValidate('radioOther')
      }
    },
    other(val) {
      console.log(val);
      this.isOther = val
      if (!val) {
        this.$refs.form.clearValidate('decorateSituation.otherdecorate')
      }
    },

    // 选择商户类型 变化后清空商位数据
    typeChange(val) {
      let _this = this
      this.$set(_this.form, 'locationNumber', "")
      this.optionsTwo = []
      if (val != "" && this.form.location.floor != "") {
        getSw({ leaseType: val, floormanage: this.form.location.floor }).then(res => {
          _this.optionsTwo = res.data
        })
      }
    },
    // 区域监控
    areaChange(val) {
      let _this = this
      this.optionsTwo = []
      this.pzTwoList = []
      this.$set(_this.form.location, 'building', "")
      this.$set(_this.form.location, 'floor', "")
      this.$set(_this.form, 'locationNumber', "")
      if (val != "") {
        getBuilding({ pageNum: 'all', area_manage: val }).then(res => {
          _this.pzTwoList = res.data.map(item => {
            return {
              label: item.building_name,
              value: item.id
            }
          })
        })
      }
    },
    // 建筑监控
    floorChange(val) {
      let _this = this
      this.optionsTwo = []
      this.pzThreeList = []
      this.$set(_this.form.location, 'floor', "")
      this.$set(_this.form, 'locationNumber', "")
      if (val != "") {
        getFloor({ pageNum: 'all', building_manage: val }).then(res => {
          _this.pzThreeList = res.data.map(item => {
            return {
              label: item.order_num,
              value: item.id
            }
          })
        })
      }
    },
    // 楼层监控  
    swChange(val) {
      let _this = this
      this.optionsTwo = []
      this.$set(_this.form, 'locationNumber', "")
      if (val != "" && this.form.leaseType != "") {
        getSw({ leaseType: this.form.leaseType, floormanage: val }).then(res => {
          _this.optionsTwo = res.data
        })
      }
    },
    // 获取商位信息，财务信息
    swInfo(val) {
      let _this = this
      if (val != "" && this.form.leaseType != "") {
        getSwInfo({ leaseType: this.form.leaseType, locationId: val }).then(res => {
          // console.log(res);
          if (res.data.length > 0) {
            _this.form.proportion = res.data[0].proportion
            _this.form.merchantName = res.data[0].merchantName
            _this.form.mobile = res.data[0].mobile
            _this.form.storeName = res.data[0].storeName
            _this.form.financeInfo.accountBlc = res.data[0].financeInfo.accountBlc
            _this.form.financeInfo.earnestMoney = res.data[0].financeInfo.earnestMoney
            _this.form.financeInfo.pwRateBlc = res.data[0].financeInfo.pwRateBlc
            _this.form.financeInfo.wtRateBlc = res.data[0].financeInfo.wtRateBlc
            _this.form.throwLeaseInfo.contractPeriod = res.data[0].throwLeaseInfo.contractPeriod
            _this.form.throwLeaseInfo.leaseStatus = res.data[0].throwLeaseInfo.leaseStatus
            _this.form.throwLeaseInfo.leaseType = res.data[0].throwLeaseInfo.leaseType
            _this.form.throwLeaseInfo.location = res.data[0].throwLeaseInfo.location
            _this.form.throwLeaseInfo.locationNumber = res.data[0].throwLeaseInfo.locationNumber
          }

        })
      }
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