<template>
	<div class="app-container">
		<div class="operation">
				<el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<el-table :data="tableData" class="yg-table" v-loading="loading">
			<el-table-column label="库位号" prop="locationCode"/>
			<el-table-column label="库位容量" prop="capacity"/>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
						size="mini"
						type="text"
						@click="operation('edit', scope.row.id)"
						>编辑</el-button>
					<el-button
						size="mini"
						type="text"
						@click="del(scope.row.id)"
						>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			:total="total"
			:page.sync="paging.pageNum"
			:limit.sync="paging.pageSize"
			@pagination="getList"
		/>
		<Yg-Drawer
			v-model="showDrawer"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			@confirm="confirmForm"
			@closed="drawerClosed"
			@cancel="drawerClosed"
		>
			<el-form ref="form" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="库位编号" prop="locationCode">
					<el-input
							style="width: 80%;"
							v-model="form.locationCode"
							placeholder="请输入库位编号"
					></el-input>
				</el-form-item>
				<el-form-item label="库位容量" prop="capacity">
					<el-input
							style="width: 80%;"
							v-model="form.capacity"
							placeholder="请输入库位容量"
					></el-input>
				</el-form-item>
			</el-form>	
		</Yg-Drawer>
	</div>
</template>

<script>
import {getList,addSeat,delSeat,getInfo,updateSeat} from '../../../../request/api/market/warehouseAdmin/seat.js'
export default{
	name:"seat",
	data() {
		return{
			form:{},
			rules:{
				locationCode: [
					{
							required: true,
							message: "请输入库位编号",
							trigger: "blur",
					},
				],
				capacity: [
					{
							required: true,
							message: "请输入库位容量",
							trigger: "blur",
					},
				],
			},
			drawerType:'',
			showDrawer:false,
			id:this.$route.query.id,
			tableData:[],
			loading:false,
			paging: {
				pageNum: 1,
				pageSize: 20,
			},
			total:0,
			btnLoading:false
		}
	},
	methods:{
		getInfo(){
			const self = this,
			loading = this.$load();
			getInfo(this.itemId).then(resp=>{
				console.log(resp)
				let res = self.filterObj(resp.data,[
					"locationCode",
					"capacity",
					"id"
				])
				self.form = res
			}).finally(error=>{
				self.$nextTick(() => {
						loading.close();
				});
			})
		},
		confirmForm(){
			const self = this
			this.$refs['form'].validate((valid)=>{
				if(valid){
					self.btnLoading = true
					if(self.drawerType == 'add'){
						self.form.warehouse = this.id
						addSeat(self.form).then(resp=>{
							self.showDrawer = false;
							self.$toast("新增成功！");
							self.getList();
						}).finally(error=>{
							self.btnLoading = false;
						})
					}else{
						self.form.warehouse = self.id
						updateSeat(self.form,self.itemId).then(resp=>{
							self.showDrawer = false;
							self.$toast("编辑成功！");
							self.getList();
						}).finally((error) => {
								self.btnLoading = false;
						});
					}
				}
			})
		},
		drawerClosed(){
			this.showDrawer = false;
			(this.form = {
			    area: [],
			    warehouseCode: "",
			    warehouseCapacity: "",
					warehouseType:"",
					storageType:[]
			}),
			this.resetForm("form");
		},
		getList(){
			this.loading = true
			getList(this.id,this.paging).then(resp=>{
				this.tableData = resp.data.results
				this.total = resp.data.count;
			}).finally(error=>{
				this.loading = false
			})
		},
		operation(type,id){//新建//编辑
			this.showDrawer = true;
			this.drawerType = type;
			this.itemId = id;
			type == 'edit' && this.getInfo()
		},
		del(id){//删除
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			}).then(()=>{
				delSeat(id).then((res) => {
				    self.$toast("删除成功！");
				    self.getList();
				});
			})
		}
	},
	created() {
		this.getList()
	}
}
</script>

<style>
</style>
