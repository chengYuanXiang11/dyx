<template>
    <div class="app-container">
			<div class="operation">
				<el-button type="primary" @click="operation('add')">新建</el-button>
			</div>
			<el-divider></el-divider>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="周一" name="1"></el-tab-pane>
				<el-tab-pane label="周二" name="2"></el-tab-pane>
				<el-tab-pane label="周三" name="3"></el-tab-pane>
				<el-tab-pane label="周四" name="4"></el-tab-pane>
				<el-tab-pane label="周五" name="5"></el-tab-pane>
				<el-tab-pane label="周六" name="6"></el-tab-pane>
				<el-tab-pane label="周日" name="7"></el-tab-pane>
			</el-tabs>
			<el-table class="yg-table" :data="tableData" v-loading="loading">
				<el-table-column label="路线名称" prop="routine_name"/>
				<el-table-column label="开始时间" prop="start_time"/>
				<el-table-column label="结束时间" prop="end_time"/>
				<el-table-column label="巡更时长" prop="interval_time"/>
				<el-table-column label="间隔时长" prop="interval_time"/>
				<el-table-column label="巡更人员" prop="">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.interval_staff" :key="index">{{item.user_name}},</br></span>
					</template>
				</el-table-column>
				<el-table-column label="创建人" prop="creator_name"/>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
						<el-button type="text" @click="del(scope.row.id)">删除</el-button>
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
			<!-- 抽屉 -->
			<Yg-Drawer
				v-model="showDrawer"
				:title="(drawerType == 'add' ? '新建' : '编辑')"
				@confirm="confirmForm"
				@closed="drawerClosed"
				@cancel="drawerClosed"
				:confirmLoading="btnLoading"
			>
				<el-form :model="form" ref="form" :rules="rules" label-width="160px">
					<el-form-item label="每周:" prop="weekday">
						<el-select v-model="form.weekday">
							<el-option v-for="(item,index) in weekoptions" :label="item" :value="index + 1" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="路线:" prop="routine">
						<el-select v-model="form.routine">
							<el-option v-for="(item,index) in pathoptions" :label="item.label" :value="item.value" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="巡更人员:" prop="interval_staff">
						<div class="user-list" v-if="form.interval_staff.length > 0">
							<el-tag @close="removeUser(user)" closable type="primary" v-for="user in form.interval_staff" :key="user.user_id">{{user.user_name}}</el-tag>
						</div>
						<el-button type="primary" size="mini" @click="selectUsers">选择员工</el-button>
					</el-form-item>
					<el-form-item label="开始时间:" prop="start_time">
						<el-time-picker v-model="form.start_time" placeholder="任意时间点" value-format="HH:mm" format="HH:mm"></el-time-picker>
					</el-form-item>
					<el-form-item label="结束时间:" prop="end_time">
						<el-time-picker v-model="form.end_time" placeholder="任意时间点" value-format="HH:mm" format="HH:mm"></el-time-picker>
					</el-form-item>
					<el-form-item label="巡更点间隔时长:" prop="interval_time" :rules="{required: form.interval_open, message: '请输入间隔时长', trigger: 'blur'}">
						<el-switch v-model="form.interval_open"></el-switch>
						<el-input v-model="form.interval_time" style="width: 30%;margin-left: 30px;" v-if="form.interval_open"></el-input>
						<span v-if="form.interval_open">分</span>
					</el-form-item>
					<el-form-item label="每次打卡可提前(分):" prop="advance_time">
						<el-input v-model="form.advance_time"></el-input>
					</el-form-item>
					<el-form-item label="每次打卡可延后(分):" prop="delay_time">
						<el-input v-model="form.delay_time"></el-input>
					</el-form-item>
					<el-form-item label="开始前提醒(分):" prop="remind_time">
						<el-input v-model="form.remind_time"></el-input>
					</el-form-item>
				</el-form>
			</Yg-Drawer>
			<!-- 选择人员 -->
			<SelectUsersDialog
					:visible.sync="showDialog"
					:data="form.interval_staff"
					model="user"
					:multiple="true"
					placeholder="请选择人员"
					@confirm="getDatas"
			></SelectUsersDialog>
    </div>
</template>

<script>
import {getList,addPlan,delPlan,getInfo,updataPlan} from '../../../../request/api/market/watchmanAdmin/plan.js'
import {getPathList} from '../../../../request/api/market/watchmanAdmin/itinerary.js'
export default {
    name: "plan",
    data() {
        return {
					showDialog: false,
					form:{
						interval_staff:[]
					},
					rules:{
						weekday:[{required: true, message: '请选择日期', trigger: 'blur'}],
						routine:[{required: true, message: '请选择巡更路线', trigger: 'blur'}],
						interval_staff:[{required: true, message: '请选择巡更人员', trigger: 'blur'}],
						start_time:[{required: true, message: '请选择开始时间', trigger: 'blur'}],
						end_time:[{required: true, message: '请选择结束时间', trigger: 'blur'}]
					},
					btnLoading:false,
					showDrawer:false,
					drawerType:'',
					itemId:'',
          queryitem:'',
					activeName:"1",
					tableData:[],
					loading:false,
					paging: {
						pageNum: 1,
						pageSize: 20,
						total:0,
						weekday:'1'
					},
					weekoptions:['周一','周二','周三','周四','周五','周六','周日'],
					pathoptions:[]
        };
    },
    methods: {
			del(id){//删除
				delPlan(id).then(resp=>{
					this.$toast("添加成功！");
					this.getList()
				})
			},
			confirmForm(){//抽屉确定按钮
				const self = this
				self.$refs['form'].validate(valid=>{
					if(valid){
						let res = self.form.interval_staff.map(item=>{//格式化人员选择
							return item.user_id
						})
						self.form.interval_staff = res
						//格式化  是否有巡更时间间隔
						self.form.interval_open = self.form.interval_open ? '1':'0'
						if(self.drawerType == 'add'){//添加
							addPlan(self.form).then(resp=>{
								self.$toast("添加成功！");
								self.getList()
								self.showDrawer = false
							}).finally(erroe=>{
								this.loading = false
							})
						}else{
							updataPlan(self.itemId,self.form).then(resp=>{
								self.$toast("修改成功！");
								self.getList()
								self.showDrawer = false
							}).finally(erroe=>{
								this.loading = false
							})
						}
					}
				})
			},
			drawerClosed(){//抽屉取消按钮
				this.showDrawer = false;
				(this.form = {
					interval_staff:[]
				}),
				this.resetForm("form");
			},
			getInfo(){//获取单条
				getInfo(this.itemId).then(resp=>{
					this.form = resp.data
					let num = Number(this.form.weekday) -1
					this.form.weekday = this.weekoptions[num]
				})
			},
			operation(type,id){//打开抽屉
				this.getPathList();
				this.showDrawer = true;
				this.drawerType = type;
				this.itemId = id;
				type == 'edit' && this.getInfo()
			},
			getList(){//获取列表
				this.loading = true
				getList(this.paging).then(resp=>{
					this.tableData = resp.data.results
					this.paging.total = resp.data.count
					console.log(this.tableData)
				}).finally(error=>{
					this.loading = false
				})
			},
			handleClick(){//切换tabs标签页
				this.paging.weekday = this.activeName
				this.getList()
			},
			getPathList(){//获取巡更路线
				let paging ={
					pageNum:"all",
				}
				getPathList(paging).then(resp=>{
					let obj = []
					obj = resp.data.results
					for(let i=0;i<obj.length;i++){
						this.pathoptions.push({
							label:obj[i].routinename,
							value:obj[i].id
						})
					}
				})
			},
			//选人
			getDatas(e,close) {
			    close();
					this.form.interval_staff = e;
			},
			selectUsers() {
			    this.showDialog = true;
			},
			removeUser(item) {
				let itemIndex = this.form.interval_staff.findIndex(
						(o) => o.user_id == item.user_id
				);
				this.form.interval_staff.splice(itemIndex, 1);
			},
    },
    created() {
        // console.log(this.$route)
			this.getList()
    },
};
</script>

<style scoped lang="scss">
</style>

