<template>
	<Table-page
		:page-size="search.pageSize"
		:total="search.total"
		:page-num="search.pageNum"
		:searchForm="search.form"
		@pagination="handlePagination"
		@search="handleSearch"
		label-width="300px"
	>
		<template slot="action-bar">
			<el-button
			    v-hasPermi="['permission:role:post']"
			    type="primary"
			    icon="el-icon-plus"
			    @click="operation('add')"
			    >新增</el-button>
		</template>
		<el-table class="yg-table" :data="tableData" border v-loading="loading">
			<el-table-column label="名称" prop="name"></el-table-column>
			<el-table-column label="修改人" prop="modify"></el-table-column>
			<el-table-column label="修改时间" prop="update_datetime"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="operation('edit',scope.row.code_id)" v-if="scope.row.is_master != 1">编辑</el-button>
					<el-button type="text" @click="del(scope.row.code_id)"  v-if="scope.row.is_master != 1">删除</el-button>
					<el-button type="text" v-if="scope.row.is_master == 1" @click="operation('check',scope.row.code_id)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 抽屉 -->
		<Drawer
			:visible.sync="showDrawer"
			:title="(drawerType == 'add' ? '新建' : drawerType == 'edit' ? '编辑' : '查看')"
			@confirm="confirmForm"
			@closed="drawerClosed"
		>
			<el-form :model="form" :rules="rules" ref="form" label-width="100px">
				<el-form-item label="账户名称" prop="name">
					<el-input v-model="form.name" :disabled="activtion"></el-input>
				</el-form-item>
				<el-form-item label="优先级" prop="priority">
					<el-input-number v-model="form.priority" :min="0" :max="10" :controls="false"></el-input-number>
				</el-form-item>
				<el-form-item label="扣费项目" prop="type_list">
					<el-checkbox-group v-model="form.type_list" :disabled="activtion">
						<el-checkbox :label="item.id" v-for="(item,index) in payItem" :key="'payitem' + index">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</Drawer>
	</Table-page>
</template>

<script>
import {getList,getItem,addAccount,delAccount,getInfo,updateAccount} from '@/request/api/market/accountManage/accountManage.js'
export default {
    name: "Market-account",
    data() {
        return {
					activtion:false,
					payItem:[],
					form:{
						type_list:[],
						name:'',
						priority:null
					},
					rules:{
						name:[{ required: true, message: '请输入账户名称', trigger: 'blur' }],
						priority:[{ required: true, message: '请输入优先级', trigger: 'blur' }],
						type_list:[{ required: true, message: '至少选择一个', trigger: 'blur' }]
					},
					tableData:[],
					loading:false,
					itemId:'',
					drawerType:'',
					showDrawer:false,
					btnLoading:false,
					search: {
							pageNum: 1,
							pageSize: 10,
							total: 0
					},
				};
    },
		methods: {
			// 分页方法
			handlePagination(e) {
				this.search.pageSize = e.pageSize;
				this.search.pageNum = e.pageNum;
				this.getList();
			},
			handleSearch(e) {
				this.queryParams = e;
				this.search.pageNum = 1;
				this.getList();
			},
			is_activtion(){
				this.activtion = true 
			},
			getItem(){
				getItem().then(resp=>{
					let res = []
					res = resp.data.results.map((item)=>{
						return {id:item.id,name:item.name,code:item.code}
					})
					this.payItem = res
					console.log(this.payItem)
				})
			},
			del(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delAccount(id).then(resp=>{
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getList()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			confirmForm(){
				const self = this
				self.$refs["form"].validate((valid)=>{
					if(valid){
						let res = []
						for(let i=0;i<self.payItem.length;i++){
							for(let j=0;j<self.form.type_list.length;j++){
								if(self.payItem[i].id == self.form.type_list[j]){
									res.push(self.payItem[i])
								}
							}
						}
						self.form.type_list = res
						if(self.drawerType == 'add'){
							addAccount(self.form).then(resp=>{
								self.showDrawer = false;
								self.$success("新增成功！");
								self.getList();
							})
						}else{
							self.form.code_id = self.itemId
							console.log(self.itemId,self.form)
							updateAccount(self.itemId,self.form).then(resp=>{
								self.showDrawer = false;
								self.$success("修改成功！");
								self.getList();
							})
						}
					}
				})
			},
			drawerClosed(){
				this.activtion = false
				this.showDrawer = false
				this.form={
					type_list:[],
					name:'',
					priority:null
				}
			},
			getList(){
				getList(this.paging).then(resp=>{
					this.tableData = resp.data.rows
					for(let i=0;i<this.tableData.length;i++){
						this.tableData[i].update_datetime = this.tableData[i].update_datetime.replace('T',' ')
					}
				})
			},
			getInfo(){
				getInfo(this.itemId).then(resp=>{
					// console.log(resp)
					let obj = resp.data.type_list.map((item)=>{
						return  Number(item.pay_code_id)
					})
					this.form.type_list = obj
					this.form.name = resp.data.name
					this.form.priority = resp.data.priority
					// console.log(this.form)
				})
			},
			operation(type,id){
				this.showDrawer = true;
				this.drawerType = type;
				this.itemId = id;
				this.getItem();
				type == 'edit' && this.getInfo()
				type == 'check' && this.getInfo()
				type == 'check' && this.is_activtion()
			}
		},
    created() {
			this.getList()
		},
};
</script>

<style scoped lang="scss">
</style>

