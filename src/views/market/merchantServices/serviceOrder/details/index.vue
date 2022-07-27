<template>
  <div class="app-container">
    <div v-loading="loading">
      <el-form ref="form" :model="ruleForm" label-width="100px">
        <div class="steps-box">
          <div class="step-title">
            <div class="orderInfo">订单信息:</div>
            <el-tag :type="ruleForm.orderStatus == 3 ? 'success' : 'warning'">
              {{
                formaterVal(ruleForm.orderStatus)
              }}
            </el-tag>
            <div>{{ ruleForm.orderNum }}</div>
          </div>
          <el-steps :active="ruleForm.orderStatus">
            <el-step title="下单时间">
              <template slot="description">
                {{ ruleForm.orderTime }}
                <div>
                  <div class="step-label">预约时间</div>
                  <div>{{ ruleForm.appointmentTime }}</div>
                </div>
              </template>
            </el-step>
            <el-step title="车俩到达时间" :description="ruleForm.carArrivalTime"></el-step>
            <el-step title="服务开始时间" :description="ruleForm.startTime"></el-step>
            <el-step title="服务完成时间" :description="ruleForm.finishTime"></el-step>
          </el-steps>
        </div>

        <div class="middle-box">
          <el-descriptions labelClassName="labelClassName" :column="1" :colon="true">
            <el-descriptions-item label="服务类型">
              <el-tag size="medium" v-for="(item,index) in typeList" :key="index">{{ item }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="商品">
              <el-tag size="medium" v-for="(item,index) in nameList" :key="index">{{ item }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <div class="title">订单金额:</div>
          <el-form-item label="订单总额:">
            <el-descriptions direction="vertical" :column="3" border>
              <el-descriptions-item label="服务类型">{{ typeList.join(',') }}</el-descriptions-item>
              <el-descriptions-item label="打赏费">{{ ruleForm.rewardFee }}</el-descriptions-item>
              <el-descriptions-item label="总计">{{ ruleForm.orderTotal }}</el-descriptions-item>
            </el-descriptions>
          </el-form-item>
          <el-form-item label="服务费用明细:">
            <el-table :data="tableData" style="width: 100%" show-summary>
              <el-table-column align="center" prop="goodsName" label="商品"></el-table-column>
              <el-table-column align="center" label="重量" prop="goodsWeight"></el-table-column>
              <el-table-column
                align="center"
                :label="o.serverName"
                v-for="(o,index) in tableheader"
                :key="index"
              >
                <el-table-column align="center" label="单价">
                  <template
                    slot-scope="scope"
                  >{{ formatterWeigth(scope.row.servicesType, o.serverID, 'price') }}</template>
                </el-table-column>
                <el-table-column align="center" label="金额">
                  <template
                    slot-scope="scope"
                  >{{ formatterWeigth(scope.row.servicesType, o.serverID, 'money') }}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="合计金额(元)" prop="total"></el-table-column>
            </el-table>
          </el-form-item>
          <el-descriptions title="客户信息:" :column="3">
            <el-descriptions-item label="商家名称">{{ ruleForm.merchantName }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ ruleForm.contacts }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ ruleForm.contactWay }}</el-descriptions-item>
            <el-descriptions-item label="服务地点" :span="3">{{ ruleForm.serviceLocation }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="3">{{ ruleForm.orderRemark }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getInfo,
} from "@/request/api/market/merchantServices/serviceOrder";
export default {
  name: "repairsOrderDetails",
  data() {
    return {
      loading: false,
      ruleForm: {
      },
      tableData: [
        

      ],
      rules: {
        repairer: [
          { required: true, message: "请输入维修人", trigger: "blur" },
        ],
        repair_phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        result: [
          { required: true, message: "请输入故障原因", trigger: "blur" },
        ],
      },
      pageType: "",
      id: "",
      typeList: [],
      nameList: [],
      tableheader:[]
    };
  },
  created() {
    let { params, query } = this.$route;
    this.pageType = params.type;
    this.id = query.id;
    this.getInfo();
  },
  methods: {
    formatterWeigth(row,id,key){
      let item = row.find(item => item.serverID == id)
      return item ? `${item[key]}${key == 'price' ? '元/吨' : '元'}` : '-'
    },
    // 根据id获取数据
    getInfo() {
      const self = this,
        loading = this.$load();
      getInfo(this.id)
        .then((response) => {
          self.ruleForm = response.data;
          self.tableData = response.data.goodsInfo
          self.tableheader = response.data.tableheader
          let listTwo = (response.data.goodsInfo).map(item => {
            return item.goodsName
          })
          self.nameList =listTwo.flat(Infinity)
          let list = (response.data.goodsInfo).map(item => {
            let aa = item.servicesType.map(v => {
              return v.name
            })
            return aa
          })
          let arr = [...new Set(list.flat(Infinity))]
          self.typeList = arr
        })
        .finally((error) => {
          self.$nextTick(() => {
            loading.close();
          });
        });
    },
    formaterVal(v) {
      if (v) {
        let list = ['', '待完成', '进行中', '已完成', '已取消']
        return list[v]
      } else {
        return '待完成'
      }

    }
  },
};
</script>

<style scoped lang="scss">
.app-container {
  .steps-box {
    width: 70%;
    height: auto;
    .step-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .orderInfo {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin-right: 10px;
      }
    }

    .step-label {
      font-size: 16px;
      line-height: 38px;
    }
  }
  .middle-box {
    margin: 20px 0;

    ::v-deep .labelClassName {
      width: 62px;
      display: flex;
      justify-content: flex-end;
    }
    ::v-deep .el-tag + .el-tag {
      margin-left: 10px;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>

