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
		<el-tabs v-model="order_type" type="card" @tab-click="handleClick">
			<el-tab-pane label="充值" name="0"></el-tab-pane>
			<el-tab-pane label="交易费" name="1"></el-tab-pane>
			<el-tab-pane label="租金" name="2"></el-tab-pane>
			<el-tab-pane label="保证金" name="3"></el-tab-pane>
			<el-tab-pane label="电费" name="4"></el-tab-pane>
			<el-tab-pane label="水费" name="5"></el-tab-pane>
			<!-- <el-tab-pane label="其他费用" name="6"></el-tab-pane>
			<el-tab-pane label="额外费用" name="7"></el-tab-pane> -->
		</el-tabs>
		<el-table class="yg-table" border :data="tableDataQT" height="100%" v-if="order_type != '0'">
			<el-table-column label="订单编号" prop="order_number"></el-table-column>
			<el-table-column label="费用名称" prop="order_number" v-if="order_type == '6' || order_type == '7'"></el-table-column>
			<el-table-column label="商户名称" prop="pay_merchant_name"></el-table-column>
			<el-table-column label="商位号" prop="location_num"></el-table-column>
			<el-table-column label="金额" prop="order_payamount"></el-table-column>
			<el-table-column label="支付方式" prop="derules_name" v-if="order_type == '1'"></el-table-column>
			<el-table-column label="对应账户" prop="derules_name"></el-table-column>
			<el-table-column label="交易编号" prop="order_paytime" v-if="order_type == '1'"></el-table-column>
			<el-table-column label="时间" prop="order_paytime"></el-table-column>
		</el-table>
		<el-table class="yg-table" border :data="tableData" height="100%" v-if="order_type == '0'">
			<el-table-column label="订单编号" prop="order_number"></el-table-column>
			<el-table-column label="交易编号" prop="transaction_num"></el-table-column>
			<el-table-column label="商户名称" prop="merchant_name"></el-table-column>
			<el-table-column label="充值账户" prop="recharge_account"></el-table-column>
			<el-table-column label="充值金额" prop="recharge_money"></el-table-column>
			<el-table-column label="充值方式" prop="recharge_type">
				<template slot-scope="scope">
					{{scope.row.recharge_type == '1' ? '柜台充值' : '手机充值'}}
				</template>
			</el-table-column>
			<el-table-column label="支付方式" prop="payment"></el-table-column>
			<el-table-column label="时间" prop="create_datetime"></el-table-column>
		</el-table>
	</Table-page>
</template>

<script>
import { getListTP,getList } from '@/request/api/financial/income/tradingrecord/index.js'
export default {
	data() {
		return {
			tableDataQT:[],
			tableData:[],
			order_type:'0',
			queryParams:{},
			search: {
			    pageNum: 1,
			    pageSize: 10,
			    total: 0,
			    form: [
						{
						    name: "order_number",
						    label: "订单编号",
						    type: "input",
						},
						{
						    name: "transaction_num",
						    label: "交易编号",
						    type: "input",
						},
			        {
			            name: "merchant_name",
			            label: "商户名称",
			            type: "input",
			        },
							{
							    name: "create_datetime",
							    label: "缴费时间",
							    type: "datetime",
							}
			    ],
			},
		};
	},
	methods: {
		//充值接口
		getTP(){
			getListTP(this.queryFormat(this.queryParams, this.search)).then(resp=>{
				this.tableData = resp.data.results
				this.search.total = resp.data.count
			})
		},
		////租金，保证金，电费，水费，其他费用，额外费用记录查询接口
		getQT(){
			getList(this.queryFormat(this.queryParams, this.search),this.order_type).then(resp=>{
				this.tableDataQT = resp.data.results
				this.search.total = resp.data.count
				console.log(resp)
			})
		},
		getList(){
			if(this.order_type == '0'){
				this.getTP()
			}else if(this.order_type == '1'){
				console.log('交易费暂无')
			}else {
				this.getQT()
			}
		},
		//标签页切换
		handleClick(tab, event){
			this.getList()
		},
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
	},
	created() {
		this.getList()
	},
};
</script>

<style scoped lang="scss">
</style>

