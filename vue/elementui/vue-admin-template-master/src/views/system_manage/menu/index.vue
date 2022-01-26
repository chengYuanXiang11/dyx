<template>
  <el-row style="height:100%;padding: 0 20px;">
    <!-- <el-col style="height:100%">
      <div class="listTemplateContainer border hl-container">
        <DialoArea @upDateOrCreate="upDateOrCreate"/>
        <OperatorArea />
        <TableArea @deleteEvent="deleteEvent" @upDate="upDate" />
      </div>
    </el-col>-->
    <route-link to="/">menu</route-link>
  </el-row>
</template>

<script>
// import DialoArea from "./dialoArea";
// import OperatorArea from "./operatorArea";
// import TableArea from "./tableArea";
// import { mapState } from "vuex";
export default {
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
</style>
