<template>
	<div class="app-container">
		<div class="operation" style="float: right;">
			<el-select v-model="querySelect" placeholder="请选择">
				<el-option label="全公司" value="全公司"></el-option>
				<el-option value="选择部门或人员">
					<template>
						<span @click="selectUsers">选择部门或人员</span>
					</template>
				</el-option>
			</el-select>
			<!-- 选人 -->
			<SelectUsersDialog :visible.sync="showDialog" :data="datas" model="user" :multiple="false"
				placeholder="请选择人员" @confirm="getDatas"></SelectUsersDialog>
		</div>
		<el-table :data="dataList" style="width: 100%" class="yg-table">
			<el-table-column label="姓名" prop="vacationcheck_username"></el-table-column>
			<el-table-column label="部门" prop="vacationcheck_deptname"></el-table-column>
			<el-table-column min-width="180" v-for="(col,index) in cols" :key="index">
				<template slot="header">
					<span>{{formatTableHeader(col)}}</span>
				</template>
				<template slot-scope="scope">
					<span v-if="scope.row[col.prop] == 'none'">未分配</span>
					<span v-else-if="scope.row[col.prop] == 'notlimit'">不限额</span>
					<u @click="toDetail(scope.row.id,col.label)" v-else>{{scope.row[col.prop]}}</u>
				</template>
			</el-table-column>
		</el-table>
		<!-- 		    v-show="pagings.total > 0" -->
		<pagination :total="pagings.total" :page.sync="pagings.pageNum" :limit.sync="pagings.pageSize"
			@pagination="getList" :pageSizes="[10]" />
	</div>
</template>

<script>
	import {
		getList
	} from '../../../../request/api/personnel/checking/holidayQuery.js'
	export default {
		name: "holidayQuery",
		data() {
			return {
				pagings: {
					total: 0,
					pageNum: 1,
					pageSize: 10
				},
				datas: {}, //选择人员
				showDialog: false,
				querySelect: '', //查询项
				dataList: [],
				//表头
				cols: [],
			};
		},
		created() {
			this.getList()
		},
		methods: {
			formatTableHeader(item) {
				let str = '';
				if (item.unit_time == '1') {
					str = "小时";
				} else if (item.unit_time == '2') {
					str = "半天";
				} else {
					str = "天";
				}
				return `${item.label}(${str})`;
			},
			//获取列表
			getList() {
				getList(this.pagings).then(resp => {
					console.log(resp.data.results)
					this.cols = resp.data.results.cols
					this.dataList = resp.data.results.dataList
					this.pagings.total = resp.data.count
				})
			},
			//跳转详情
			toDetail(id, type) {
				// console.log(id,type)
				this.$router.push({
					path: "/holidayquerylog",
					query: {
						id: id,
						type: type
					}
				});
			},
			// 选人组件
			selectUsers() {
				this.showDialog = true;
			},
			getDatas(e, close) {
				this.datas = e
				close()
			},
		},
	};
</script>
<style scoped>
	.Issue_date /deep/ .el-select {
		width: 100px;
	}

	.Issue_date /deep/ .el-form-item__content {
		margin-left: 0px !important;
	}

	.errorTips /deep/.el-form-item__error {
		left: 25% !important;
	}

	.errorTips1 /deep/.el-form-item__error {
		left: 7% !important;
	}

	p {
		color: #ccc;
	}

	.span_margin {
		margin-left: 10px;
	}
</style>
