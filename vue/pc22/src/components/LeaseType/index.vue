<template>
  <div class="select-main">
    <div @click="selectUsers3" class="Shift">
      <span v-for="item in selectedUsers" :key="item.id + item.type">
        <el-tag
          class="shifit_tag"
          :effect="item.type === 'location' ? 'plain' : 'dark'"
          >{{ item.name }}</el-tag
        >
      </span>
    </div>
    <el-dialog
      title="选择租聘"
      :visible.sync="promoterVisible"
      width="900px"
      append-to-body
      @open="openDialog"
      @close="closeDialog"
    >
      <div class="su-main">
        <div class="member-main">
          <div class="header">
            <el-input
              placeholder="请输入姓名、邮箱或手机号"
              prefix-icon="el-icon-search"
              v-model="searchName"
            >
            </el-input>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(o, index) in trajectory"
                :key="'currentDept' + index"
                class="active"
                @click.native="switchPath(index)"
                >{{ o.name }}</el-breadcrumb-item
              >
              <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>
            <el-checkbox
              :indeterminate="indeterminate"
              v-model="isSelectAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
          </div>
          <!-- 选择列表 -->
          <div
            class="unselected-list"
            v-loading="loading"
            v-infinite-scroll="load"
            infinite-scroll-distance="10"
            :infinite-scroll-disabled="disabled"
            infinite-scroll-delay="200"
          >
            <template>
              <el-empty
                description="暂无数据"
                :image-size="100"
                v-if="userList.length <= 0"
              ></el-empty>
              <div
                class="dept"
                v-for="o in handleSearchName"
                :key="'dept' + o.id"
              >
                <div class="name">
                  <el-checkbox :value="isChecked(o)" @change="select($event, o)"
                    ><svg-icon class="checkbox" icon-class="branch"></svg-icon>
                    <span>{{ o.name }}</span></el-checkbox
                  >
                </div>
                <div
                  class="lower-level"
                  :class="{
                    disable: isChecked(o),
                  }"
                  v-if="isSubordinate(o)"
                  @click="isChecked(o) ? true : getPerson(o)"
                >
                  <svg-icon icon-class="mind-map"></svg-icon>
                  <span>下级</span>
                </div>
              </div>
              <div class="name" v-if="busy">
                <i>加载中...</i>
              </div>
              <div class="name" v-if="noMore">
                <i>没有更多数据了</i>
              </div>
            </template>
          </div>
        </div>
        <!-- 已选列表 -->
        <div class="selected-list">
          <div class="header" v-if="selectedUsers.length != 0">
            已选：{{ checkedTitle }}
          </div>
          <el-scrollbar style="height: 100%">
            <ul>
              <li
                v-for="user in selectedUsers"
                :key="'user-select' + user.type + user.id"
              >
                <span class="avatar"> {{ generateName(user.name) }}</span>
                <div class="userInfo">
                  <em>{{ user.name }}</em>
                </div>
                <i
                  class="el-icon-close close-btn"
                  @click="delSelected(user)"
                ></i>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="promoterVisible = false">取 消</el-button>
        <el-button type="primary" @click="surePromoter">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRent } from "@/request/api/common.js";
export default {
  name: "LeaseType",
  data() {
    return {
      // 弹窗显示
      promoterVisible: false,
      // 搜索名称
      searchName: "",
      // 选择用户列表
      selectedUsers: [],
      // 路径集合
      trajectory: [],
      loading: false,
      // 加载状态,
      // 用户列表
      userList: [],
      // 滚动加载
      busy: false,
      // 总条数
      total: 100,
      //现在加载到多少条，无限滚动支持
      count: 100,
    };
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    // 数据
    data: {
      type: Object | Array,
    },
    // leaseType-租赁类型(1-商铺，2-宿舍，3-仓库)
    LeaseType: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    // 路径获取
    pathAcquisition() {
      let arr = [];
      Object.values(this.trajectory).forEach((v) => {
        arr.push(v.name);
      });
      return arr;
    },
    // 是否要显示下级
    isSubordinate() {
      return function (o) {
        return o.type === "location" ? false : true;
      };
    },
    // 加载条数
    noMore() {
      return this.count >= this.total;
    },
    // 是否禁止滚动加载
    disabled() {
      return this.busy || this.noMore;
    },
    // checkbox是否选中
    isChecked() {
      return function (item) {
        let deptIndex = this.selectedUsers.findIndex(
          (arrItem) => arrItem.name == item.name && arrItem.type === item.type
        );
        return deptIndex != -1;
      };
    },
    // 全选半选效果
    indeterminate() {
      let num = this.selectNum();
      let totalNum = this.totalNum();
      return num > 0 && num < totalNum;
    },
    // 判断是否全选
    isSelectAll: {
      get() {
        let num = this.selectNum();
        let totalNum = this.totalNum();
        return num == totalNum;
      },
      set(newValue) {
        return newValue;
      },
    },
    // 名称截取
    generateName() {
      return function (name) {
        return name.toString().substring(0, 2);
      };
    },
    // 右侧选择框title
    checkedTitle() {
      let userStr =
        this.selectedUsers.length == 0
          ? ""
          : `${this.selectedUsers.length}名用户`;
      let strArr = [userStr];
      strArr = strArr.filter((item) => item != "");
      strArr = strArr.join("，");
      return strArr;
    },
    // 是否显示全选
    showCheckAll() {
      if (this.loading) {
        return false;
      } else {
        return this.handleSearchName.length > 0;
      }
    },
    // 根据名字模糊搜索
    handleSearchName() {
      this.loading = true;
      let str = "(.*?)";
      this.filterMsg = [];
      let regStr = str + this.searchName + str;
      let reg = RegExp(regStr, "i"); // 以mh为例生成的正则表达式为/(.*?)m(.*?)h(.*?)/i
      this.userList.map((item) => {
        if (reg.test(item.name)) {
          this.filterMsg.push(item);
        }
      });
      this.$nextTick(() => {
        this.loading = false;
      });
      return this.filterMsg;
    },
  },
  created() {
    // 有data则回显
    if (this.value.length > 0) {
      this.value.forEach((v) => {
        this.selectedUsers.push(v);
      });
    }
  },
  methods: {
    selectUsers3() {
      // 回显
      this.promoterVisible = true;
    },
    // 切换路径
    switchPath(index) {
      this.trajectory.splice(index + 1);
      this.getPerson();
    },
    // 已选择的数量
    selectNum() {
      let self = this;
      let userNum = 0;
      self.selectedUsers.forEach((item) => {
        self.handleSearchName.forEach((subItem) => {
          if (item.id == subItem.id) {
            userNum++;
          }
        });
      });
      return userNum;
    },
    // 部门和人员总数
    totalNum() {
      return this.handleSearchName.length;
    },
    // 确定按钮事件
    surePromoter() {
      this.promoterVisible = false;
      this.$emit("confirm", this.selectedUsers);
      this.$emit("input", this.selectedUsers);
    },
    // 接口获取数据
    getPerson(o) {
      // 加路径
      if (o !== undefined) {
        let index = this.trajectory.findIndex((v) => v.type === o.type);
        index > -1
          ? this.trajectory.splice(index, 1, o)
          : this.trajectory.push(o);
      }
      this.loading = true;
      // 根据路径获取请求参数
      let data = {
        leaseType: this.LeaseType,
      };
      // 获取最后一个路由的参数
      let dataLast = this.trajectory[this.trajectory.length - 1];
      data[dataLast.type] = dataLast.id;
      getRent(data)
        .then((res) => {
          // 修改列表
          this.userList = res.data.next.filter((v) => {
            let num = this.trajectory.findIndex(
              (value) => v.type === value.type
            );
            return num > -1 ? false : true;
          });
        })
        .finally((error) => {
          this.loading = false;
        });
    },
    openDialog() {
      // 打开初始化
      this.openType();
      this.getPerson();
    },
    // 初始化路径
    openType() {
      let name = "";
      this.trajectory = [];
      switch (this.LeaseType) {
        case 1:
          name = "商铺";
          break;
        case 2:
          name = "仓库";
          break;
        case 3:
          name = "宿舍";
          break;
      }
      this.trajectory.push({
        id: this.LeaseType,
        name: name,
        type: "leaseType",
      });
    },
    // 滚动加载
    load() {
      this.busy = true;
    },
    // 选中添加事件
    select(e, item) {
      // 如果时添加
      if (e) {
        // 如果选中的是商户类
        this.selectedUsers.push(item);
      } else {
        // 如果是删除
        let num = this.selectedUsers.findIndex(
          (v) => v.type === item.type && v.name == item.name
        );
        this.selectedUsers.splice(num, 1);
      }
    },
    // 删除元素
    delSelected(item, type) {
      let index = this.selectedUsers.findIndex((arrItem) => {
        return arrItem.name == item.name && arrItem.type === item.type;
      });

      if (index >= 0) {
        this.selectedUsers.splice(index, 1);
      }
    },
    // 全选点击事件
    handleCheckAllChange(e) {
      let self = this;
      let selectAllUser = () => {
        self.handleSearchName.forEach((item) => {
          var userIndex = self.selectedUsers.findIndex(
            (arrItem) => arrItem.id == item.id
          );
          if (e) {
            if (userIndex == -1) {
              self.selectedUsers.push(item);
            }
          } else {
            self.selectedUsers.splice(userIndex, 1);
          }
        });
      };

      selectAllUser();
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
  },
  watch: {
    visible() {
      this.promoterVisible = this.visible;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/selectDialog.scss";
.unselected-list {
  overflow-y: auto !important;
  height: 100%;
}
.header {
  display: flex;
  flex-flow: column;
}
.Shift {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid rgba(217, 217, 217, 1);
  line-height: 32px;
  padding: 3px;
  border-radius: 4px;
  min-height: 40px;
  .shifit_tag {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin: 0 3px;
    cursor: pointer;
  }
}
</style>
