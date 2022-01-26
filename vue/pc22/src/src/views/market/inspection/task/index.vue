<template>
	<div class="app-container">
		<el-row>
			<el-col :span="20">
				<el-form :inline="true">
					<el-form-item label="巡检时间">
						<el-date-picker v-model="paging.pooling_time" value-format="yyyy-M-d" type="date" placeholder="选择日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="创建人">
						<el-input v-model="paging.creator__username"></el-input>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="paging.state" placeholder="" clearable >
							<el-option label="待开始" value="1"></el-option>
							<el-option label="整改中" value="2"></el-option>
							<el-option label="已完成" value="3"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
				<el-button icon="el-icon-refresh" @click="reset">重置</el-button>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<el-button type="primary" @click="operation('add')" style="margin-bottom: 15px;">新建</el-button>
		<el-table :data="tableData" class="yg-table" v-loading="loading">
			<el-table-column label="巡查时间" prop="pooling_time"></el-table-column>
			<el-table-column label="巡检单" prop="pooling_ticket"></el-table-column>
			<el-table-column label="检查人" prop="pooling_checker"></el-table-column>
			<el-table-column label="创建人" prop="creator"></el-table-column>
			<el-table-column label="状态">
				<template slot-scope='scope'>
					<el-tag :type="scope.row.state == '1' ? 'success' : scope.row.state == '2' ? 'warning' : 'info'">
						{{scope.row.state=='1' ? '待开始' : scope.row.state=='2' ? '整改中' : '已完成'}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" v-if="scope.row.state == '2'">巡检结果</el-button>
					<el-button type="text" v-if="scope.row.state == '1'" @click="toManage(scope.row.id)">任务管理</el-button>
					<el-button type="text" v-if="scope.row.state == '3'">查看</el-button>
					<el-button type="text" v-if="scope.row.state == '1'" @click="del(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 新建编辑窗口 -->
		<Yg-Drawer
			v-model="showDrawer"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			@confirm="confirmForm"
			@closed="drawerClosed"
			@cancel="drawerClosed"
			:confirmLoading="btnLoading"
		>
			<el-form :model="form" ref="form" :rules="rules" label-width="100px">
				<el-form-item label="巡检时间" prop="pooling_time">
					<el-date-picker v-model="form.pooling_time" value-format="yyyy-M-d" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="检查人" prop="pooling_checker">
					<div class="user-list" v-if="User.length > 0">
						<el-tag @close="removeUser(user)" closable type="primary" v-for="user in User" :key="user.user_id">{{user.user_name}}</el-tag>
					</div>
					<el-button type="primary" size="mini" @click="selectUser">选择员工</el-button>
				</el-form-item>
				<el-form-item label="巡检单" prop="pooling_ticket">
					<el-select v-model="form.pooling_ticket">
						<el-option v-for="(item,index) in OrderOptions" :key="'order' + index" :value="item.value" :label="item.label"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
		<!-- 选人窗口 -->
		<SelectUsersDialog
			:visible.sync="showDialog"
			:data="User"
			model="user"
			:multiple="true"
			placeholder="请选择人员"
			@confirm="getDatas"
		></SelectUsersDialog>
	</div>
</template>

<script>
import {getList,getItemList,addTask,delTask} from '../../../../request/api/market/inspection/task.js'
export default {
	data() {
		return{
			OrderOptions:[],
			showDialog:false,
			User:[],
			form:{
				pooling_checker:[]
			},
			rules:{
				pooling_time:[{ required: true, message: '请选择时间', trigger: 'blur' }],
				pooling_checker:[{ required: true, message: '请选择人员', trigger: 'change' }],
				pooling_ticket:[{ required: true, message: '请选择巡检单', trigger: 'blur' }]
			},
			btnLoading:false,
			showDrawer:false,
			drawerType:'',
			itemId:'',
			tableData:[],
			loading:false,
			paging:{
				pageNum: 1,
				pageSize: 20,
				total:0
			}
		}
	},
	methods: {
		toManage(id){
			this.$router.push({path:'/taskManage',query:{id:id}})
		},
		del(id){//删除
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			  }).then(() => {
			    delTask(id).then((res) => {
			      self.$toast("删除成功！");
						this.getList()
			    });
			  });
		},
		confirmForm(){
			let self = this
			self.form.pooling_checker = self.User.map(item=>{
				return item.user_id
			})
			self.$refs["form"].validate((valid)=>{
				if(valid){
					addTask(self.form).then(resp=>{
						self.$toast("新建成功！");
						self.showDrawer = false
						this.getList()
					})
				}
			})
		},
		drawerClosed(){
			this.showDrawer = false;
			(this.form = {
				pooling_checker:[]
			}),
			this.User = [];
			this.resetForm("form");
		},
		reset(){//重置
			this.paging = {
				pageNum: 1,
				pageSize: 20,
				total:0
			}
			this.getList()
		},
		getList(){//获取列表
			getList(this.paging).then(resp=>{
				this.tableData = resp.data.results
				this.paging.total = resp.data.count
				console.log(this.tableData)
			})
		},
		operation(type,id){//打开新建窗口
			this.showDrawer = true;
			this.itemId = id;
			this.drawerType = type;
			this.getItemList()
		},
		getItemList(){//获取巡检单
			getItemList().then(resp=>{
				let res = resp.data.results
				if(this.OrderOptions.length == 0){//判断数组长度等于0，循环取值
					for(let i=0;i<res.length;i++){
						this.OrderOptions.push({
							label:res[i].ticket_name,
							value:res[i].id
						})
					}
				}
			})
		},
		/* 选人组件 */
		removeUser(item) {
			let itemIndex = this.User.findIndex(
					(o) => o.user_id == item.user_id
			);
			this.User.splice(itemIndex, 1);
		},
		selectUser() {
			this.showDialog = true;
		},
		getDatas(e) {
		    this.showDialog = false;
		    this.User = e;
		},
	},
	created() {
		this.getList()
	}
};
</script>

<style lang="scss" scoped>
</style>

