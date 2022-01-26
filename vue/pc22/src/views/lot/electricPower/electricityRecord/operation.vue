<template>
  <Page>
    <div v-if="type == 'merchant'">
      <div class="search-box">
        <span class="title-month">商位信息:</span>
        <div class="tags-box">
          <div
            v-for="(item, index) in tagListMore"
            :key="index"
            :class="index == activeIndexMore ? 'active' : ''"
            @click="switchIndexMore(index)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="search-month" v-if="activeIndexMore == 0">
        <div class="title-month">商户总记录:</div>
        <div class="text-month">按月查询</div>
        <el-date-picker
          v-model="value1"
          type="month"
          placeholder="选择月"
          @change="monthChange"
        ></el-date-picker>
      </div>
    </div>

    <div v-if="isShow">
      <el-descriptions title="电表信息">
        <el-descriptions-item
          labelClassName="labelClassName"
          label="电表当前状态"
          >正常</el-descriptions-item
        >
        <el-descriptions-item
          labelClassName="labelClassName"
          label="电表当前数值"
          >352KW/h</el-descriptions-item
        >
        <el-descriptions-item labelClassName="labelClassName" label="刷新时间"
          >2022-01-30</el-descriptions-item
        >
      </el-descriptions>

      <div class="title">用电记录</div>
      <div class="search-box">
        <span class="text">查询:</span>
        <div class="tags-box">
          <div
            v-for="(item, index) in tagList"
            :key="index"
            :class="index == activeIndex ? 'active' : ''"
            @click="switchIndex(index)"
          >
            {{ item }}
          </div>
        </div>
        <div>
          <el-date-picker
            v-model="value2"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择年月日"
            @change="timeChange"
            v-if="activeIndex == 0"
          ></el-date-picker>

          <el-date-picker
            v-model="value2"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            @change="monthChange"
            v-if="activeIndex == 1"
          ></el-date-picker>

          <el-date-picker
            v-model="value2"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年"
            @change="yearChange"
            v-if="activeIndex == 2"
          ></el-date-picker>
        </div>
      </div>
      <div class="chart-box" id="chartId"></div>
    </div>
    <Table-page
      :page-size="query.pageSize"
      :total="query.total"
      :page-num="query.pageNum"
      @pagination="handlePagination"
    >
      <el-table v-loading="loading" :data="tableData" border height="100%">
        <el-table-column key="1" label="时间" prop="storeName" />
        <el-table-column
          key="2"
          label="上期抄表"
          prop="merchantName"
          v-if="isShow"
        />
        <el-table-column key="3" label="本期抄表" prop="mobile" v-if="isShow" />
        <el-table-column key="4" label="实用度数" prop="mobile" />
        <el-table-column key="5" label="应缴费用" prop="mobile" />
        <el-table-column key="6" label="实缴费用" prop="mobile" />
        <el-table-column
          key="7"
          label="扣费时间"
          prop="mobile"
          v-if="isShow && activeIndex == 0"
        />
      </el-table>
    </Table-page>
  </Page>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);
export default {
  data() {
    return {
      type: this.$route.query.type,
      loading: false,
      total: 0,
      tableData: [],
      query: {
        total: 10,
        pageNum: 1,
        pageSize: 20,
      },
      activeIndex: 0,
      tagList: ["按时段", "按天", "按月"],
      activeIndexMore: 0,
      tagListMore: ["总览", "D145", "D298"],
      value1: new Date(),
      value2:new Date(),
      isShow: false,
      myChart: null,
      xName: "小时",
      xData: [],
      yData: [],
      seriesData: [],
      time:'2021年12月09日',
      tooltipFormatter:null
    };
  },
  created() {
    // this.xData = []
    for (const key in [...Array(25).keys()]) {
      // this.xData.push(`${key < 10 ? 0 + key : key}` + ":00");
      this.xData.push(key)
    }
  },
  beforeMount() {
    let _this = this;
    if (this.type == "quotient") {
      _this.isShow = true;
      this.$nextTick(function () {
        _this.chart();
      });
    }
  },
  methods: {
    handlePagination(e) {
      this.query.pageNum = e.pageNum;
      this.getList();
    },
    switchIndex(index) {
      if(index !== this.activeIndex){
         this.activeIndex = index;
      this.value2 =new Date();
      this.getList()
      }
     
    },
    switchIndexMore(index) {
         if(index !== this.activeIndexMore){
      let _this = this;
      this.activeIndexMore = index;
      if (index != 0) {
        this.isShow = true;
        this.$nextTick(function () {
          _this.chart();
        });
      } else {
        this.isShow = false;
      }
      this.getList()
         }
    },
    timeChange(val) {
      console.log(val);
      this.getList();
    },
    monthChange(val) {
      console.log(val);
      this.getList();
    },
    yearChange(val) {
      console.log(val);
      this.getList();
    },
    getList(val) {
      this.loading = true;
      this.$success("触发请求");
      console.log(this.queryFormat(this.queryParams, this.query));
      this.loading = false;
    },
    chart() {
      // 初始化echars
      this.myChart = echarts.init(document.getElementById("chartId"));
      let option = {
        title: {
          text: "用电记录",
          top: "3%",
          left: "3%",
        },
        tooltip: {
          trigger: "axis",
           formatter: function(arg) {
                    return `${arg[0].seriesName}${arg[0].name}小时的用电量是:<br />${arg[0].data}度`
                }
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          name: this.xName,
          type: "category",
          boundaryGap: false, //坐标轴两边留白
          nameGap: 18,
          // data: this.xData,
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            //	margin:15,
            textStyle: {
              color: "#1B253A",
              fontStyle: "normal",
              fontFamily: "微软雅黑",
              fontSize: 12,
            },
          },
          nameTextStyle: {
            color: "#1B253A",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12,
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: true,
          },
          axisLine: {
            //坐标轴轴线相关设置
            lineStyle: {
              color: "#E5E9ED",
              // opacity:0.2
            },
          },
          splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            show: false,
            lineStyle: {
              color: "#E5E9ED",
              // 	opacity:0.1
            },
          },
        },
        yAxis: [
          {
            type: "value",
            splitNumber: 5,
            axisLabel: {
              formatter: "{value} W",
              textStyle: {
                color: "#a8aab0",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12,
              },
            },

            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#E5E9ED",
                // 	opacity:0.1
              },
            },
          },
        ],
        series: [
          {
            name: this.time,
            type: "line",
            itemStyle: {
              normal: {
                color: "#3A84FF",
                lineStyle: {
                  color: "#3A84FF",
                  width: 1,
                },
              },
            },
            data: [1, 2, 3, 3, 5, 6, 5, 3, 6, 5, 5, 4,1, 2, 3, 3, 5, 6, 5, 3, 6, 5, 5, 4,9],
          },
        ],
      };

      this.myChart.setOption(option);
      const self = this;
      window.addEventListener("resize", function () {
        self.myChart.resize();
      });
      // 更新图表数据
      // this.myChart.setOption({
      //   xAxis: {
      //     data: date,
      //   },
      //   series: [
      //     {
      //       name: "成交",
      //       data: data,
      //     },
      //   ],
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-scrollbar__view {
  height: 100%;
  display: flex;
  flex-flow: column;
}
/deep/ .table-page {
  flex: 1;
}
.title-month {
  width: 100px;
  display: flex;
  justify-content: flex-end;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-right: 24px;
}
.search-month {
  display: flex;
  align-items: center;
  margin: 24px 0;

  .text-month {
    margin-right: 5px;
    color: rgba(1, 6, 33, 0.9);
    font-size: 14px;
  }
}
::v-deep .el-descriptions {
  width: 100%;
  max-width: 800px;
}
::v-deep .el-descriptions__title {
  width: 100px;
  display: flex;
  justify-content: flex-end;
}
::v-deep .el-descriptions-item__container {
  justify-content: center;
}
// .yg-table {
//   max-width: 1000px;
// }
.title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 15px 0 20px;
  width: 100px;
  display: flex;
  justify-content: flex-end;
}
.labelClassName {
  color: rgba(1, 6, 33, 0.9);
}
.chart-box {
  padding: 0px 20xp;
  width: 100%;
  // max-width: 1000px;
  height: 280px;
  margin: 20px 0;
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .text {
    color: rgba(1, 6, 33, 0.9);
    font-size: 14px;
    margin: 0 10px 0 65px;
  }
  .tags-box {
    display: flex;
    margin-right: 10px;
    > div {
      width: 80px;
      height: 40px;
      font-size: 14px;
      color: rgba(1, 6, 33, 0.75);
      background: #fafafa;
      border-radius: 2px 2px 0px 0px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      & + div {
        margin-left: 2px;
      }
    }
    .active {
      background: #ffffff;
      color: #048790;
    }
  }
}
</style>