<template>
		<Table-page
		:page-size="search.pageSize"
		:total="search.total"
		:page-num="search.pageNum"
		@pagination="handlePagination"
		@search="handleSearch"
		>
			<template slot="action-bar">
				<el-button type="primary" @click="operation('add')" v-hasPermi="['123456']">新增</el-button>
			</template>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="货车进出费" name="carcost"></el-tab-pane>
				<el-tab-pane label="商品交易费" name="commoditycost" :disabled="true"></el-tab-pane>
			</el-tabs>
			<el-table class="yg-table" :data="tableData" v-loading="loading">
				<el-table-column label="名称" prop="inOutFeeName"></el-table-column>
				<el-table-column label="规则类型" prop="rulesType">
					<template slot-scope='scope'>
						{{scope.row.rulesType == '1' ? '单品' : '混合'}}
					</template>
				</el-table-column>
				<el-table-column label="费用类型" prop="dealType">
					<template slot-scope='scope'>
						{{scope.row.dealType == '1' ? '采购' : '销售'}}
					</template>
				</el-table-column>
				<el-table-column label="金额(元/KG)" prop="chargeAmount"></el-table-column>
				<el-table-column label="生效时间" prop="effectTime"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="operation('edit',scope.row.id,scope.row.inOutFeeName)">编辑</el-button>
						<el-button type="text" v-if="scope.row.defaultRule == '0'" @click="del(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Drawer
				:visible.sync="showDrawer"
				v-loading="loading"
				element-loading-text="拼命加载中"
				:title="(drawerType == 'add' ? '新建' : '编辑')"
				:before-close="beforeClose"
				@confirm="confirmForm"
			>
				<el-form :model="form" :rules="rules" ref="form" label-width="100px">
					<el-form-item label="交易类型:" prop="dealType">
						<el-radio v-model="form.dealType" label="1">销售</el-radio>
						<el-radio v-model="form.dealType" label="2">采购</el-radio>
					</el-form-item>
					<el-form-item label="规则类型:" prop="rulesType">
						<el-radio v-model="form.rulesType" label="1">单品</el-radio>
						<el-radio v-model="form.rulesType" label="2">混合</el-radio>
					</el-form-item>
					<el-form-item label="名称:" prop="inOutFeeName">
						<el-input v-model="form.inOutFeeName"></el-input>
					</el-form-item>
					<el-form-item label="商品类别:" prop="goodsInfo">
						<GoodsSelect v-model="form.goodsInfo"></GoodsSelect>
					</el-form-item>
					<el-form-item label="收费金额:" prop="chargeAmount">
						<el-input
							placeholder=""
							v-model="form.chargeAmount">
							<i slot="suffix">元/KG</i>
						</el-input>
					</el-form-item>
					<el-form-item label="适用用户:" prop="businessScope">
						<!-- <select-users v-model="form.businessScope" type="all" :multiple="true"></select-users> -->
						<el-input v-model="form.businessScope.merchant"></el-input>
					</el-form-item>
					<el-form-item label="生效时间:" prop="effectTime">
						<el-date-picker
							v-model="form.effectTime"
							type="datetime"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
				</el-form>
			</Drawer>
			<Drawer
				:visible.sync="showQita"
				v-loading="loading"
				element-loading-text="拼命加载中"
				title="其他"
				:before-close="beforeCloseQita"
				@confirm="confirmFormQita"
			>
				<el-form :model="formQita" :rules="rulesQita" ref="formQita" label-width="100px">
					<el-form-item label="交易类型:">{{formQita.dealType == '1' ? '销售' : '采购'}}</el-form-item>
					<el-form-item label="规则类型:">{{formQita.rulesType == '1' ? '单品' : '混合'}}</el-form-item>
					<el-form-item label="名称:">{{formQita.inOutFeeName}}</el-form-item>	
					<el-form-item label="适用用户:">{{'所有'}}</el-form-item>
					<el-form-item label="收费金额:" prop="chargeAmount">
						<el-input
							placeholder=""
							v-model="formQita.chargeAmount">
							<i slot="suffix">元/KG</i>
						</el-input>
					</el-form-item>
				</el-form>
			</Drawer>
		</Table-page>
		
</template>

<script>
import { getList,addFee,delFee,getInfo,updateFee } from '@/request/api/financial/income/transactionFee/transactionFee.js'
export default {
    name: "transactionFee",
    data() {
        return {
					queryParams:{},
					search: {
						pageNum: 1,
						pageSize: 10,
						total: 100,
						isOpen: false,
					},
					formQita:{},
					rulesQita:{
						chargeAmount:[{required: true, message: '请输入收费金额', trigger: 'blur'}],
					},
					form:{
						businessScope:{
						    merchant:'all',
						    purchaser:'all',
								purchaser:'all'
						},
						rulesType:'1',
						dealType:'1',
						goodsInfo:[]
					},
					rules:{
						dealType:[{required: true, message: '请选择费用类型', trigger: 'blur'}],
						rulesType:[{required: true, message: '请选择规则类型', trigger: 'blur'}],
						inOutFeeName:[{required: true, message: '请输入名称', trigger: 'blur'}],
						goodsInfo:[{required: true, message: '请选择商品类别', trigger: 'blur'}],
						chargeAmount:[{required: true, message: '请输入收费金额', trigger: 'blur'}],
						businessScope:[{required: true, message: '请选择适用用户', trigger: 'blur'}],
						effectTime:[{required: true, message: '请选择生效时间', trigger: 'blur'}]
					},
					activeName:'carcost',
					btnLoading:false,
					itemId:'',
					drawerType:'',
					showDrawer:false,
					showQita:false,
					paging:{
						pageNum:1,
						pageSize:20,
						total:0
					},
					loading:false,
          tableData:[]
        };
    },
    methods: {
			del(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									delFee(id).then(resp=>{
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
			handleReset(e) {
				this.$info(`触发重置方法，表单值：${JSON.stringify(e)}`);
			},
			handlePagination(e) {
				this.search.pageSize = e.pageSize;
				this.search.pageNum = e.pageNum;
				this.search.pageSize = e.pageSize;
				this.getList();
			},
			handleSearch(e) {
				this.queryParams = e;
				this.search.pageNum = 1;
				this.getList();
			},
			confirmFormQita(){
				const self = this
				updateFee(self.itemId,self.formQita).then(resp=>{
					self.$success('修改成功！');
					self.showQita = false;
					self.getList();
				})
			},
			beforeCloseQita(){
				this.showQita=false
				this.formQita={}
			},
			handleClick(){//tabs标签页切换
			
			},
			getInfo(){
				getInfo(this.itemId).then(resp=>{
					this.form = resp.data
					// console.log(this.form)
				})
			},
			getQita(){
				getInfo(this.itemId).then(resp=>{
					this.formQita = resp.data
					// console.log(this.formQita)
				})
			},
			confirmForm(){
				const self = this
				self.$refs['form'].validate((valid)=>{
					if(valid){
						if(self.drawerType == 'add'){
							addFee(self.form).then(resp=>{
								self.$success('新增成功！');
								self.showDrawer = false;
								self.getList();
								self.form = {
									businessScope:{
									    merchant:'all',
									    purchaser:'all',
											purchaser:'all'
									},
									costtype:'1',
									rulesType:'1',
									dealType:'1',
									goodsInfo:[]
								}
							})
						}else{
							updateFee(self.itemId,self.form).then(resp=>{
								self.$success('修改成功！');
								self.showDrawer = false;
								self.getList();
							})
						}
					}
				})
			},
			beforeClose(){
				this.showDrawer=false,
				this.form = {
						businessScope:{
						    merchant:'all',
						    purchaser:'all',
								purchaser:'all'
						},
						costtype:'1',
						rulesType:'1',
						dealType:'1',
						goodsInfo:[]
				}
			},
			getList(){
				getList(this.queryFormat(this.queryParams, this.search)).then(resp=>{
					this.tableData = resp.data.results,
					this.search.total = resp.data.count
					console.log(resp)
				})
			},
			operation(type,id,name){
				this.drawerType = type
				this.itemId = id
				if(name != '其他'){
					this.showDrawer = true
					type == 'edit' && this.getInfo()
				}else{
					this.showQita = true
					this.getQita()
				}
			}
    },
    created() {
        // console.log(this.$route)
				this.getList()
    },
};
</script>

<style scoped lang="scss">
</style>

