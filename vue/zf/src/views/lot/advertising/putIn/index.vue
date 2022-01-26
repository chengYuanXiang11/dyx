<template>
	<Table-page
		:page-size="search.pageSize"
		:total="search.total"
		:page-num="search.pageNum"
		:searchForm="search.form"
		@pagination="handlePagination"
		@search="handleSearch"
		@reset="handleReset">
		<template slot="action-bar">
			<el-button type="primary" @click="operation('add')" v-hasPermi="['123456']">新增</el-button>
		</template>
		<el-table :data="tableData" border height="100%">
			<el-table-column prop="name" label="投放名称"></el-table-column>
			<el-table-column prop="type" label="素材数量"></el-table-column>
			<el-table-column prop="langtime" label="在播数量"></el-table-column>
			<el-table-column prop="size" label="设备数量"></el-table-column>
			<el-table-column prop="cread" label="开始时间"></el-table-column>
			<el-table-column prop="time" label="结束时间"></el-table-column>
			<el-table-column prop="time" label="状态"></el-table-column>
			<el-table-column prop="time" label="修改人"></el-table-column>
			<el-table-column prop="time" label="修改时间"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="operation('check',scope.row.id)">查看</el-button>
					<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text" style="color: red;" @click="del(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Drawer
			:visible.sync="visible"
			v-loading="loading"
			element-loading-text="拼命加载中"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			:before-close="beforeClose"
			@confirm="confirm"
		>
			<el-form ref="form" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="投放名称" prop="name">
					<el-input v-model="form.name" :disabled="isactivate"></el-input>
				</el-form-item>
				<el-form-item label="投放设备" prop="datas">
					<select-users v-model="form.datas" type="all" :multiple="true" :disabled="isactivate"></select-users>
				</el-form-item>
				<el-form-item label="选择广告" prop="advertising">
					<el-select v-model="form.advertising" placeholder="请选择" :disabled="isactivate">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开始时间" prop="s_time">
					<el-date-picker
					:disabled="isactivate"
						v-model="form.s_time"
						type="datetime"
						placeholder="选择开始时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="e_time">
					<el-date-picker
					:disabled="isactivate"
						v-model="form.e_time"
						type="datetime"
						placeholder="选择结束时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
		</Drawer>
	</Table-page>
</template>

<script>
export default{
	data(){
		return{
			isactivate:false,
			options:[],
			form:{
				datas:{
					users:[],
					depts:[],
				}
			},
			rules:{
				name:[{required: true,message: "请填写投放名称",trigger: "blur"}],
				datas:[{required: true,message: "请选择投放设备",trigger: "blur"}],
				advertising:[{required: true,message: "请选择广告",trigger: "blur"}],
				s_time:[{required: true,message: "请选择开始时间",trigger: "blur"}],
				e_time:[{required: true,message: "请选择结束时间",trigger: "blur"}]
			},
			visible:false,
			loading:false,
			drawerType:'',
			itemId:'',
			tableData:[],
			search: {
				form: [
					{
							label: "投放名称",
							type: "input",
							name: "name",
					},
					{
							label: "起止时间",
							type: "daterange",
							name: "type",
					},
					{
							label: "修改人",
							type: "input",
							name: "user",
							placeholder: "填写修改时间",
					}],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				isOpen: false,
			},
		}
	},
	methods:{
		del(id){
		 this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			})
		},
		confirm(){
			let self = this
			self.$refs['form'].validate((valid)=>{
				if(valid){
					console.log('验证通过')
				}
			})
		},
		beforeClose(){
			this.visible = false
			this.form={
				datas:{
					users:[],
					depts:[],
				}
			}
		},
		operation(type,id){
			this.visible = true;
			this.drawerType = type;
			this.itemId = id;
			type == 'edit' && this.getInfo()
			type == 'check' && this.getCheck()
		},
		getCheck(){
			this.isactivate = true;
			this.getInfo()
		},
		getInfo(){},
		getList(){
			this.tableData = [
				{name:'1',type:'2',langtime:'30s',size:'45M',cread:'锤子',time:'2021-12-12'},
				{name:'1',type:'2',langtime:'30s',size:'45M',cread:'锤子',time:'2021-12-12'},
				{name:'1',type:'2',langtime:'30s',size:'45M',cread:'锤子',time:'2021-12-12'},
				{name:'1',type:'2',langtime:'30s',size:'45M',cread:'锤子',time:'2021-12-12'}
			]
		},
		handlePagination(e) {
				this.search.pageSize = e.pageSize;
				this.search.pageNum = e.pageNum;
				this.getList();
		},
		handleSearch(e) {
				this.queryParams = e;
				this.search.pageNum = 1;
				this.getList();
		},
		handleReset(){
			this.$info(`触发重置方法，表单值：${JSON.stringify(e)}`);
		}
	},
	created() {
		this.getList()
	}
}
</script>

<style lang="scss" scoped>
</style>

