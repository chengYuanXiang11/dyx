<template>
	<div class="app-container">
		<div class="operation">
			<el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<el-table class="yg-table" :data="tableData" v-loading="loading">
			<el-table-column label="巡检单名称" prop="ticket_name"/>
			<el-table-column label="操作">
				<template slot-scope='scope'>
					<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text" @click="del(scope.row.id)">删除</el-button>
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
				<el-form-item label="巡检单名称" prop="ticket_name">
					<el-input v-model="form.ticket_name"></el-input>
				</el-form-item>
				<el-form-item label="巡检项" prop="polling_project">
					<el-select
						v-model="form.polling_project"
						multiple
						collapse-tags
						placeholder="请选择巡检项">
						<el-option
							v-for="item in itemoptions"
							:key="'select'+ item.id"
							:label="item.polling_name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
import {getList,getItem,addOrder,getInfo,delOrder,updateOrder} from '../../../../request/api/market/inspection/order.js'
export default{
	data(){
		return{
			form:{
				ticket_name:'',
				polling_project:[]
			},
			rules:{
				ticket_name:[{ required: true, message: '请输入巡检单名称', trigger: 'blur' }],
				polling_project:[{ required: true, message: '请选择巡检项', trigger: 'blur' }]
			},
			itemoptions:[],
			btnLoading:false,
			showDrawer:false,
			tableData:[],
			loading:false,
			showDrawer:false,
			drawerType:'',
			itemId:'',
			paging:{
				pageNum: 1,
				pageSize: 20,
				total:0,
			},
		}
	},
	methods:{
		confirmForm(){
			let self = this
			self.$refs["form"].validate((valid)=>{
				if(valid){
					if(self.drawerType == 'add'){
						addOrder(self.form).then(resp=>{
							self.$toast("新建成功！");
							self.showDrawer = false
							self.getList()
						})
					}else{
						updateOrder(self.form,self.itemId).then(resp=>{
							self.$toast("修改成功！");
							self.showDrawer = false
							self.getList()
						})
					}
				}
			})
		},
		drawerClosed(){
			this.showDrawer = false;
			(this.form = {
				ticket_name:'',
				polling_project:[]
				}),
			this.resetForm("form");
		},
		getList(){
			this.loading = true
			getList(this.paging).then(resp=>{
				this.tableData = resp.data.results;
				this.paging.total = resp.data.count;
			}).finally(error=>{
				this.loading = false
			})
		},
		getItem(){
			getItem().then(resp=>{
				this.itemoptions = resp.data.results
				// console.log(this.itemoptions)
			})
		},
		del(id){
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			  }).then(() => {
			    delOrder(id).then((res) => {
			      self.$toast("删除成功！");
						this.getList()
			    });
			  });
		},
		getInfo(){
			getInfo(this.itemId).then(resp=>{
				this.form.ticket_name = resp.data.ticket_name
				this.form.polling_project = resp.data.polling_project
			})
		},
		operation(type,id){
			this.getItem();
			this.showDrawer = true;
			this.drawerType = type;
			this.itemId = id;
			type == "edit" && this.getInfo();
		},
	},
	created() {
		this.getList()
	}
}
</script>

<style lang="scss" scoped>
	
</style>