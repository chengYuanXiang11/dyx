<template>
	<div class="app-container">
		<el-button type="primary" @click="operation('add')" style="margin-bottom: 15px;">新建</el-button>
		<el-table class="yg-table" :data="tableData" v-loading="loading">
			<el-table-column label="账户名称" prop="account_name"></el-table-column>
			<el-table-column label="开户银行" prop="bank_account_name"></el-table-column>
			<el-table-column label="银行账号" prop="account_number"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text" style="color: red;" @click="del(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination
		    v-show="paging.total > 0"
		    :total="paging.total"
		    :page.sync="paging.pageNum"
		    :limit.sync="paging.pageSize"
		    @pagination="getList"
		/>
		<!-- 新建编辑窗口 -->
		<Yg-Drawer 
			v-model="showDrawer"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			@confirm="confirmForm"
			@closed="drawerClosed"
			@cancel="drawerClosed"
			:confirmLoading="btnLoading"
		>
			<el-form :model="form" ref="form" :rules="rules" label-width="100px">
				<el-form-item label="账户名称" prop="account_name">
					<el-input v-model="form.account_name"></el-input>
				</el-form-item>
				<el-form-item label="开户银行" prop="bank_account_name">
					<el-input v-model="form.bank_account_name"></el-input>
				</el-form-item>
				<el-form-item label="银行账号" prop="account_number">
					<el-input v-model="form.account_number"></el-input>
				</el-form-item>
				<el-form-item label="账户类型" prop="account_type">
					<el-checkbox-group v-model="form.account_type">
						<el-checkbox 
						v-for="(item,index) in Paymanage" 
						:label="item.id"  
						:key="'payee' + index" 
						@change="isbinding(item.id)">
						{{item.label}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="付款类型" prop="pay_type">
					<el-checkbox-group v-model="form.pay_type">
						<el-checkbox :label="1">付款</el-checkbox>
						<el-checkbox :label="2">报销</el-checkbox>
						<el-checkbox :label="3">备用金</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
import {getList,getType,addBank,delBank,getInfo,updateBank} from '../../../request/api/financial/bankAccount/bankAccount.js'
export default {
	data() {
		return {
			Paymanage:[],
			form:{
				pay_type:[],
				account_type: []
			},
			rules:{ 
				account_name:[{ required: true, message: '请输入账户名称', trigger: 'blur' }],
				bank_account_name:[{ required: true, message: '请输入开户银行', trigger: 'blur' }],
				account_number:[{ required: true, message: '请输入银行账号', trigger: 'blur' }],
				pay_type:[{ required: true, message: '请选择付款类型', trigger: 'change' }]
			},
			btnLoading:false,
			showDrawer:false,
			drawerType:'',
			itemId:'',
			tableData:[],
			loading:false,
			paging:{
				pageNum:1,
				pageSize:20,
				total:0
			}
		};
	},
	methods: {
		getInfo(){
			getInfo(this.itemId).then(resp=>{
				this.form = resp.data
				// console.log(this.form)
			})
		},
		isbinding(msg){
			const self = this
			let res = {type_id:msg}
			getType(res).then(resp=>{
				console.log(resp)
				if(resp.data != '暂无绑定该付款类型的账户'){
					self.$confirm(`<strong>是否确定此账户为充值收款账户</strong><p>当前充值收款账户为:${resp.data.account_name}</p>`, "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							dangerouslyUseHTMLString: true,
							type: "warning",
						}).then(() => {
								self.$toast("设置成功！");
						}).catch(()=>{
								let arr = self.form.account_type
								for(let i=0;i<arr.length;i++){
									if(arr[i] == msg){
										self.form.account_type.splice(i,1)
									}
								}
						});
				}
			})
		},
		del(id){
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			  }).then(() => {
			    delBank(id).then((res) => {
			      self.$toast("删除成功！");
						this.getList()
			    });
			  });
		},
		confirmForm(){
			let self = this
			self.$refs["form"].validate((valid)=>{
				if(valid){
					if(self.drawerType == 'add'){
						// console.log(self.form)
						addBank(self.form).then(resp=>{
							self.showDrawer = false;
							self.$toast("新增成功！");
							self.getList();
						})
					}else{
						console.log(self.form)
						updateBank(self.form,self.itemId).then(resp=>{
							self.showDrawer = false;
							self.$toast("修改成功！");
							self.getList();
						})
					}
				}
			})
		},
		drawerClosed(){
			this.showDrawer = false;
			(this.form={
				pay_type:[],
				account_type: []
			}),
			this.resetForm("form");
		},
		getList(){
			getList(this.paging).then(resp=>{
				this.tableData = resp.data.results;
				this.paging.total = resp.data.count;
			})
		},
		operation(type,id){
			this.showDrawer = true;
			this.itemId = id;
			this.drawerType = type;
			type == 'edit' && this.getInfo()
		}
	},
	created() {
		this.getList()
		this.getDicts("Paymanage").then((response) => {
		    this.Paymanage = response.data;
			// console.log(this.Paymanage)
		});
	},
};
</script>

<style scoped lang="scss">
</style>

