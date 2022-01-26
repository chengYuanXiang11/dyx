<template>
	<div class="app-container">
		<el-button type="primary" @click="operation('add')" style="margin-bottom: 15px;">新建</el-button>
		<el-table class="yg-table" :data="tableData" v-loading="loading">
			<el-table-column label="活动名称" prop="hongdongmingcheng"/>
			<el-table-column label="规则" prop="guize"/>
			<el-table-column label="商户数量" prop="shuliang"/>
			<el-table-column label="可参加次数" prop="cishu"/>
			<el-table-column label="开始时间" prop="kaishishijian"/>
			<el-table-column label="结束时间" prop="jieshushijian"/>
			<el-table-column label="状态" prop="zhuangtai"/>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text">删除</el-button>
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
		<!-- 抽屉 -->
		<Yg-Drawer
			v-model="showDrawer"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			@confirm="confirmForm"
			@closed="drawerClosed"
			@cancel="drawerClosed"
			:confirmLoading="btnLoading"
		>
			<el-form :model="form" ref="form" :rules="rules" label-width="100px">
				<el-form-item label="活动名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" prop="s_time">
					<el-date-picker
						v-model="form.s_time"
						type="date"
						value-format="yyyy-M-d"
						placeholder="选择开始日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="e_time">
					<el-date-picker
						v-model="form.e_time"
						type="date"
						value-format="yyyy-M-d"
						placeholder="选择开始日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="商户范围" prop="userscope">
					<el-input v-model="form.userscope" placeholder="请选择商户范围"></el-input>
				</el-form-item>
				<el-form-item label="可参加次数" prop="count">
					<el-input-number v-model="form.count" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="活动规则">
					</br>
					<div class="rule-layout" v-for="(item,index) in form.rule" :key="index">
						<h5>当</h5>
						<el-form-item label="充值金额≥" prop="money" 
						:prop="'rule.' + index + '.money'" 
						:rules="[{ required: true, message: '请填写充值金额', trigger: 'blur' }]"
						style="margin-bottom: 20px;"
						>
							<el-input
								size="mini"
								placeholder="请输入充值金额"
								v-model="item.money">
								<i slot="suffix">元</i>
							</el-input>
						</el-form-item>
						<el-form-item label="赠送" 
						:prop="'rule.' + index + '.give'" 
						:rules="[{ required: true, message: '请填写赠送金额', trigger: 'blur' }]"
						style="margin-bottom: 20px;"
						>
							<el-input
								size="mini"
								placeholder="请输入赠送金额"
								v-model="item.give">
								<i slot="suffix">元</i>
							</el-input>
						</el-form-item>
					</div>
					<el-button type="text" @click="addrule">+ 添加规则</el-button>
				</el-form-item>
				<el-form-item label="">
					
				</el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
export default{
	data(){
		return{
			form:{
				rule:[{money:'',give:''}]
			},
			rules:{
				name:[{required: true, message: '请填写活动名称', trigger: 'blur'}],
				s_time:[{required: true, message: '请选择开始时间', trigger: 'blur'}],
				e_time:[{required: true, message: '请选择结束时间', trigger: 'blur'}],
				userscope:[{required: true, message: '请选择商户范围', trigger: 'blur'}],
				count:[{required: true, message: '请设置可参加次数', trigger: 'blur'}]
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
		addrule(){//添加规则
		// console.log(111)
			this.form.rule.push({
				money:'',
				give:''
			})
		},
		confirmForm(){
			const self = this
			self.$refs['form'].validate((valid)=>{
				if(valid){
					console.log('验证通过')
				}else{
					console.log('验证失败')
				}
			})
		},
		drawerClosed(){
			this.showDrawer = false;
			(this.form={
				rule:[{money:'',give:''}]
			}),
			this.resetForm("form");
		},
		operation(type,id){
			this.showDrawer = true;
			this.itemId = id;
			this.drawerType = type;
			type == 'edit' && this.getInfo()
		},
		getInfo(){},
		getList(){
			let obj=[
				{
					id:1,
					hongdongmingcheng:'测试名1',
					guize:'测试规则1',
					shuliang:'测试数量1',
					cishu:'测试次数1',
					kaishishijian:'测试开始时间1',
					jieshushijian:'测试结束时间1',
					zhuangtai:'测试状态1'
				},
				{
					id:2,
					hongdongmingcheng:'测试名2',
					guize:'测试规则2',
					shuliang:'测试数量2',
					cishu:'测试次数2',
					kaishishijian:'测试开始时间2',
					jieshushijian:'测试结束时间2',
					zhuangtai:'测试状态2'
				},
				{
					id:3,
					hongdongmingcheng:'测试名3',
					guize:'测试规则3',
					shuliang:'测试数量3',
					cishu:'测试次数3',
					kaishishijian:'测试开始时间3',
					jieshushijian:'测试结束时间3',
					zhuangtai:'测试状态3'
				}
			]
			this.tableData = obj
			this.paging.total = obj.length
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
