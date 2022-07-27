<template>
    <div class="app-container">
			
			<el-form :inline="true">
				<el-form-item label="时间" class="form-item_layout">
					<el-date-picker
						v-model="form.dateQuery"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						value-format="yyyy-MM-dd"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="人员范围" class="form-item_layout">
					<el-select v-model="form.staffQuery" placeholder="请选择">
						<el-option label="全公司" value="1"></el-option>
						<el-option label="考勤组" value="2"></el-option>
						<el-option label="部门/人员" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门/人员" class="form-item_layout" v-if="form.staffQuery == '3'">
					<div class="user-list" v-if="staffUser.length > 0" style="display: inline-block;">
						<el-tag @close="removeUser(user)" closable type="primary" v-for="user in staffUser" :key="user.user_id">{{user.user_name}}</el-tag>
					</div>
					<el-button type="primary" size="mini" @click="selectstaffUsers">选择员工</el-button>
				</el-form-item>
				<el-form-item label="考勤组" class="form-item_layout" v-if="form.staffQuery == '2'">
					<el-select v-model="form.check_group" multiple collapse-tags placeholder="请选择">
						<el-option label="保洁" value="1"></el-option>
						<el-option label="保安" value="2"></el-option>
						<el-option label="固定" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="form-item_layout" v-if="form.staffQuery != '2'">
					<el-checkbox v-model="form.Dimission">离职员工</el-checkbox>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" class="yg-table">
				<el-table-column label="基本信息">
					<el-table-column label="姓名" />
					<el-table-column label="部门" />
					<el-table-column label="工号" />
				</el-table-column>
				<el-table-column label="班次信息">
					<el-table-column label="考勤组" />
					<el-table-column label="日期" />
					<el-table-column label="星期" />
					<el-table-column label="班次" />
				</el-table-column>
				<el-table-column label="第一次上班">
					<el-table-column label="打开时间" />
					<el-table-column label="打卡结果" />
				</el-table-column>
				<el-table-column label="第一次下班">
					<el-table-column label="打开时间" />
					<el-table-column label="打卡结果" />
				</el-table-column>
				<el-table-column label="第二次上班">
					<el-table-column label="打开时间" />
					<el-table-column label="打卡结果" />
				</el-table-column>
				<el-table-column label="第二次下班">
					<el-table-column label="打开时间" />
					<el-table-column label="打卡结果" />
				</el-table-column>
				<el-table-column label="第三次上班">
					<el-table-column label="打开时间" />
					<el-table-column label="打卡结果" />
				</el-table-column>
				<el-table-column label="第三次下班">
					<el-table-column label="打开时间" />
					<el-table-column label="打卡结果" />
				</el-table-column>
				<el-table-column label="时长统计	">
					<el-table-column label="应出勤时长(分钟)" />
					<el-table-column label="实际出勤时长(分钟)" />
					<el-table-column label="计薪时长(分钟)" />
					<el-table-column label="迟到时长(分钟)" />
					<el-table-column label="早退时长(分钟)" />
					<el-table-column label="加班时长" />
				</el-table-column>
				<el-table-column label="异常统计	">
					<el-table-column label="请假时长" />
				</el-table-column>
			</el-table>
			
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
export default {
    data() {
        return {
					tableData:[],
					showstaffDialog:false,
					staffUser:[],
					form:{
						dateQuery:"",
						staffQuery:"",
						check_group:"",
						Dimission:''
					}
        };
    },
    methods: {
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
    },
};
</script>

<style scoped lang="scss">
	.form-item_layout{
		margin-right: 60px;
	}
</style>

