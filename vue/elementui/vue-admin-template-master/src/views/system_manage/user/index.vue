<template>
  <el-row style="height:100%;padding: 0 20px;">
    <!-- <el-col style="height:100%">
      <div class="listTemplateContainer border hl-container">
        <DialoArea @upDateOrCreate="upDateOrCreate"/>
        <OperatorArea />
        <TableArea @deleteEvent="deleteEvent" @upDate="upDate" />
      </div>
    </el-col>-->
    <div @click="foo('dasfs')">d</div>
    <div @click="settime('settime')">settime</div>

    {{csname}}
    <div ref="myChart" id="myChart"></div>
  </el-row>
</template>

<script>
// import DialoArea from "./dialoArea";
// import OperatorArea from "./operatorArea";
// import TableArea from "./tableArea";
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'User',
  computed: {
    ...mapState({
      csname: state => state.ceshi,
      cs2name: state => state.ceshi.ceshi2
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.chars()
    })
  },
  methods: {
    ...mapMutations('ceshi', { foo: 'INTHETS' }),
    ...mapActions('ceshi/ceshi2', { settime: 'ceshi2' }),
    chars() {
      const myChart = this.$echarts.init(this.$refs.myChart, 'dark')
      var symbolSize = 20

      // 这个 data 变量在这里单独声明，在后面也会用到。
      var data = [
        [15, 0],
        [-50, 10],
        [-56.5, 20],
        [-46.5, 30],
        [-22.1, 40]
      ]

      myChart.setOption({
        xAxis: {
          min: -100,
          max: 80,
          type: 'value',
          axisLine: { onZero: false }
        },
        yAxis: {
          min: -30,
          max: 60,
          type: 'value',
          axisLine: { onZero: false }
        },
        series: [
          {
            id: 'a',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize, // 为了方便拖拽，把 symbolSize 尺寸设大了。
            data: data
          }
        ]
      })
    }
  }
  // components: { DialoArea, OperatorArea, TableArea },
  // data() {
  //   return {};
  // },
  // computed: {
  //   ...mapState({
  //     orgState: (state) => state.Organization,
  //   }),
  // },

  // methods: {
  //   //修改和新增
  //   upDateOrCreate() {
  //     if (this.orgState.dialogType != "新增机构") {
  //       this.api
  //         .put("/organization/update", this.orgState.dialogForm)
  //         .then((res) => {
  //           this.getListTree();
  //           this.orgState.dialogShow = false;
  //         });
  //     } else {
  //       this.api
  //         .post("/organization/create", this.orgState.dialogForm)
  //         .then((res) => {
  //           this.getListTree();
  //           this.orgState.dialogShow = false;
  //         });
  //     }
  //   },
  //   //删除
  //   deleteEvent({ data }) {
  //     this.$store.dispatch("ROOT_CONFIRM", {
  //       that: this,
  //       msg: "此操作将删除记录, 是否继续?",
  //       cb: () => {
  //         this.api
  //           .delete("/organization/delete", { params: { id: data.id } })
  //           .then((res) => {
  //             if (res.code == 200) {
  //               this.getListTree();
  //               this.$message.success(res.msg);
  //             }
  //           });
  //       },
  //     });
  //   },
  //   //获取结构树
  //   async getListTree() {
  //     try {
  //       let listTree = await this.api.get("/organization/listTree");
  //       this.orgState.tableListTree = listTree.data;
  //       // console.log(listTree.data)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   //查询id打开修改弹窗
  //   upDate(id) {
  //     this.api.get(`/organization/get?id=${id}`).then((res) => {
  //       res.data.type = `${res.data.type}`;
  //       this.orgState.dialogForm = res.data;
  //       this.orgState.dialogType = "修改机构";
  //       this.orgState.dialogShow = true;
  //     });
  //   },
  // },
  // created() {
  //   this.getListTree();
  // },
}
</script>
<style lang="scss" scoped>
#myChart {
  width: 300px;
  height: 300px;
}
</style>
