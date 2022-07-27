<template>
  <div class="app-container">
    <div class="title">区域与实际负责人</div>
		<el-row style="margin-top: 15px;">
			<el-col :span="20">
				<el-input
					placeholder=""
					suffix-icon="el-icon-search"
					style="width: 10%;"
					size="mini"
					v-model="treequery">
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="operation('add')">新建</el-button>
			</el-col>
		</el-row>
		<el-row style="margin-top: 15px;">
			<el-col :span="3">
				<el-tree :data="treeData" 
				:props="treeProp" 
				@node-click="handelTreeNode" 
				class="yg-tree" 
				:expand-on-click-node="false"
				:default-expand-all="true"></el-tree>
			</el-col>
			<el-col :span="21">
				<el-table class="yg-table" :data="tableData" v-loading="loading" border>
					<el-table-column label="区域名称" prop="area_name" />
					<el-table-column label="负责人" prop="principal">
						<template slot-scope="scope">
							<span v-for="(item,index) in scope.row.principal" :key="index">{{item}},</span>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="ordernum" />
					<el-table-column
					  label="操作"
					  align="center"
					  class-name="small-padding fixed-width"
					  width="120"
					>
					  <template slot-scope="scope">
					    <el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
					    <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
					  </template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<!-- 右侧抽屉 -->
		<Yg-Drawer
			v-model="showDrawer"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			@confirm="confirmForm"
			@closed="drawerClosed"
			@cancel="drawerClosed"
			:confirmLoading="btnLoading"
		>
			<el-form :model="form" ref="form" :rules="rules" label-width="100px">
				<el-form-item label="区域名称" prop="area_name">
					<el-input v-model="form.area_name"></el-input>
				</el-form-item>
				<el-form-item label="负责人" prop="principal">
					<div class="user-list" v-if="User.length > 0">
						<el-tag @close="removeUser(user)" closable type="primary" v-for="user in User" :key="user.user_id">{{user.user_name}}</el-tag>
					</div>
					<el-button type="primary" size="mini" @click="selectUsers">选择负责人</el-button>
				</el-form-item>
				<el-form-item label="排序" prop="ordernum">
					<el-input-number v-model="form.ordernum"  :min="0"></el-input-number>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
		<!-- 选择人员弹窗 -->
		<SelectUsersDialog
				:visible.sync="showDialog"
				:data="User"
				model="user"
				:multiple="true"
				placeholder="请选择人员"
				@confirm="getDatas"
		></SelectUsersDialog>
  </div>
</template>

<script>
import {getTree,addTree,getTable,delTree,getOneTree,updateTree} from '../../../../../request/api/market/inspection/item.js'
export default {
  data() {
    return {
			loading:false,
			tableData:[],
			tree_id:'',//选择的树形菜单的节点ID，
			form:{
				area_name:'',
				principal:[],
				ordernum:0
			},
			rules:{
				area_name:[{required: true,message: "请输入区域名称",trigger: "blur"}],
				principal:[{required: true,message: "请选择负责人",trigger: "blur"}],
				ordernum:[{required: true,message: "请输入排序",trigger: "blur"}],
			},
			btnLoading:false,
			showDrawer:false,
			drawerType:'',
			itemId:'',
			treeData:[],
			treeProp:{
				children: 'children',
				label: 'label'
			},
			treequery:'',
			id:this.$route.query.id,//巡检项id
			/* 选人相关 */
			showDialog:false,
			User: [],
		}
  },
  methods: {
		getInfo(){//获取单条
			getOneTree(this.itemId).then(resp=>{
				this.form.area_name = resp.data.area_name;
				this.User = resp.data.principal
				this.form.ordernum = resp.data.ordernum
			})
		},
		del(id){//删除节点
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			}).then(() => {
			    delTree(id).then((res) => {
			        self.$toast("删除成功！");
			        self.getTree();
							self.getTable();
			    });
			});
		},
		confirmForm(){//抽屉确认
			let self = this;
			let res = self.User.map((item) => {
				return item.user_id;
			});
			self.form.principal = res;
			self.form.pollingproject = self.id;
			this.$refs["form"].validate((vaild)=>{
				if(vaild){
					if(self.drawerType == 'add'){
						if(self.tree_id != ''){
							self.form.parent_id = self.tree_id
							addTree(self.form).then(resp=>{
								self.$toast("新增成功！");
								self.showDrawer = false;
								self.getTree();
								self.getTable();
							})
						}else{
							self.$notify.error({
								title: '错误',
								message: '请先选择需要添加区域的位置！'
							});
						}
					}else{
						updateTree(self.form,this.itemId).then(resp=>{
							self.$toast("修改成功！");
							self.showDrawer = false;
							self.getTree();
							self.getTable();
						})
					}
				}
			})
		},
		drawerClosed(){//抽屉取消
			this.showDrawer = false;
			this.User = [];
			this.form = {
				ordernum:0,
				area_name:'',
				principal:[]
			};
			this.resetForm("form");
		},
		getTable(){
			getTable(this.tree_id,this.id).then(resp=>{
				this.tableData = resp.data.child_data
			})
		},
		handelTreeNode(data){//点击树形菜单节点触发
			this.tree_id = data.id
			// console.log(this.tree_id,this.id)
			this.getTable()
		},
		operation(type,id){//打开右侧抽屉组件
			this.showDrawer = true;	
			this.itemId = id;
			this.drawerType = type;
			type == "edit" && this.getInfo();
		},
		getTree(){//获取树形菜单数据
			getTree(this.id).then(resp=>{
				this.treeData = this.handleTree(resp.data,'id',"parent_id")
				if(this.treeData.length == 0){
					let obj = {
						area_name:'全部',
						pollingproject:this.id
					}
					addTree(obj).then(resp=>{
						this.tree_id = resp.data.id
						this.getTree()
						// console.log(this.tree_id)
					})
				}
				else{
					this.tree_id = resp.data.find(item => !item.parent_id).id;
				}
			})
		},
		/* 选人组件相关 */
		selectUsers() {//打开弹窗
		    this.showDialog = true;
		},
		getDatas(e) {
		    this.showDialog = false;
		    this.User = e;
		},
		removeUser(item) {//删除人员
			let itemIndex = this.User.findIndex(
					(o) => o.user_id == item.user_id
			);
			this.User.splice(itemIndex, 1);
		},
		
  },
  created() {
		this.getTree()
  }
}
</script>

<style lang="scss" scoped>

</style>