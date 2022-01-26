<template>
	<div class="app-container">
		<div class="operation" style="position: relative;">
			<el-form :inline="true">
				<el-form-item label="巡更人">
					<el-input v-model="paging.seek_staff__username__icontains"></el-input>
				</el-form-item>
				<el-form-item label="日期">
					<el-date-picker
						v-model="paging.datetime__icontains"
						type="date"
						value-format="yyyy-M-d"
						placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div style="position: absolute; right: 50px;">
				<el-button type="primary" @click="getList()">查询</el-button>
				<el-button @click="reset">重置</el-button>
			</div>
		</div>
		<el-table :data="tableData" class="yg-table" v-loading="loading">
			<el-table-column label="日期" prop="datetime"></el-table-column>
			<el-table-column label="巡更人" prop="seek_staff"></el-table-column>
			<el-table-column label="巡更次数" prop="seek_round"></el-table-column>
			<el-table-column label="正常/次" prop="normal_round"></el-table-column>
			<el-table-column label="漏卡/次" prop="abnormal_round"></el-table-column>
			<el-table-column label="提前打卡/次" prop="advance_round"></el-table-column>
			<el-table-column label="超时打卡/次" prop="delay_round"></el-table-column>
		</el-table>
		<pagination
			:total="paging.total"
			:page.sync="paging.pageNum"
			:limit.sync="paging.pageSize"
			@pagination="getList"
		/>
	</div>
</template>

<script>
import {getList} from '../../../../request/api/market/watchmanAdmin/total.js'
export default {
    data() {
        return {
					loading:false,
					tableData:[],
          paging:{
						pageNum: 1,
						pageSize: 20,
						total:0
					}
        };
    },
    methods: {
			getList(){
				getList(this.paging).then(resp=>{
					// console.log(resp)
					this.tableData = resp.data.results
					this.paging.total = resp.data.count
				})
			},
			reset(){
				this.paging = {
					pageNum: 1,
					pageSize: 20,
					total:0
				}
				this.getList()
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

