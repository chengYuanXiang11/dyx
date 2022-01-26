<template>
  <div class="app-container">
    <div class="page-left">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        @keydown.enter="searchText(this.filterText)"
      ></el-input>
      <el-tree
        ref="tree"
        class="filter-tree"
        :expand-on-click-node="false"
        :load="loadNode"
        lazy
        node-key="id"
        highlight-current
        :filter-node-method="filterNode"
        :default-expanded-keys="expandNode"
        :props="defaultProps"
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
      >
        <template slot="action-bar">
          <div class="box">
            <el-button
              type="primary"
              @click="operation('add', null)"
              icon="el-icon-plus"
              >新建</el-button
            >
          </div>
        </template>
        <el-table
          v-loading="loading"
          :data="tableData2"
          class="yg-table"
          border
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          height="100%"
        >
          <el-table-column label="名称" prop="type_name" />
          <el-table-column
            label="故障负责人"
            prop="principal_repairer_name"
            v-if="grade == 1 || grade == 0"
          />
          <el-table-column label="排序" prop="order_num" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="operation('edit', scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="del(scope.row)"
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
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      @open="openForm"
      @confirm="submitForm"
      @close="cancel"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        @validate="changeValidate"
      >
        <el-form-item label="名称" prop="type_name" key="type_name">
          <el-input v-model="ruleForm.type_name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order_num" key="order_num">
          <el-input-number
            v-model="ruleForm.order_num"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="故障负责人"
          key="principal_repairer_name"
          prop="principal_repairer_name"
          v-if="grade == 1 || grade == 0"
        >
          <el-input v-model="principal_repairer_name" v-show="false"></el-input>
          <select-users
            v-model="datas"
            :multiple="false"
            type="user"
            :verification="validator"
          ></select-users>
        </el-form-item>
      </el-form>
    </Drawer>
  </div>
</template>

<script>
import {
  getList,
  addRow,
  delRow,
  getInfo,
  updateRow,
  selectTree,
} from "@/request/api/lot/device/type";
export default {
  data() {
    return {
      // 表单相关
      ruleForm: {
        type_name: "",
        order_num: "",
        principal_repairer: "",
        principal_repairer_name: "",
      },
      rules: {
        type_name: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        principal_repairer_name: [
          { required: true, message: "请选择负责人", trigger: "change" },
        ],
      },
      datas: {},
      // 当前设备的id
      grade: 1,
      // 新建还是编辑
      buttonType: "",
      // 新建编辑显示隐藏
      open: false,
      loading: false,
      // 新建编辑loading
      btnLoading: false,
      // 表格数据
      tableData: [],
      // 分页
      search: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      // 根据关键字返回树形
      filterText: "",
      // 树形数据
      data: [],
      defaultProps: {
        children: "children",
        label: "type_name",
        isLeaf: "isLeaf",
      },
      // 选人红色验证边框
      validator: false,
      // 懒加载方法
      resolve_had: "",
      // 默认展开的数组
      expandNode: [0],
      // 当前选中的数据，用于判断二级
      selectedCalue: [],
    };
  },
  computed: {
    // 对数据进行排序(先看排序再看创建时间)
    tableData2() {
      let pageSize = this.search.pageSize;
      let pageNum = this.search.pageNum;
      return this.listSort(
        this.tableData.slice(
          pageNum === 1 ? 0 : (pageNum - 1) * pageSize,
          pageNum * pageSize
        )
      );
    },
    principal_repairer_name() {
      this.ruleForm.principal_repairer = this.datas.user_id;
      return (this.ruleForm.principal_repairer_name = this.datas.user_name);
    },
  },
  watch: {
    // 模糊搜索，关键字过滤
    filterText(val) {
      this.searchText(val);
    },
  },
  methods: {
    searchText(val) {
      if (val == null || val == "") {
        //  不存在搜索数据 重新渲染树
        this.expandNode = [0];
        let id = this.$refs.tree.getCurrentKey();
        if (id !== null) {
          this.expandNode.push(id);
          this.$refs.tree.setCurrentKey(id);
        }
        this.expandNode.forEach((v) => {
          this.grade = v;
          let node = this.$refs.tree.getNode(v);
          if (node.data.parentId) {
            this.expandNode.push(node.data.parentId);
          } else {
            node.loaded = false;
            node.expand();
          }
        });
      } else {
        [0].forEach((v) => {
          let node = this.$refs.tree.getNode(v);
          if (node != null && node != undefined) {
          } else {
          }
          node.loaded = false;
          node.expand();
        });
      }
    },
    // 节点过滤
    filterNode(value, data) {
      if (!value) {
        return true;
      } else {
        return data.type_name.indexOf(value) !== -1;
      }
    },
    // 搜索去重
    unique(arr) {
      const newArray = [];
      const tmp = new Map();
      for (let i = 0; i < arr.length; i++) {
        if (!tmp.get(arr[i].id)) {
          tmp.set(arr[i].id, arr[i]);
          newArray.push(arr[i]);
        }
      }
      return newArray;
    },
    // 节点排序(对 数据排序)
    listSort(data) {
      return data
        .sort((a, b) => a.order_num - b.order_num)
        .sort((a, b) => {
          if (a.order_num === b.order_num) {
            return new Date(a.create_datetime) - new Date(b.create_datetime);
          }
        });
    },
    // 更新当前懒加载节点
    refreshLazyTree(id) {
      // id为null，说明更新的是最高级
      if (id === null) id = 0;
      let node = this.$refs.tree.getNode(id);
      node.loaded = false;
      node.expand();
    },
    loadNode(node, resolve) {
      // 默认设备数据
      if (node.level === 0) {
        return resolve([
          {
            type_name: "设备类型",
            id: 0,
          },
        ]);
      }
      if (node.level > 1) {
        // 超出两层，返回空
        if (node.level > 2) {
          return resolve([]);
        }

        this.handleNodeClick({ id: node.data.id }).then((res) => {
          this.resolve_had = resolve;
          return resolve(JSON.parse(JSON.stringify(this.listSort(res))));
        });
      } else {
        // 有搜索则全局搜索
        if (this.filterText !== "") {
          selectTree({ type_name__icontains: this.filterText }).then((res) => {
            let data = res.data.results;
            let arrNode = [0];
            data = this.unique(this.handleTree(data));
            data.forEach((v) => {
              arrNode.push(v.id);
            });
            this.expandNode = arrNode;
            return resolve(this.listSort(data));
          });
        } else {
          // 否则按照懒加载一步步返回
          this.getList().then((res) => {
            this.resolve_had = resolve;
            res.forEach((v) => (v.children = [{}]));
            return resolve(JSON.parse(JSON.stringify(this.listSort(res))));
          });
        }
      }
    },
    // 分页
    handlePagination(e) {
      this.search.pageNum = e.pageNum;
      this.search.pageSize = e.pageSize;
      this.getList();
    },
    // 树节点点击事件
    handleNodeClick(data) {
      this.selectedCalue = data;
      return new Promise((RES) => {
        this.grade = data.id;
        if (data.id == 0) {
          this.getList();
          return false;
        }
        // 如果不存在父级，则表示是第二级，有子级
        if (!data.parentId) {
          this.loading = true;
          let res = this.getInfo(data.id);
          RES(res);
        } else {
          this.tableData = [data];
          this.search.total = 1;
        }
      });
    },
    // 请求一级树形
    getList(data) {
      return new Promise((RES) => {
        this.loading = true;
        if (this.grade == 0 || this.grade == 1) {
          if (this.filterText) {
            selectTree({ type_name__icontains: this.filterText })
              .then((response) => {
                let data = response.data.results;
                data = this.unique(this.handleTree(data));
                this.tableData = data;
                this.search.total = data.length;
                RES(data);
              })
              .finally((error) => {
                this.loading = false;
              });
          } else {
            getList({ pageNum:"all" })
              .then((response) => {
                response.data.results = response.data.results
                  .map((v) => {
                    if (v.nochild) {
                      v.isLeaf = true;
                    }
                    return v;
                  })
                  .filter((v) => v.type_name.includes(this.filterText));
                this.tableData = response.data.results;
                this.search.total =
                  response.data.count || response.data.results.length;
                RES(response.data.results);
              })
              .finally((error) => {
                this.loading = false;
              });
          }
        } else {
          this.getInfo(this.grade);
        }
      });
    },
    // 请求二级树形
    getInfo(id) {
      return new Promise((Res) => {
        getInfo(id, this.queryFormat({}, this.search))
          .then((res) => {
            res.data.next_info = res.data.next_info
              .map((v) => {
                v.isLeaf = true;
                v.type_version = 2;
                return v;
              })
              .filter((v) => v.type_name.includes(this.filterText));
            this.tableData = this.listSort(res.data.next_info);
            this.search.total = res.data.count || res.data.next_info.length;
            this.loading = false;
            Res(res.data.next_info);
          })
          .catch((err) => {
            this.loading = false;
            let node = this.$refs.tree.getNode(id);
            node.loaded = false;
            Res({});
          });
      });
    },
    // 删除节点
    del(row) {
      this.ruleForm = JSON.parse(JSON.stringify(row));
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delRow(row.id).then((res) => {
          this.$success("删除成功！");
          this.getList();
          this.refreshLazyTree(this.ruleForm.parentId);
        });
      });
    },
    // 打开弹窗
    operation(type, row) {
      if (this.selectedCalue.parentId && this.buttonType == "add") {
        this.$error("二级类型不可建立下级");
        return false;
      }
      this.btnLoading = true;
      this.buttonType = type;
      // 编辑
      this.$nextTick(() => {
        if (this.buttonType !== "add") {
          this.ruleForm = JSON.parse(JSON.stringify(row));
          this.datas = {
            user_id: row.principal_repairer,
            user_name: row.principal_repairer_name || row.principal_repairer,
          };
        }
      });
      this.btnLoading = false;
      this.open = true;
    },
    // 打开弹窗前
    openForm() {
      // 新建默认填写排序
      if (this.buttonType === "add") {
        this.$nextTick(() => {
          let table = this.tableData[this.tableData.length - 1];
          this.ruleForm.order_num = table
            ? Number(this.tableData[this.tableData.length - 1].order_num) + 1
            : 1;
        });
      }
    },
    // 提交
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if (this.buttonType === "add") {
            // 添加
            if (this.grade !== 0 && this.grade !== 1) {
              this.ruleForm.parentId = this.grade;
            }
            addRow(this.ruleForm).then((res) => {
              this.$success("添加成功");
              this.btnLoading = false;
              this.open = false;
              this.getList();
              this.refreshLazyTree(this.ruleForm.parentId);
            });
          } else {
            // 修改
            updateRow(this.ruleForm.id, this.ruleForm).then((res) => {
              this.$success("修改成功");
              this.btnLoading = false;
              this.open = false;

              this.getList();
              this.refreshLazyTree(this.ruleForm.parentId);
            });
          }
        } else {
          this.$error("请查看输入是否正确");
        }
      });
    },
    // 关闭
    cancel() {
      this.datas = {};
      this.$refs["ruleForm"].resetFields();
      this.open = false;
    },
    changeValidate(a, b, c) {
      // 如果负责人验证失败，边框变红
      if (c === "请选择负责人") {
        this.validator = true;
      } else {
        this.validator = false;
      }
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
    // display: flex;
    // flex-direction: column;
  }
}
</style>

