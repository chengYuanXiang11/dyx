<template>
    <div class="app-container">
			<div class="operation" style="position: relative;">
				<el-form :inline="true">
					<el-form-item label="巡更人">
						<el-input v-model="paging.staff__icontains"></el-input>
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
					<el-button @click="reast">重置</el-button>
				</div>
			</div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="巡更中" name="2"></el-tab-pane>
				<el-tab-pane label="已完成" name="3"></el-tab-pane>
			</el-tabs>
			<el-table class="yg-table" :data="tableDate" v-loading="loading">
				<el-table-column label="日期" prop="datetime"></el-table-column>
				<el-table-column label="巡更人" prop="staff"></el-table-column>
				<el-table-column label="路线名称" prop="routine_name"></el-table-column>
				<el-table-column label="巡更点数量" prop="point_count"></el-table-column>
				<el-table-column label="开始时间" prop="start_time"></el-table-column>
				<el-table-column label="结束时间" prop="end_time"></el-table-column>
				<el-table-column label="当前点位" prop="location"></el-table-column>
				<el-table-column label="异常次数" prop="error_count"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="detail(scope.row)">查看</el-button>
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
			<el-dialog
			  title="打卡详情"
			  :visible.sync="dialogVisible"
			  width="50%"
			  :before-close="handleClose">
			  <el-row class="dialog_layout">
					<el-col :span="6">
						巡更点间隔时长:{{details_item.message_detail ? details_item.message_detail.interval_time : ''}}
					</el-col>
					<el-col :span="6">
						每次打卡可提前(分):{{details_item.message_detail ? details_item.message_detail.advance_time : ''}}
					</el-col>
				</el-row>
				<el-row class="dialog_layout">
					<el-col :span="6">
						每次打卡可延后(分):{{details_item.message_detail ? details_item.message_detail.delay_time : ''}}
					</el-col>
					<el-col :span="6">
						打卡前提醒(分):{{details_item.message_detail ? details_item.message_detail.remind : ''}}
					</el-col>
				</el-row>
				<el-table class="yg-table" :data="details_item.message_detail ? details_item.message_detail.other_detail : []">
					<el-table-column label="巡更点" prop="id"></el-table-column>
					<el-table-column label="应打卡时间" prop="clock_time"></el-table-column>
					<el-table-column label="实际打卡时间" prop="exact_time"></el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
							{{scope.row.state == "1" ? '正常' : '不正常'}}
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="remark"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="updateState(scope.$index)" v-if="scope.row.state == '2'">改为正常</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
    </div>
</template>

<script>
import {getList,updataState} from '../../../../request/api/market/watchmanAdmin/task.js'
export default {
    name: "task",
    data() {
        return {
					itemId:'',
					dialogVisible:false,
					loading:false,
					tableDate:[],
					activeName:'2',
          paging: {
          	pageNum: 1,
          	pageSize: 20,
          	total:0,
						state:'2'
          },
					details_item:{}
        };
    },
    methods: {
			updateState(index){
				this.details_item.message_detail.other_detail[index].state = '1';
				updataState(this.details_item,this.itemId).then(resp=>{
					this.$toast("修改成功！");
				})
			},
			detail(item){
				this.dialogVisible = true
				this.details_item = item;
				this.itemId = item.id
			},
			handleClose(){
				this.dialogVisible = false
			},
			getList(){
				this.loading = true
				getList(this.paging).then(resp=>{
					this.tableDate = resp.data.results
					this.paging.total = resp.data.count
				}).finally(error =>{
					this.loading = false
				})
			},
			reast(){
				this.paging.staff = '';
				this.paging.datetime = '';
				this.getList()
			},
			handleClick(){
				this.paging = {
					pageNum: 1,
					pageSize: 20,
					total:0,
					state:'2'
				}
				this.paging.state = this.activeName
				this.getList()
			},
    },
    created() {
        // console.log(this.$route)
				this.getList()
    },
};
</script>

<style scoped lang="scss">
	.dialog_layout{
		margin-bottom: 20px;
	}
</style>

