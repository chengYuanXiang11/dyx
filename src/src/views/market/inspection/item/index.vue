<template>
	<div class="app-container">
		<div class="operation">
			<el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<el-table class="yg-table" :data="tableData" v-loading="loading">
			<el-table-column label="巡检项" prop="polling_name"/>
			<el-table-column label="负责人" prop="count_principal"/>
			<el-table-column label="操作">
				<template slot-scope='scope'>
					<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text" @click="areaSet(scope.row.id)">区域设置</el-button>
					<el-button type="text" @click="delitem(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination
			:total="paging.total"
			:page.sync="paging.pageNum"
			:limit.sync="paging.pageSize"
			@pagination="getList"
		/>
		<!-- 新建/编辑窗口 -->
		<Yg-Drawer
			v-model="showDrawer"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			@confirm="confirmForm"
			@closed="drawerClosed"
			@cancel="drawerClosed"
			:confirmLoading="btnLoading"
		>
			<el-form :model="form" ref="form" :rules="rules" label-width="100px">
				<el-form-item label="巡检项" prop="polling_name">
					<el-input v-model="form.polling_name"></el-input>
				</el-form-item>
				<el-form-item label="负责人" prop="count_principal">
					<el-tag type="primary" v-if="Object.keys(form.count_principal).length > 0" style="margin-right: 15px;">{{form.count_principal.user_name}}</el-tag>
					<el-button type="primary" size="mini" @click="selectUsers">{{Object.keys(form.count_principal).length > 0 ? '更换负责人' : '选择负责人'}}</el-button>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
		<!-- 选择总负责人窗口 -->
		<SelectUsersDialog
				:visible.sync="showDialog"
				:data="form.count_principal"
				model="user"
				:multiple="false"
				placeholder="请选择总负责人"
				@confirm="getDatas"
		></SelectUsersDialog>
	</div>
</template>

<script>
import {getList,addItem,delItem,getInfo,updateItem} from '../../../../request/api/market/inspection/item.js'
export default{
	data(){
		return{
			form:{
				polling_name:'',
				count_principal:''
			},
			rules:{
				polling_name:[{required: true,message: "请输入巡更点名称",trigger: "blur"}],
				count_principal:[{required: true,message: "请选择总负责人",trigger: "blur"}]
			},
			showDrawer:false,
			btnLoading:false,
			drawerType:'',
			itemId:'',
			tableData:[],
			loading:false,
			paging:{
				pageNum: 1,
				pageSize: 20,
				total:0,
			},
			showDialog:false
		}
	},
	methods:{
		areaSet(id){
			this.$router.push({path:'/setArea',query:{id:id}})
		},
		//获取单条巡检项
		getInfo(){
			getInfo(this.itemId).then(resp=>{
				this.form.count_principal = resp.data.count_principal;
				this.form.polling_name = resp.data.polling_name
			})
		},
		//删除巡检项
		delitem(id){
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			  }).then(() => {
			    delItem(id).then((res) => {
			      self.$toast("删除成功！");
						this.getList()
			    });
			  });
		},
		//新建/编辑窗口确定按钮
		confirmForm(){
			const self = this;
			this.$refs["form"].validate((valid)=>{
				if(valid){
					let res = self.form.count_principal.user_id
					self.form.count_principal = res
					if(self.drawerType == 'add'){ //新建
						addItem(self.form).then(resp=>{
							self.$toast("新建成功！");
							self.showDrawer = false
							this.getList()
						})
					}else{ //编辑
						updateItem(self.form,self.itemId).then(resp=>{
							self.$toast("修改成功！");
							self.showDrawer = false
							this.getList()
						})
					}
				}
			})
		},
		//新建/编辑窗口取消#初始化
		drawerClosed(){
			this.showDrawer = false;
			(this.form = {
				count_principal:[],
				polling_name:''
				}),
			this.resetForm("form");
		},
		//打开新建/编辑窗口
		operation(type,id){
			this.showDrawer = true;
			this.drawerType = type;
			this.itemId = id;
			type == "edit" && this.getInfo();
		},
		//获取列表数据
		getList(){
			this.loading = true;
			getList(this.paging).then(resp=>{
				this.tableData = resp.data.results
				this.paging.total = resp.data.count
			}).finally(error=>{
				this.loading = false
			})
		},
		//选择总负责人
		selectUsers() {
			this.showDialog = true;
		},
		getDatas(e) {
			this.showDialog = false;
			this.form.count_principal = e
			/* 
				判断是否选择了负责人，
			  如果选择了负责人不做操作
				如果没有选择负责人把this.form.count_principal赋值为[]
				方便进行表单验证
				el-form 表单验证的对象若是{}对象的话，验证会出错
			 */
			if(this.form.count_principal.user_name){
				
			}else{
				this.form.count_principal = []
			}
		},
	},
	created() {
		this.getList()
	}
}
</script>
<style lang="scss" scoped>
	
</style>