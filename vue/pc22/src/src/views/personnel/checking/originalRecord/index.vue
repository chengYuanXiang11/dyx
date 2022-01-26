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
				<el-table-column label="姓名" prop="name"/>
				<el-table-column label="部门" prop="bumen"/>
				<el-table-column label="职务" prop="zhiwu"/>
				<el-table-column label="工号" prop="gonghao"/>
				<el-table-column label="用工性质" prop="xingzhi"/>
				<el-table-column label="考勤组	" prop="kaoqinzu"/>
				<el-table-column label="日期" prop="riqi"/>
				<el-table-column label="星期" prop="xingqi"/>
				<el-table-column label="班次" prop="banci"/>
				<el-table-column label="打卡时间" prop="dakashijian"/>
				<el-table-column label="打卡结果" prop="dakajieguo"/>
				<el-table-column label="打卡地址" prop="dakadizhi"/>
				<el-table-column label="打卡备注" prop="dakabeizhu"/>
				<el-table-column label="打卡图片">
					<template slot-scope="scope">
						<el-image
							style="width: 50px; height: 50px"
							:src="scope.row.dakaitupian"
							:preview-src-list="srcList"
							fit="fit"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="设备信息" prop="shebeixinxi"/>
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
					tableData:[
						{
							name:"测试1",
							bumen:"测试部门",
							zhiwu:"测试职务",
							gonghao:"测试工号001",
							xingzhi:"测试性质",
							kaoqinzu:"测试考勤",
							riqi:"2020-01-01",
							xingqi:"星期一",
							banci:"2020-05-26 09:00",
							dakashijian:"17:59:00",
							dakajieguo:"正常	",
							dakadizhi:"汇典商务楼",
							dakabeizhu:"-",
							dakaitupian:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
							shebeixinxi:"电脑",
						}
					],
					srcList:['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
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

