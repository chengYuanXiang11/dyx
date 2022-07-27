<template>
    <div class="app-container">
			<div class="operation">
					<el-button type="primary" @click="operation('add')">新建</el-button>
			</div>
			<!-- 表格 -->
			<el-table class="yg-table" :data="tableData" v-loading="loading">
				<el-table-column label="仓库编号" prop="warehouseCode" />
				<el-table-column label="仓库容量" prop="warehouseCapacity" />
				<el-table-column label="仓库类型" prop="warehouseType.listName" />
				<el-table-column label="可存放类型">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.storageType" :key="index">{{item.listName}},</span>
					</template>
				</el-table-column>
				<el-table-column label="所属区域" prop="areamanage.area_name" />
				<el-table-column label="所属建筑" prop="building.building_name" />
				<el-table-column label="所属楼层" prop="floormanage.order_num" />
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="text"
							@click="toseat(scope.row.id)"
							>库位管理</el-button>
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
				<el-form ref="form" :model="form" :rules="rules" label-width="120px">
					<el-form-item label="选择区域" prop="area">
							<AreaSelect v-model="form.area"></AreaSelect>
					</el-form-item>
					<h4>仓库设置</h4>
					</br>
					<el-form-item label="仓库编号" prop="warehouseCode">
						<el-input
								style="width: 80%;"
								v-model="form.warehouseCode"
								placeholder="请输入仓库编号"
						></el-input>
					</el-form-item>
					<el-form-item prop="warehouseCapacity" label="仓库编号">
						<el-input
								style="width: 80%;"
								v-model="form.warehouseCapacity"
								placeholder="请输入仓库容量"
						></el-input>
					</el-form-item>
					<el-form-item label="仓库类型" prop="warehouseType">
						<el-select 
							v-model="form.warehouseType" 
							placeholder="请选择类型" 
							style="width: 80%;">
							<el-option 
							:label="item.label"
							:value="item.id"
							v-for="(item,index) in cangkuleixing" 
							:key="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="可存放类型" prop="storageType">
						<el-select 
							multiple 
							v-model="form.storageType" 
							placeholder="请选择类型" 
							style="width: 80%;">
							<el-option 
							:label="item.label"
							:value="item.id"
							v-for="(item,index) in kecunfangleixing" 
							:key="index"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</Yg-Drawer>
    </div>
</template>

<script>
import AreaSelect from "@/views/components/areaSelect/index";
import {getList,addWarehouse,getInfo,updateWarehouse,delWarehouse} from '../../../request/api/market/warehouseAdmin/warehouse.js'
export default {
    name: "warehouse",
		components: {
		    AreaSelect,
		},
    data() {
			return {
				cangkuleixing:[],
				kecunfangleixing:[],
				itemId:'',
				form:{
					"area":[],
					"warehouseCode":'',
					"warehouseCapacity":'',
					"warehouseType":'',
					"storageType":[]
				},
				rules:{
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
					warehouseCode: [
							{
									required: true,
									message: "请输入仓库编号",
									trigger: "blur",
							},
					],
					warehouseCapacity: [
							{
									required: true,
									message: "请输入仓库容量",
									trigger: "blur",
							},
					],
					warehouseType: [
							{
									required: true,
									message: "请选择仓库类型",
									trigger: "change",
							},
					],
					storageType: [
							{
									required: true,
									message: "请选择可存放类型",
									trigger: "change",
							},
					],
				},
				showDrawer:false,
				drawerType:'',
				tableData:[],
				loading:true,
				paging: {
					pageNum: 1,
					pageSize: 20,
				},
				total:0,
				btnLoading:false
			};
    },
    methods: {
			toseat(id){
				this.$router.push({path:'/seat',query:{id:id}})
			},
			del(id){//删除
				const self = this;
				self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
				    confirmButtonText: "确定",
				    cancelButtonText: "取消",
				    type: "warning",
				}).then(()=>{
					delWarehouse(id).then((res) => {
					    self.$toast("删除成功！");
					    self.getList();
					});
				})
			},
			confirmForm(){
				const self = this
				this.$refs['form'].validate((valid) => {
					if (valid) {
						self.btnLoading = true
						if(self.drawerType == 'add'){
							self.form.areamanage = self.form.area[0]
							self.form.building = self.form.area[1]
							self.form.floormanage = self.form.area[2]
							addWarehouse(self.form).then(resp=>{
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
							updateWarehouse(self.form, self.itemId)
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
				});
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
			getInfo(){
				const self = this,
				loading = this.$load();
				getInfo(this.itemId).then(resp=>{
					let res = self.filterObj(resp.data,[
						"areamanage",
						"building",
						"floormanage",
						"warehouseCode",
						"warehouseCapacity",
						"warehouseType",
						"storageType"
					]);
					self.form.area = [res.areamanage.id,res.building.id,res.floormanage.id]
					self.form.warehouseCode = res.warehouseCode
					self.form.warehouseCapacity = res.warehouseCapacity
					self.form.warehouseType = res.warehouseType.id
					let obj = res.storageType.map(item=>{
						return item.id
					})
					self.form.storageType = obj
				}).finally((error) => {
							self.$nextTick(() => {
									loading.close();
							});
					});
			},
			operation(type,id){
				this.showDrawer = true;
				this.drawerType = type;
				this.itemId = id;
				type == 'edit' && this.getInfo()
			},
			getList(){
				this.loading = true
				getList(this.paging).then((resp)=>{
					console.log(resp.data)
					this.tableData = resp.data.results
					this.total = resp.data.count;
					// console.log(this.tableData)
				}).finally((error)=>{
					this.loading = false
				})
			}
    },
    created() {
			this.getList()
			this.getDicts("warehouseType").then((response) => {
			    this.cangkuleixing = response.data;
			});
			this.getDicts("storageType").then((response) => {
			    this.kecunfangleixing = response.data;
			});
    },
};
</script>

<style scoped lang="scss">
</style>

