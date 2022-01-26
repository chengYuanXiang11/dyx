<template>
	<div class="app-container">
		<el-row>
			<el-col :span="20">
				<el-form :inline="true">
					<el-form-item label="商户名称">
						<el-input v-model="queryform.username"></el-input>
					</el-form-item>
					<el-form-item label="缴费时间">
						<el-date-picker
							v-model="queryform.time"
							type="datetime"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="4">
				<el-button type="primary">搜索</el-button>
				<el-button>重置</el-button>
			</el-col>
		</el-row>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="充值" name="chongzhi"></el-tab-pane>
			<el-tab-pane label="交易费" name="jiaoyifei"></el-tab-pane>
			<el-tab-pane label="租金" name="zujin"></el-tab-pane>
			<el-tab-pane label="保证金" name="baozhengjin"></el-tab-pane>
			<el-tab-pane label="电费" name="dianfei"></el-tab-pane>
			<el-tab-pane label="水费" name="shuifei"></el-tab-pane>
			<el-tab-pane label="其它费用" name="qitafeiyong"></el-tab-pane>
			<el-tab-pane label="额外费用" name="ewaifeiyong"></el-tab-pane>
		</el-tabs>
		<el-table class="yg-table" :data="tableData" v-loading="loading">
			<el-table-column label="商户名称" prop="username" :key="1"></el-table-column>
			<el-table-column label="账户充值" prop="zhuanghuchongzhi" v-if="activeName == 'chongzhi'" :key="2"></el-table-column>
			<el-table-column label="赠送" prop="zengsong" v-if="activeName == 'chongzhi'" :key="3"></el-table-column>
			<el-table-column label="电费充值" prop="dianfeichongzhi" v-if="activeName == 'chongzhi'" :key="4"></el-table-column>
			<el-table-column label="水费充值" prop="shuifeichongzhi" v-if="activeName == 'chongzhi'" :key="5"></el-table-column>
			<el-table-column label="账户余额" prop="zhanghuyue" v-if="activeName == 'chongzhi'" :key="6"></el-table-column>
			<el-table-column label="电费余额" prop="dianfeiyue" v-if="activeName == 'chongzhi'" :key="7"></el-table-column>
			<el-table-column label="水费余额" prop="shuifeiyue" v-if="activeName == 'chongzhi'" :key="8"></el-table-column>
			<el-table-column label="充值方式" prop="chongzhifangshi" v-if="activeName == 'chongzhi'" :key="9"></el-table-column>
			<el-table-column label="支付方式" prop="zhifufangshi" v-if="activeName == 'chongzhi'" :key="10"></el-table-column>
			<el-table-column label="时间" prop="shijian" v-if="activeName == 'chongzhi'" :key="11"></el-table-column>
			<el-table-column label="费用名称" prop="feiyongmingcheng" v-if="activeName == 'qitafeiyong' || activeName == 'ewaifeiyong'" :key="12"></el-table-column>
			<el-table-column label="商位编号" prop="shangweibianhao" v-if="activeName != 'chongzhi' && activeName != 'ewaifeiyong'" :key="13"></el-table-column>
			<el-table-column label="缴费金额(元)" prop="jiaofeijine" v-if="activeName != 'chongzhi'" :key="14"></el-table-column>
			<el-table-column label="缴费时间" prop="jiaofeishijian" v-if="activeName != 'chongzhi'" :key="15"></el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tableData:[{
				username:'水果店',
				zhuanghuchongzhi:100,
				zengsong:50,
				dianfeichongzhi:100,
				shuifeichongzhi:100,
				zhanghuyue:100,
				dianfeiyue:100,
				shuifeiyue:100,
				chongzhifangshi:'支付宝',
				zhifufangshi:'微信',
				shijian:'2022-01-01',
				feiyongmingcheng:'保护费',
				shangweibianhao:'A1952',
				jiaofeijine:10000,
				jiaofeishijian:'2022-01-01'
			},{
				username:'水果店',
				zhuanghuchongzhi:100,
				zengsong:50,
				dianfeichongzhi:100,
				shuifeichongzhi:100,
				zhanghuyue:100,
				dianfeiyue:100,
				shuifeiyue:100,
				chongzhifangshi:'支付宝',
				zhifufangshi:'微信',
				shijian:'2022-01-01',
				feiyongmingcheng:'保护费',
				shangweibianhao:'A1952',
				jiaofeijine:10000,
				jiaofeishijian:'2022-01-01'
			},{
				username:'水果店',
				zhuanghuchongzhi:100,
				zengsong:50,
				dianfeichongzhi:100,
				shuifeichongzhi:100,
				zhanghuyue:100,
				dianfeiyue:100,
				shuifeiyue:100,
				chongzhifangshi:'支付宝',
				zhifufangshi:'微信',
				shijian:'2022-01-01',
				feiyongmingcheng:'保护费',
				shangweibianhao:'A1952',
				jiaofeijine:10000,
				jiaofeishijian:'2022-01-01'
			}],
			loading:false,
			activeName:'chongzhi',
			queryform:{}
		};
	},
	methods: {
		handleClick(){},
	},
	created() {
			// console.log(this.$route)
	},
};
</script>

<style scoped lang="scss">
</style>

