<template>
    <div class="app-container">
			
			<el-form :inline="true">
				<el-form-item label="时间" class="form-item_layout">
					<el-date-picker
						v-model="paging.dateQuery"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						value-format="yyyy-MM-dd"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="人员范围" class="form-item_layout">
					<el-select v-model="paging.staffQuery" placeholder="请选择">
						<el-option label="全公司" value="1"></el-option>
						<el-option label="考勤组" value="2"></el-option>
						<el-option label="部门/人员" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门/人员" class="form-item_layout" v-if="paging.staffQuery == '3'">
					<div class="user-list" v-if="staffUser.length > 0" style="display: inline-block;">
						<el-tag @close="removeUser(user)" closable type="primary" v-for="user in staffUser" :key="user.user_id">{{user.user_name}}</el-tag>
					</div>
					<el-button type="primary" size="mini" @click="selectstaffUsers">选择员工</el-button>
				</el-form-item>
				<el-form-item label="考勤组" class="form-item_layout" v-if="paging.staffQuery == '2'">
					<el-select v-model="paging.check_group" multiple collapse-tags placeholder="请选择">
						<el-option label="产品部的考勤组" value="产品部的考勤组"></el-option>
						<el-option label="开发部的考勤组" value="开发部的考勤组"></el-option>
						<el-option label="前端部的考勤组" value="前端部的考勤组"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="form-item_layout" v-if="paging.staffQuery != '2'">
					<el-checkbox v-model="paging.Dimission">离职员工</el-checkbox>
				</el-form-item>
				<el-form-item style="float: right;">
					<el-button @click="getList" type="primary">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" class="yg-table">
				<el-table-column label="姓名" prop="user_name"/>
				<el-table-column label="部门" prop="dept_name"/>
				<el-table-column label="职务" prop="duty"/>
				<el-table-column label="工号" prop="job_number"/>
				<el-table-column label="用工性质" prop="work_nature"/>
				<el-table-column label="考勤组	" prop="attendance_name"/>
				<el-table-column label="日期" prop="date_time"/>
				<el-table-column label="星期" prop="what_day"/>
				<el-table-column label="班次" prop="working_shift"/>
				<el-table-column label="打卡时间" prop="working_time"/>
				<el-table-column label="打卡结果" prop="working_clock_result"/>
				<el-table-column label="打卡地址" prop="clock_addr"/>
				<el-table-column label="打卡备注" prop="clock_remark"/>
				<el-table-column label="打卡图片">
					<template slot-scope="scope">
						<el-image
							style="width: 50px; height: 50px"
							:src="scope.row.clock_pic"
							fit="fit"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="设备信息" prop="equipment_info"/>
			</el-table>
			<!-- 分页 -->
			<pagination
			    v-show="paging.total > 0"
			    :total="paging.total"
			    :page.sync="paging.pageNum"
			    :limit.sync="paging.pageSize"
			    @pagination="getList"
			/>
			<SelectUsersDialog
					:visible.sync="showstaffDialog"
					:data="staffUser"
					model="user"
					:multiple="true"
					placeholder="请选择人员"
					@confirm="getDatasstaff"
			></SelectUsersDialog>
    </div>
</template>

<script>
import {getList} from '../../../../request/api/personnel/checking/originalRecord.js'
export default {
    data() {
        return {
					tableData:[],
					showstaffDialog:false,
					staffUser:[],
					paging:{
						pageNum:1,
						pageSize:20,
						total:0,
						dateQuery:"",
						staffQuery:"",
						check_group:"",
						Dimission:false
					}
        };
    },
    methods: {
			removeUser(item){
				let itemIndex = this.staffUser.findIndex(o => o.user_id == item.user_id)
				this.staffUser.splice(itemIndex,1)
			},
			getList(){
				let res = {}
				let user_id = this.staffUser.map(item=>{
					return item.user_id
				})
				res.attendance_name = this.paging.check_group.length>0 ? this.paging.check_group.join(',') : this.paging.check_group = ''
				res.user_id = user_id.join(',')
				res.user_status = this.paging.Dimission ? '1' : '2'
				res.start_time = this.paging.dateQuery[0]
				res.stop_time = this.paging.dateQuery[1]
				res.pageNum = this.paging.pageNum
				res.pageSize = this.paging.pageSize
				res.total = this.paging.total
				// console.log(res)
				getList(res).then(resp=>{
					this.tableData = resp.data.results
					this.paging.total = resp.data.count
					// console.log(this.tableData)
				})
			},
			selectstaffUsers() {
			    this.showstaffDialog = true;
			},
			getDatasstaff(e) {
			    this.showstaffDialog = false;
			    this.staffUser = e;
			},
    },
    created() {
        // console.log(this.$route)
				this.getList()
    },
};
</script>

<style scoped lang="scss">
	.form-item_layout{
		margin-right: 60px;
	}
</style>

