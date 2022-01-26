<template>
	<div class="app-container">
		<el-row>
			<el-col :span="1" style="text-align: right;">
				<el-avatar :size="70" :src="circleUrl" fit="fit" @error="errorHandler">
					<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
				</el-avatar>
			</el-col>
			<el-col :span="10" style="margin-left: 30px;">
				<div class="usermsg_layout" style="font-size: 20px;">姓名:{{usermsg.vacationcheck_username}}</div>
				<div class="usermsg_layout">部门:{{usermsg.vacationcheck_deptname}}</div>
			</el-col>
		</el-row>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane :label="item.vacation_name" :name="item.vacation_name" v-for="(item,index) in tabsData" :key="index" v-if="item.count != 'none'">
				<el-row>
					<el-col :span="24" v-if="item.is_limit == '0'">
						当前余额:不限额
					</el-col>
					<el-col :span="24" v-if="item.is_limit == '1'">
						当前余额:{{item.count}}
						<span v-if="item.unit_time == '1'">小时</span>
						<span v-if="item.unit_time == '2'">半天</span>
						<span v-if="item.unit_time == '3'">天</span>
						<el-button 
						type="text" 
						style="margin-left: 15px;" 
						@click="updatedDialog = true,time_unit = item.unit_time"
						>修改余额</el-button>
						<el-col :span="24">
							当前发放规则:
							<span v-if="item.balance_rules == '1'">手动发放</span>
							<span v-if="item.balance_rules == '2'">每月1日发放5小时</span>
							<span v-if="item.balance_rules == '3'">每年1月日发放80小时</span>
							<span v-if="item.balance_rules == '4'">限额</span>
							<span v-if="item.balance_rules == '5'">不限额</span>
						</el-col>
						<el-col :span="24" style="margin-top: 20px;">
							<el-table class="yg-table" :data="tableData">
								<el-table-column label="时间" prop="create_datetime"/>
								<el-table-column label="操作者" prop="modifier"/>
								<el-table-column label="变更记录" prop="change_record"/>
								<el-table-column label="余额变更" prop="change_content"/>
								<el-table-column label="理由" prop="change_reason"/>
							</el-table>
							<pagination :total="pagings.total" :page.sync="pagings.pageNum" :limit.sync="pagings.pageSize"
							@pagination="getLog" :pageSizes="[10]" />
						</el-col>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
		<el-dialog
		  title="提示"
		  :visible.sync="updatedDialog"
		  width="30%"
		  :before-close="handleClose">
		  <el-form :model="form" :rules="rules" ref="form" label-width="100px">
				<el-form-item label="余额">
					<el-select v-model="form.type" placeholder="" style="width: 150px;">
						<el-option label="增加" value="增加"></el-option>
						<el-option label="减少" value="减少"></el-option>
					</el-select>
					<el-input v-model="form.nums" style="width: 150px;margin-left: 15px;"></el-input>
					<span v-if="time_unit == '1'">小时</span>
					<span v-if="time_unit == '2'">半天</span>
					<span v-if="time_unit == '3'">天</span>
				</el-form-item>
				<el-form-item label="修改理由">
					<el-input v-model="form.remake" type="textarea" style="width: 315px;" resize="none" :rows="3"></el-input>
				</el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="unpdateholiday">确 定</el-button>
		    <el-button @click="updatedDialog = false,form = {},form.type='增加'">取 消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import {getInfo,editHoliday,Log} from '../../../../request/api/personnel/checking/holidayQuery.js'
export default{
	data(){
		return{
			pagings: {
				total: 0,
				pageNum: 1,
				pageSize: 10
			},
			form:{
				type:"增加"
			},
			rules:{},
			updatedDialog:false,
			usermsg:{
				vacationcheck_username:'',
				vacationcheck_deptname:''
			},
			type:this.$route.query.type,
			activeName: '',
			circleUrl:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			id:this.$route.query.id,
			tabsData:[],
			tableData:[],
			time_unit:''
		}
	},
	methods:{
		unpdateholiday(){
			this.updatedDialog = false;
			// console.log(this.form)
			let obj = {
				type : '',
				count : '',
				remark : ''
			};
			if(this.form.type == '增加'){
				obj.type = '+'
			}else{
				obj.type = '-'
			}
			obj.count = this.form.nums
			obj.remark = this.form.remake
			let res = {
				update_key:this.activeName,
				update_count:obj
			}
			editHoliday(res,this.id).then(resp=>{
				this.$toast("编辑成功！");
				this.getLog()
				this.form = {}
				this.form.type = '增加'
			})
		},
		handleClose(){
			let self = this
			this.$confirm('是否关闭窗口?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error'
				}).then(() => {
					self.updatedDialog = false;
				}).catch(() => {});
		},
		getInfo(){
			getInfo(this.id).then(resp=>{
				// console.log(resp)
				resp.data.avatar == null ? this.circleUrl= 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : this.circleUrl = resp.data.avatar
				this.usermsg.vacationcheck_username = resp.data.vacationcheck_username;
				this.usermsg.vacationcheck_deptname = resp.data.vacationcheck_deptname;
				this.activeName = this.type;
				this.tabsData = resp.data.vacation_detail;
				// console.log(this.tabsData)
			})
		},
		errorHandler(e){//头像加载异常
			return true
		},
	  handleClick(tab, event) {//标签也切换
		 this.type = this.activeName
		 this.getLog()
	  },
		getLog(){
			this.activeName = this.type
			// console.log(this.activeName)
			Log(this.id,this.activeName,this.pagings).then(resp=>{
				this.tableData = resp.data.results
				this.pagings.total = resp.data.count
			})
		},
	},
	created(){
		this.getInfo()
		this.getLog()
	}
}
</script>

<style scoped>
	.usermsg_layout{
		margin-top: 10px;
	}
</style>
