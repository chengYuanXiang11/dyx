<template>
	<div class="app-container">
		<div class="operation">
		    <el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<!-- 表格 -->
		<el-table :data="tableData" class="yg-table" v-loading="loading">
			<el-table-column label="宿舍编号" prop="dormitoryCode" />
			<el-table-column label="面积/㎡" prop="proportion" />
			<el-table-column label="所属区域" prop="areamanage.area_name" />
			<el-table-column label="所属建筑" prop="building.building_name" />
			<el-table-column label="所在楼层" prop="floormanage.order_num" />
			<el-table-column label="操作" class-name="small-padding fixed-width" align="center">
				<template slot-scope="scope">
					<el-button
						size="mini"
						type="text"
						@click="operation('edit',scope.row.id)"
						>编辑</el-button>
					<el-button
						size="mini"
						type="text"
						@click="del(scope.row.id)"
						>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination
			:total="total"
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
		>
			<h4>位置设置</h4>
			</br>
			<el-form ref="form" :model="form" :rules="rules">
				<el-form-item label="选择区域" prop="area">
						<AreaSelect v-model="form.area"></AreaSelect>
				</el-form-item>
				<h4>宿舍设置</h4>
				</br>
				<el-form-item label="宿舍编号" prop="dormitoryCode">
					<el-input
					    v-model="form.dormitoryCode"
					    placeholder="请输入宿舍编号"
					></el-input>
				</el-form-item>
				<el-form-item label="面积" prop="proportion">
					<el-input
					    v-model="form.proportion"
					    placeholder="请输入面积"
					></el-input>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
import {getList,addDormitory,delDormitory,getInfo,updateDormitory	} from "../../../request/api/market/dormitoryAdmin/dormitoryAdmin.js";
import AreaSelect from "@/views/components/areaSelect/index";
export default{
	name:"dormitory",
	components: {
	    AreaSelect,
	},
	data() {
		return{
			form: {
				area: [],
				dormitoryCode:'',
				proportion:''
			},
			rules: {
				area: [
					{
						required: true,
						message: "请选择所在区域",
						trigger: "change",
					},
					{
						validator: (rule, value, callback) => {
								if (!value[0] || value[0] == "") {
										callback(new Error("请选择所在区域"));
								} else if (!value[1] || value[1] == "") {
										callback(new Error("请选择所在建筑"));
								} else if (!value[2] || value[2] == "") {
										callback(new Error("请选择所在楼层"));
								} else {
										callback();
								}
						},
						trigger: "change",
					},
				],
				dormitoryCode: [
						{
								required: true,
								message: "请输入铺位编号",
								trigger: "blur",
						},
				],
				proportion: [
						{
								required: true,
								message: "请输入面积",
								trigger: "blur",
						},
				],
			},
			loading:true,
			tableData: [],
			paging: {
				pageNum: 1,
				pageSize: 20,
			},
			total:0,
			showDrawer:false,
			drawerType:"",
			itemId: undefined,
			btnLoading: false,
		}
	},
	methods:{
		del(id){//删除
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			}).then(()=>{
				delDormitory(id).then((res) => {
				    self.$toast("删除成功！");
				    self.getList();
				});
			})
		},
		getList(){//商铺列表
			this.loading = true
			getList(this.paging).then((resp)=>{
				this.tableData = resp.data.results
				this.total = resp.data.count;
				// console.log(this.tableData)
			}).finally((error)=>{
				this.loading = false
			})
		},
		operation(type,id){//新增按钮触发
			this.showDrawer = true;
			this.drawerType = type;
			this.itemId = id;
			type == 'edit' && this.getInfo()
		},
		getInfo(){
			const self = this,
			loading = this.$load();
			getInfo(self.itemId).then(resp=>{
				let res = self.filterObj(resp.data,[
					"areamanage",
					"building",
					"floormanage",
					"dormitoryCode",
					"proportion"
				]);
				self.form.area = [res.areamanage.id,res.building.id,res.floormanage.id]
				self.form.dormitoryCode = res.dormitoryCode
				self.form.proportion = res.proportion
			}).finally((error) => {
							self.$nextTick(() => {
									loading.close();
							});
					});
		},
		confirmForm(){//抽屉保存
			const self = this
			this.$refs["form"].validate((valid) =>{
				if(valid){
					self.btnLoading = true
					if(self.drawerType == 'add'){
						self.form.areamanage = self.form.area[0]
						self.form.building = self.form.area[1]
						self.form.floormanage = self.form.area[2]
						addDormitory(self.form).then(resp=>{
							self.showDrawer = false;
							self.$toast("新增成功！");
							self.getList();
						}).finally((error) => {
								self.btnLoading = false;
						});
					}else{
						self.form.areamanage = self.form.area[0]
						self.form.building = self.form.area[1]
						self.form.floormanage = self.form.area[2]
						updateDormitory(self.form, self.itemId)
						    .then((resp) => {
						        self.showDrawer = false;
						        self.$toast("编辑成功！");
						        self.getList();
						    })
						    .finally((error) => {
						        self.btnLoading = false;
						    });
					}
				}
			})
		},
		drawerClosed(){//抽屉取消
			this.showDrawer = false;
			(this.form = {
			    area: [],
			    dormitoryCode: "",
			    proportion: "",
			}),
			this.resetForm("form");
		}
	},
	created() {
	    this.getList();
	},
}
</script>

<style>
</style>
