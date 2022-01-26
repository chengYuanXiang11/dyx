<template>
  <Page>
    <div v-if="type == 'merchant'">
      <div class="search-box">
        <span class="title-month">商位信息:</span>
        <div class="tags-box">
          <div :class="activeIndexMore == 'all' ? 'active' : ''" @click="switchIndexMore(1)">总览</div>
          <div
            v-for="(item,index) in tagListMore"
            :key="index"
            :class="index == activeIndexMore ? 'active' : ''"
            @click="switchIndexMore(2, index)"
          >{{ item }}</div>
        </div>
      </div>
      <div class="search-month" v-if="activeIndexMore == 'all'">
        <div class="title-month">商户总记录:</div>
        <div class="text-month">按月查询</div>
        <el-date-picker
          v-model="dateSearch"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="monthSearch"
        ></el-date-picker>
      </div>
    </div>

    <div v-if="isShow">
      <el-descriptions title="水表信息">
        <el-descriptions-item labelClassName="labelClassName" label="水表当前状态">正常</el-descriptions-item>
        <el-descriptions-item labelClassName="labelClassName" label="水表当前数值">352KW/h</el-descriptions-item>
        <el-descriptions-item labelClassName="labelClassName" label="刷新时间">2022-01-30</el-descriptions-item>
      </el-descriptions>

      <div class="title">用水记录</div>
      <div class="search-box">
        <span class="text">查询:</span>
        <div class="tags-box">
          <div
            v-for="(item,index) in tagList"
            :key="index"
            :class="index == activeIndex ? 'active' : ''"
            @click="switchIndex(index)"
          >{{ item }}</div>
        </div>
        <div>
          <el-date-picker
            v-model="dateSearch"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择年月日"
            @change="timeChange"
            v-if="activeIndex == 0"
          ></el-date-picker>

          <el-date-picker
            v-model="dateSearch"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            @change="monthChange"
            v-if="activeIndex == 1"
          ></el-date-picker>

          <el-date-picker
            v-model="dateSearch"
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
      <el-table v-loading="loading" :data="tableData" border height="100%" class="yg-table">
        <el-table-column key="1" label="时间" prop="storeName" />
        <el-table-column key="2" label="上期抄表" prop="merchantName" v-if="isShow" />
        <el-table-column key="3" label="本期抄表" prop="mobile" v-if="isShow" />
        <el-table-column key="4" label="实用吨数" prop="mobile" />
        <el-table-column key="5" label="应缴费用" prop="mobile" />
        <el-table-column key="6" label="实缴费用" prop="mobile" />
        <el-table-column key="7" label="扣费时间" prop="mobile" v-if="isShow && activeIndex == 0" />
      </el-table>
    </Table-page>
  </Page>
</template>

<script>
import * as echarts from 'echarts'
import {
  getSearchList
} from "@/request/api/lot/waterpower/waterRecords";
export default {
  data() {
    return {
      type: this.$route.query.type,
      loading: false,
      total: 0,
      tableData: [],
      queryParams: {
        parentid: this.$route.query.id,
        time__icontains:""
      },
      query: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      activeIndex: 0,
      tagList: ['按时段', '按天', '按月'],
      activeIndexMore: 'all',
      tagListMore: ['D145', 'D298'],
      dateSearch: "",
      isShow: false,
    }
  },
  created() {
    this.getList()
  },
  beforeMount() {
    let _this = this
    if (this.type == 'quotient') {
      _this.isShow = true
      this.$nextTick(function () {
        _this.chart()
      })
    }
  },
  methods: {
    // 分页
    handlePagination(e) {
      this.query.pageSize = e.pageSize;
      this.query.pageNum = e.pageNum;
      this.getList();
    },
    // 商位查询 时间
    switchIndex(index) {
      this.activeIndex = index
      this.dateSearch = ""
    },
    // 商位信息 每次点击清空搜索条件重新请求数据
    switchIndexMore(num, index) {
      let _this = this
      this.dateSearch = ""
      this.queryParams.time__icontains = ""
      if (num == 1) {
        this.activeIndexMore = 'all'
        this.isShow = false
      } else {
        this.activeIndexMore = index
        this.isShow = true
        this.$nextTick(function () {
          _this.chart()
        })
      }

    },
    // 总览按月查询
    monthSearch(val) {
      console.log(val);
      this.queryParams.time__icontains = val
      this.getList()
    },
    // 按商位查询 年月日
    timeChange(val) {
      console.log(val);
      this.queryParams.time__icontains = val
      this.getList()
    },
    // 按商位查询 年月
    monthChange(val) {
      console.log(val);
      this.queryParams.time__icontains = val
      this.getList()
    },
    // 按商位查询 年
    yearChange(val) {
      console.log(val);
      this.queryParams.time__icontains = val
      this.getList()
    },
    getList() {
      let _this = this
      this.loading = true;
      getSearchList(this.queryFormat(this.queryParams, this.query))
        .then((response) => {
          _this.tableData = response.data.rows;
          _this.query.total = response.data.total;
        })
        .finally((error) => {
          _this.loading = false;
        });

    },
    chart() {
      let myChart = echarts.init(document.getElementById('chartId'));
      let option = {
        title: {
          text: '用水记录',
          top: "3%",
          left: "3%"
        },
        tooltip: {
          trigger: 'axis',
        },
        // legend: {
        //  data: ['2018', '2019'],
        // },
        grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        // toolbox: {
        //  feature: {
        //   saveAsImage: {},
        //  },
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false, //坐标轴两边留白
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            //	margin:15,
            textStyle: {
              color: '#1B253A',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            },
            formatter: function (params) {
              var newParamsName = '';
              var paramsNameNumber = params.length;
              var provideNumber = 4; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = '';
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + '\n';
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
            //rotate:50,
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: true,
          },
          axisLine: {
            //坐标轴轴线相关设置
            lineStyle: {
              color: '#E5E9ED',
              // opacity:0.2
            },
          },
          splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            show: false,
            lineStyle: {
              color: '#E5E9ED',
              // 	opacity:0.1
            },
          },
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            axisLabel: {

              textStyle: {
                color: '#a8aab0',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
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
                color: '#E5E9ED',
                // 	opacity:0.1
              },
            },
          },
        ],
        series: [
          {
            name: '2018',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3A84FF',
                lineStyle: {
                  color: '#3A84FF',
                  width: 1,
                },

              },
            },
            data: [1, 2, 3, 3, 5, 6, 5, 3, 6, 5, 5, 4],
          },

        ],
      };

      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })


    }
  }
}
</script>

<style lang="scss" scoped>
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