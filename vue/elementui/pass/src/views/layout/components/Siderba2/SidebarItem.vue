<template>
  <div class="menu-wrapper" :style="{height: rootState.clientHeight + 'px',width:rootState.asideMleft+'px'}">
      <!-- :collapse="rootState.isCollapse" -->
      <!-- :style="{height: rootState.clientHeight + 'px',width:rootState.asideMleft+'px'}" -->
      <el-submenu index="1">
        <template #title>
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template #title>分组一</template>
          <el-menu-item index="/sore/soreItem">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template #title>选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <template #title>导航二</template>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <template #title>导航三</template>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <template #title>导航四</template>
      </el-menu-item>
      <el-submenu index="5">
        <template #title>
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template #title>分组一</template>
          <el-menu-item index="5-1">选项1</el-menu-item>
          <el-menu-item index="5-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="5-3">选项3</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SidebarItem",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      rootState: state => state
    })
  },
  methods: {}
  // props: {
  //   routes: {
  //     type: Array
  //   }
  // }
};
</script>
<style scoped>
.menu-wrapper {
  width: 200px;
  height: 100%;
  overflow-x:   hidden;
  transition: all .5s;

}
</style>