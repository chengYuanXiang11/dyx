<template>
  <el-row style="height:100%;padding: 0 20px;">
    <el-col style="height:100%">
      <div class="listTemplateContainer border hl-container">
        <SearchArea />
        <OperatorArea @getTableList="getTableList" />
        <TableArea @deleteEvent="deleteEvent" />
        <DialogArea ref="DialogArea" @addOrUpdateEvent="addOrUpdateEvent" />
        <Page @getTableList="getTableList" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SearchArea from "./searchArea";
import OperatorArea from "./operatorArea";
import TableArea from "./tableArea";
import DialogArea from "./dialogArea";
import Page from "../../../components/Pagination/test1";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      rootState: (state) => state,
      menuState: (state) => state.Menu,
    }),
  },
  components: {
    SearchArea,
    OperatorArea,
    TableArea,
    DialogArea,
    Page,
  },
  data() {
    return {
      key: false,
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    // 获取菜单列表
    getTableList(current) {
      this.api.get("/menu/getMenuTree").then((res) => {
        if (res.code == 200) {
          this.menuState.tableList = res.data;
          this.menuState.listRoot[0].children = res.data;  //弹出层使用
          this.$store.dispatch("ROOT_UPDATE_TABLE_HEIGHT", { $ }); // 动态设置表格高度
        }
      });
    },
    // 新增或修改菜单
    addOrUpdateEvent() {
      this.$refs.DialogArea.$refs["menuForm"].validate((valid) => {
        if (valid) {
          this.api
            .post("/menu/saveAndUpdate", this.menuState.dialogData)
            .then((res) => {
              this.$store.dispatch("ROOT_AXIOS_TIP", {
                that: this,
                res,
                cb: () => {
                  this.menuState.dialogShow = false;
                  this.getTableList();
                },
              });
            });
        }
      });
    },
    // 删除菜单， idList为选中数据的id集合
    deleteEvent(id) {
      this.$store.dispatch("ROOT_CONFIRM", {
        that: this,
        msg: "此操作将删除记录, 是否继续?",
        cb: () => {
          this.api.put("/menu/updateToDel", { id }).then((res) => {
            this.$store.dispatch("ROOT_AXIOS_TIP", {
              that: this,
              res,
              cb: () => {},
            });
            if (res.code == 200) {
              this.getTableList();
              this.menuState.selectList = [];
              this.$message.success(res.msg);
            }
          });
        },
      });
    },
  },
};
</script>
