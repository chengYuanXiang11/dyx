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
			<el-button type="danger" @click="batchdel">批量删除</el-button>
		</template>
		<el-table :data="tableData" border height="100%" @selection-change="getcheckedmsg">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="name" label="素材名称"></el-table-column>
			<el-table-column prop="type" label="素材类型"></el-table-column>
			<el-table-column prop="langtime" label="时长"></el-table-column>
			<el-table-column prop="size" label="素材大小"></el-table-column>
			<el-table-column prop="cread" label="创建人"></el-table-column>
			<el-table-column prop="time" label="创建时间"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text" style="color: red;">删除</el-button>
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
				<el-form-item label="素材名称" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="素材类型" prop="type">
					<el-radio v-model="form.type" label="1">图片</el-radio>
					<el-radio v-model="form.type" label="2">视频</el-radio>
				</el-form-item>
				<el-form-item label="上传图片" prop="imglist" v-if="form.type == '1'">
					<Image-Upload :max='1' v-model="form.imglist"></Image-Upload>
				</el-form-item>
				<el-form-item label="上传视频" prop="videolist" v-if="form.type == '2'">
					<FileUpload
							ref="saveFile"
							accept=".mp4"
							:file-type="['mp4']"
							@input="submitForm"
							:isShowTip="true"
					/>
				</el-form-item>
			</el-form>
		</Drawer>
	</Table-page>
</template>

<script>
import FileUpload from '@/components/FileUpload/index.vue'
export default{
	components:{FileUpload},
	data(){
		return{
			checkedmsg:[],
			form:{
				type:'1',
				imglist:[],
			},
			rules:{
				name:[{required: true,message: "素材名称不能为空",trigger: "blur"}],
				type:[{required: true,message: "素材类型不能为空",trigger: "blur"}],
				imglist:[{required: true,message: "请选择图片",trigger: "blur"}],
				videolist:[{required: true,message: "请选择视频",trigger: "blur"}],
			},
			visible:false,
			loading:false,
			drawerType:'',
			itemId:'',
			tableData:[],
			search: {
				form: [
					{
							label: "素材名称",
							type: "input",
							name: "name",
					},
					{
							label: "素材类型",
							type: "select",
							name: "type",
							placeholder: "请输入姓名",
					},
					{
							label: "创建人",
							type: "input",
							name: "creaduser",
							placeholder: "请选择状态",
					}],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				isOpen: false,
			},
		}
	},
	methods:{
		batchdel(){
			console.log(this.checkedmsg)
		},
		getcheckedmsg(val){
			this.checkedmsg = val
		},
		submitForm() {
			this.$refs.saveFile.fileList = [];
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
				type:'1',
				imglist:[],
			}
		},
		operation(type,id){
			this.visible = true;
			this.drawerType = type;
			this.itemId = id;
			type == 'edit' && this.getInfo()
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
