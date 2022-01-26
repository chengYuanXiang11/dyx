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
              <el-descriptions-item label="服务类型">{{typeList.join(',')}}</el-descriptions-item>
              <el-descriptions-item label="打赏费">{{ruleForm.rewardFee}}</el-descriptions-item>
              <el-descriptions-item label="总计">{{ruleForm.orderTotal}}</el-descriptions-item>
            </el-descriptions>
          </el-form-item>
          <el-form-item label="服务费用明细:">
            <el-table :data="tableData" stripe border show-summary :summary-method="getSummaries" :show-header="false" :span-method="spanMethod">
              <el-table-column prop="id" label="服务/商品" width="180"></el-table-column>
              <el-table-column prop="name" label="葡萄"></el-table-column>
              <el-table-column prop="amount1" label="重量(吨)"></el-table-column>
              <el-table-column prop="amount2" label="柚子"></el-table-column>
              <el-table-column prop="amount3" label="重量(吨)"></el-table-column>
              <el-table-column prop="amount3" label="香蕉"></el-table-column>
              <el-table-column prop="amount3" label="重量(吨)"></el-table-column>
              <el-table-column prop="amount3" label="合计金额(元)"></el-table-column>
            </el-table>
          </el-form-item>
          <el-descriptions title="客户信息:" :column="3">
            <el-descriptions-item label="商家名称">{{ruleForm.merchantName}}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ruleForm.contacts}}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ruleForm.contactWay}}</el-descriptions-item>
            <el-descriptions-item label="服务地点" :span="3">{{ruleForm.serviceLocation}}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="3">{{ruleForm.orderRemark}}</el-descriptions-item>
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
      tableData: [{
        id: '12987122',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '12987123',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987124',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '12987125',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }],
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

    };
  },
  created() {
    let { params, query } = this.$route;
    this.pageType = params.type;
    this.id = query.id;
    this.getInfo();
  },
  methods: {
    spanMethod({row,column,rowIndex,columnIndex}){
      if(columnIndex==0){
        return {
          rowspan:1,
        }
      }

    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // if (index === 0) {
        //   sums[index] = '总价';
        //   return;
        // }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value)) && index == 7) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += ' 元';
          sums[index] = '总计:' + sums[index] + ' 元';
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    // 根据id获取数据
    getInfo() {
      const self = this,
        loading = this.$load();
      getInfo(this.id)
        .then((response) => {
          self.ruleForm = response.data;
          console.log(JSON.parse(response.data.goodsInfo));
          let listTwo = (JSON.parse(response.data.goodsInfo)).map(item => {
            return item.goodsName
          })
          self.nameList = listTwo.flat(Infinity)
          let list = (JSON.parse(response.data.goodsInfo)).map(item => {
            let aa = item.servicesType.map(v => {
              return v.name
            })
            return aa
          })
          self.typeList = list.flat(Infinity)
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

