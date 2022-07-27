<template>
	<Table-page
		:page-size="search.pageSize"
		:total="search.total"
		:page-num="search.pageNum"
		:searchForm="search.form"
		@pagination="handlePagination"
		@search="handleSearch"
	>
	<template slot="action-bar">
		<el-button
		    v-hasPermi="['permission:role:post']"
		    type="primary"
		    icon="el-icon-plus"
		    @click="operation('add')"
		    >新增</el-button>
	</template>
	<el-table class="yg-table" :data="tableData" height="100%">
		<el-table-column label="活动名称" prop="activityName"/>
		<el-table-column label="规则">
			<template slot-scope="scope">
				<!-- {{scope.row.activityRules}} -->
				<span v-for="(item,index) in scope.row.activityRules" :key="'row' + index">
					{{'当前充值金额≥'+item.rechargeAmount+'时,赠送'+ item.presentedMoney }}</br>
				</span>
			</template>
		</el-table-column>
		<el-table-column label="商户数量" prop="merchantNum"/>
		<el-table-column label="可参加次数" prop="participationNum"/>
		<el-table-column label="开始时间" prop="startTime"/>
		<el-table-column label="结束时间" prop="stopTime"/>
		<el-table-column label="状态" prop="activityStatus"/>
		<el-table-column label="操作">
			<template slot-scope="scope">
				<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
				<el-button type="text" @click="del(scope.row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<Drawer
		:visible.sync="showDrawer"
		:title="(drawerType == 'add' ? '新建' : '编辑')"
		@confirm="confirmForm"
		@closed="drawerClosed"
	>
		<el-form :model="form" ref="form" :rules="rules" label-width="100px">
			<el-form-item label="活动名称" prop="activityName">
				<el-input v-model="form.activityName" placeholder="请输入活动名称"></el-input>
			</el-form-item>
			<el-form-item label="开始时间" prop="startTime">
				<el-date-picker
					v-model="form.startTime"
					type="date"
					value-format="yyyy-M-d"
					placeholder="选择开始日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" prop="stopTime">
				<el-date-picker
					v-model="form.stopTime"
					type="date"
					value-format="yyyy-M-d"
					placeholder="选择开始日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="商户范围" prop="businessScope">
				<el-input v-model="form.businessScope.merchant"></el-input>
			</el-form-item>
			<el-form-item label="可参加次数" prop="participationNum">
				<el-input-number v-model="form.participationNum" :min="0"></el-input-number>
			</el-form-item>
			<el-form-item label="活动规则">
				</br>
				<div class="rule-layout" v-for="(item,index) in form.activityRules" :key="index">
					<h5>当</h5>
					<el-form-item label="充值金额≥" prop="rechargeAmount" 
					:prop="'activityRules.' + index + '.rechargeAmount'" 
					:rules="[{ required: true, message: '请填写充值金额', trigger: 'blur' }]"
					style="margin-bottom: 20px;"
					>
						<el-input
							size="mini"
							placeholder="请输入充值金额"
							v-model="item.rechargeAmount">
							<i slot="suffix">元</i>
						</el-input>
					</el-form-item>
					<el-form-item label="赠送" 
					:prop="'activityRules.' + index + '.presentedMoney'" 
					:rules="[{ required: true, message: '请填写赠送金额', trigger: 'blur' }]"
					style="margin-bottom: 20px;"
					>
						<el-input
							size="mini"
							placeholder="请输入赠送金额"
							v-model="item.presentedMoney">
							<i slot="suffix">元</i>
						</el-input>
					</el-form-item>
				</div>
				<el-button type="text" @click="addrule">+ 添加规则</el-button>
			</el-form-item>
		</el-form>
	</Drawer>
	</Table-page>
</template>

<script>
import { addRecharge,getList,delRecharge,getInfo,updateRecharge } from '@/request/api/financial/income/recharge/recharge.js'
export default{
	data(){
		return{
			queryParams:{},
			search: {
			    pageNum: 1,
			    pageSize: 10,
			    total: 0,
			},
			form:{
				activityRules:[{rechargeAmount:'',presentedMoney:''}],
				businessScope:{merchant:'all',purchaser:'all',tempMerchant:'all'}
			},
			rules:{
				activityName:[{required: true, message: '请填写活动名称', trigger: 'blur'}],
				startTime:[{required: true, message: '请选择开始时间', trigger: 'blur'}],
				stopTime:[{required: true, message: '请选择结束时间', trigger: 'blur'}],
				businessScope:[{required: true, message: '请选择商户范围', trigger: 'blur'}],
				participationNum:[{required: true, message: '请设置可参加次数', trigger: 'blur'}]
			},
			itemId:'',
			drawerType:'',
			btnLoading:false,
			showDrawer:false,
			loading:false,
			tableData:[],
			paging:{
				pageNum:1,
				pageSize:20,
				total:0
			}
		}
	},
	methods:{
		// 分页方法
		handlePagination(e) {
		    this.search.pageNum = e.pageNum;
		    this.getList();
		},
		// 搜索方法
		handleSearch(e) {
		    this.queryParams = e;
		    this.search.pageNum = 1;
		    this.getList();
		},
		addrule(){//添加规则
		// console.log(111)
			this.form.activityRules.push({
				rechargeAmount:'',
				presentedMoney:''
			})
		},
		//删除
		del(id){
			 this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delRecharge(id).then(resp=>{
						this.$error('删除成功！');
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
			self.$refs['form'].validate((valid)=>{
				if(valid){
					let res = self.form
					if(this.drawerType == 'add'){
						addRecharge(res).then(resp=>{
							self.$success('新增成功！');
							self.showDrawer = false;
							self.getList();
						})
					}else{
						updateRecharge(self.itemId,res).then(resp=>{
							self.$success('修改成功！');
							self.showDrawer = false;
							self.getList();
						})
					}
				}
			})
		},
		drawerClosed(){
			this.showDrawer = false;
			this.form={
				activityRules:[{rechargeAmount:'',presentedMoney:''}],
				businessScope:{merchant:'all',purchaser:'all',tempMerchant:'all'}
			}
		},
		operation(type,id){
			this.showDrawer = true;
			this.itemId = id;
			this.drawerType = type;
			type == 'edit' && this.getInfo()
		},
		getInfo(){
			getInfo(this.itemId).then(resp=>{
				// console.log(resp)
				this.form = resp.data
			})
		},
		getList(){
			getList(this.queryFormat(this.queryParams, this.search)).then(resp=>{
				// console.log(resp)
				this.tableData = resp.data.results
				this.search.total = resp.data.count
			})
		}
	},
	created() {
		this.getList()
	}
}
</script>

<style scoped lang="scss">
	.rule-layout{
		border: 1px solid #909399;
		padding: 10px 15px;
		border-radius: 4px;
		margin-bottom: 15px;
	}
</style>
