<template>
  <div class="listTemplateDialog">
    <el-dialog
      title="角色权限"
      :visible.sync="authDialog"
      width="580px">
        <el-tree  
          :data="menuList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          ref="permissionTree"
          :check-strictly="true"
          accordion
          @check="handlerCheckClick">
        </el-tree>
      <div class="dialogOperator">
        <el-button size="small" type="primary" @click="savePermission">授权</el-button>
        <el-button size="small" type="primary" @click="authDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
// import $ from 'jquery'
export default {
  computed: {
    ...mapState({ roleState: state=>state.Role })
  },
  data(){return{
    roleId: "",
    authDialog: false,
    menuList: [],
    defaultProps: {
      children: 'children',
      label: 'name'
    },
  };},
  mounted(){},
  methods:{
    open({id}){
      this.roleId = id;
      this.authDialog = true;
      this.getAuthInfo(id);
    },
    // 获取授权树节点
    getAuthInfo(id){
      this.api.get("/role/getMenuTreeByRoleId?id=" + id).then((res)=>{
         if(res.code === 200) {
          this.menuList = res.data.menuList
          this.$refs.permissionTree.setCheckedKeys(res.data.refreshRole.split(','))
        }
      })
    },
    // 保存权限信息
    savePermission () {
      let ids = this.$refs.permissionTree.getCheckedKeys();
      this.api.put('/role/saveRoleMenu',{ id: this.roleId, menuList: ids.join(',')})
      .then( res => {
        this.$store.dispatch("ROOT_AXIOS_TIP", {that: this, res, cb: ()=>{ this.authDialog = false; }})
      });
    },
    //节点选中事件
    handlerCheckClick (current,selection) {
      let ids = current.children.map( ele => ele.id);
      let sunIds = current.children.map( ele => ele.children).flat().map(ele => ele.id)
      if (current.resType === 'menu') {
        if (selection.checkedKeys.includes(current.id)) {
          // 选中
          this.$refs.permissionTree.setCheckedKeys([...selection.checkedKeys, ...ids])
        } else {
          let selectedIds = selection.checkedKeys.filter( ele => !ids.includes(ele) && !sunIds.includes(ele))
          this.$refs.permissionTree.setCheckedKeys(selectedIds)
        }
      }

    }
  }
}

</script>