<template>
  <page>
    <div class="orgStruTree" style="background-color: #ffffff">
      <!-- <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <el-tree
        ref="tree"
        :key="tree_key"
        :data="treeData"
        node-key="id"
        class="margin-top10"
        :props="props"
        :load="loadNode"
        lazy
        :filter-node-method="filterNode"
        :default-expanded-keys="expandNode"
        :render-after-expand="false"
      ></el-tree> -->
    </div>
  </page>
</template>


<script>
export default {
  data() {
    return {
      filterText: "",
      expandNode:[],
      tree_key:0,
        treeData:[],
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
    };
  },
  watch: {
    filterText(val) {
      //如果搜索框不存在数据，将组织列表重置
      if (val == null || val == "") {
        //  不存在搜索数据 重新渲染树
        this.treeNode.childNodes = []; // 把存起来的node的子节点清空，不然会界面会出现重复树！
        this.loadNode(this.treeNode, this.treeResolve);
        // 将保存的组织id也清空
        this.expandNode = [];
      }
    },
  },

  methods: {
    // 节点过滤
    filterNode(value, data) {
      if (!value) {
        return true;
      } else {
        //这里面的name是用来对比过滤的tree的属性 一般使用label 根据个人需要进行写
        return data.name.indexOf(value) !== -1;
      }
    },
    async search() {
      console.log("begin");
      if (
        this.filterText != null &&
        this.filterText != "" &&
        this.filterText != " "
      ) {
        let params = {
          orgId: config.deptId,
          empName: this.filterText,
        };
        //queryOrgEmpList 根据姓名进行过滤
        await queryOrgEmpList(params).then((res) => {
          if (
            res.result.empInfoList != [] &&
            res.result.empInfoList != "" &&
            res.result.empInfoList != null &&
            res.result.empInfoList != undefined
          ) {
            res.result.empInfoList.forEach((r) => {
              let node = this.$refs.tree.getNode(r.deptLid);
              //部门节点存在 直接展开部门节点 过滤数据
              if (node != null && node != undefined) {
                //如果节点展开 直接过滤
                if (node.expanded == false || node.loaded == false) {
                  //节点未展开 展开后过滤
                  node.expand();
                } else {
                  return this.$refs.tree.filter(this.filterText);
                }
              } else {
                //部门节点不存在 查找部门节点的父节点是否存在 若存在则展开
                let params = {
                  orgLid: r.deptLid,
                };
                queryParentLid(params).then((res) => {
                  if (res.code == 200) {
                    if (res.result != null && res.result != "") {
                      //获取所有的上级id 将节点全部展开 然后调用过滤方法
                      this.expandNode = res.result;
                    }
                  }
                });
              }
            });
          } else {
            //查无此人
            this.$message({
              message: "所要查询的人员信息不存在",
              type: "warning",
            });
          }
        });
      } else {
        //  不存在搜索数据 重新渲染树
        this.treeNode.childNodes = []; // 把存起来的node的子节点清空，不然会界面会出现重复树！
        this.loadNode(this.treeNode, this.treeResolve);
        // 将保存的组织id也清空
        this.expandNode = [];
        return;
      }
    },

    // 懒加载方法
    loadNode(node, resolve) {
      const _this = this;
      // 根节点数据 第一层需要加载的数据
      if (node.level === 0) {
        //保存初始结点信息 用来以后刷新整棵树
        _this.treeNode = node;
        _this.treeResolve = resolve;
        const params = {
          orgId: config.deptId, //组织id
        };
        // 向后台请求根节点数据
        queryOrgById(params.orgId)
          .then((res) => {
            if (res.code === 200) {
              // 声明一个对象，用来接收根节点数据
              const orgData = res.result;
              //新建一个name属性 然后根据这个属性进行过滤
              this.$set(orgData, "name", orgData.orgName);
              orgData.leaf = false;
              return resolve([orgData]);
            } else {
              _this.$message({
                message: res.message,
                type: "error",
              });
            }
          })
          .catch((res) => {
            resolve([]);
          });
      } else {
        //不是根节点 加载下级节点
        _this.getChildsList(node, resolve);
      }
    },
    // 获取加载不同的数据层   async采用异步方式
    getChildsList(node, resolve) {
      // 查询当前组织的下级组织
      const params = {
        orgId: node.data.id,
      };
      //  node.data.orgCode != null && node.data.orgCode != '' 判断是否为组织，组织才加载下一级
      if (node.data.orgCode != null && node.data.orgCode != "") {
        //加载下一级数据（人员不加载）  queryOrgEmpNext 是获取下一级的组织和人员信息
        queryOrgEmpNext(params)
          .then((res) => {
            if (res.code === 200) {
              //将组织和人员信息合并到一块 进行遍历
              const nextData = res.result.childEmpList.concat(
                res.result.childOrgList
              );
              nextData.forEach((child) => {
                //判断是否为人员，人员不存在orgCode
                if (
                  child.orgCode == null ||
                  child.orgCode == "" ||
                  child.orgCode == undefined
                ) {
                  child.orgName = child.empName;
                  this.$set(child, "name", child.empName);
                  child.leaf = true;
                  //点击的树不存在人员
                  if (
                    this.insertEmpUuids == null ||
                    this.insertEmpUuids == ""
                  ) {
                    return;
                  } else {
                    //判断人员是否是已添加数据，是则不可选中
                    this.insertEmpUuids.forEach((e) => {
                      if (e === child.id) {
                        child.disabled = true;
                      }
                    });
                  }
                  return;
                } else {
                  this.$set(child, "name", child.orgName);
                  child.leaf = false;
                }
              });
              // 将数据渲染到tree中
              resolve(nextData);
              // 过滤数据
              return this.$refs.tree.filter(this.filterText);
            } else if (res.code === 98) {
              // 查询不到数据 返回空
              resolve([]);
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          })
          .catch((res) => {
            resolve([]);
          });
      }
    },
  },
};
</script>