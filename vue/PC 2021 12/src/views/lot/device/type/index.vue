<template>
  <div class="app-container">
    <div class="page-left">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
      ></el-input>
      <el-tree
        class="filter-tree"
        :data="data"
        :load="loadNode"
        lazy
        :props="defaultProps"
        highlight-current
        :filter-node-method="filterNode"
        ref="tree"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
    <div class="page-right">
      <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        :searchForm="search.form"
        @pagination="handlePagination"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template slot="action-bar">
          <div class="box">
            <el-button type="primary" @click="operation('add')">新建</el-button>
          </div>
        </template>
        <el-table
          v-loading="loading"
          :data="tableData"
          class="yg-table"
          border
          height="100%"
        >
          <el-table-column label="名称" prop="customerName" />
          <el-table-column label="故障负责人" prop="customerName" />
          <el-table-column label="排序" prop="mobile" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="operation('edit', scope.row.id)"
                >编辑</el-button
              >
              <el-button size="mini" type="text" @click="del(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </Table-page>
    </div>

    <Drawer
      :visible.sync="open"
      :title="buttonType == 'add' ? '新建' : '编辑'"
      v-loading="btnLoading"
      :size="600"
      element-loading-text="拼命加载中，请稍后..."
      @confirm="submitForm"
      @closed="closed"
      @cancel="cancel"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.v1"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.v2" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="故障负责人">
          <el-input v-model="form.v3"></el-input>
        </el-form-item>
      </el-form>
    </Drawer>
  </div>
</template>

<script>
import { getList, delRow } from "@/request/api/lot/device/type";
export default {
  // name:"Type",
  data() {
    return {
      form: {},
      buttonType: "",
      open: false,
      loading: false,
      btnLoading: false,
      total: 0,
      tableData: [{ id: 1, customerName: "123" }],
      search: {
        pageNum: 1,
        pageSize: 20,
      },
      filterText: "",
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "isLeaf",
      },
    };
  },
  created() {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handleSearch(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    handleReset(e) {
      this.queryParams = e;
      this.search.pageNum = 1;
      this.getList();
    },
    // 分页
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.search.pageSize = e.pageSize;
      this.getList();
    },
    // 树节点点击事件
    handleNodeClick(data) {
      console.log(data);
    },
    // 树搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 懒加载
    loadNode(node, resolve) {
      console.log(node, resolve);
      if (node.level === 0) {
        return resolve([{ name: "region" }]);
      }
      if (node.level > 1) return resolve([]);

      setTimeout(() => {
        const data = [
          {
            id: "1",
            name: "leaf",
            isLeaf: true,
          },
          {
            id: "2",
            name: "zone",
            isLeaf: false,
          },
        ];

        resolve(data);
      }, 500);
    },
    getList() {
      this.loading = true;
      getList(this.queryFormat({}, this.search))
        .then((response) => {
          this.tableData = response.data.results;
          this.total = response.data.count;
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    del(id) {
      const self = this;
      self
        .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          delRow(id).then((res) => {
            self.$success("删除成功！");
            self.getList();
          });
        });
    },
    operation(type, id) {
      this.buttonType = type;
      this.open = true;
    },
    submitForm() {
      this.$success("确认事件");
      this.open = false;
    },
    closed() {
      this.$success("关闭事件");
      this.open = false;
    },
    cancel() {
      this.$success("取消事件");
      this.open = false;
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  background-color: rgba(0, 0, 0, 0);
  padding: 0;
  display: flex;
  height: 100%;
  .page-left {
    width: 240px;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .filter-tree {
      margin-top: 20px;
      overflow-y: auto;
    }
  }

  .page-right {
    height: 100%;

    width: calc(100% - 255px);
    margin-left: 15px;
    background: #fff;
    box-sizing: border-box;
    padding: 15px;
    // display: flex;
    // flex-direction: column;

    .box {
      margin: 15px 0 15px;
    }
  }
}
</style>

