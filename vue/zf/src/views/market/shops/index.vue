<template>
	<Table-page
		:page-size="search.pageSize"
		:total="search.total"
		:page-num="search.pageNum"
		@pagination="handlePagination"
	>
		<template slot="action-bar">
			<el-button type="primary" @click="operation('add')" v-hasPermi="['123456']">新增</el-button>
		</template>
		<el-table :data="tableData" border height="100%">
			<el-table-column label="商铺编号" prop="shopCode" />
			<el-table-column label="面积/㎡" prop="proportion" />
			<el-table-column label="所属区域" prop="areamanage.area_name" />
			<el-table-column label="所属建筑" prop="building.building_name" />
			<el-table-column label="所在楼层" prop="floormanage.order_num" />
			<el-table-column label="操作" class-name="small-padding fixed-width" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
					<el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Drawer
			:visible.sync="showDrawer"
			v-loading="loading"
			element-loading-text="拼命加载中"
			:title="(drawerType == 'add' ? '新建' : '编辑')"
			:before-close="beforeClose"
			@confirm="confirmForm"
		>
			<h4>位置设置</h4>
			<el-form ref="form" :model="form" :rules="rules">
				<el-form-item label="选择区域" prop="area">
					<AreaSelect v-model="form.area"></AreaSelect>
				</el-form-item>
				<h4>铺位设置</h4>
				<el-form-item label="铺位编号" prop="shopCode">
					<el-input v-model="form.shopCode" placeholder="铺位编号"></el-input>
				</el-form-item>
				<el-form-item label="面积" prop="proportion">
					<el-input v-model="form.proportion" placeholder="面积"></el-input>
				</el-form-item>
			</el-form>
		</Drawer>
	</Table-page>
</template>

<script>
import { getList, addShops, getInfo, updateShops, delShops } from "@/request/api/market/shopsAdmin/shopsAdmin";
import AreaSelect from "@/views/components/areaSelect/index";
export default {
	data() {
		return {
			search: {
				pageNum: 1,
				pageSize: 10,
				total: 100,
				isOpen: false,
			},
			btnLoading: false,
			loading: true,
			tableData: [],
			total: 0,
			showDrawer: false,
			drawerType: "",
			itemId: undefined,
			form: {
				area: [],
				shopCode: '',
				proportion: ''
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
				shopCode: [
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
		};
	},
	components: {
		AreaSelect,
	},
	methods: {
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
		del(id) {//删除
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				delShops(id).then((res) => {
					self.$message({
						message: '删除成功！',
						type: 'success'
					});
					self.getList();
				});
			})
		},
		getInfo() {
			const self = this
			// loading = this.$load();
			getInfo(this.itemId).then(resp => {
				let res = self.filterObj(resp.data, [
					"areamanage",
					"building",
					"floormanage",
					"shopCode",
					"proportion"
				]);
				console.log(res)
				self.form.area = [res.areamanage.id, res.building.id, res.floormanage.id];
				self.form.shopCode = res.shopCode;
				self.form.proportion = res.proportion
				// console.log(111)
				// console.log(self.form)
			}).finally((error) => {
				self.$nextTick(() => {
					self.loading.close();
				});
			});
		},
		getList() {
			//商铺列表
			this.loading = true;
			getList(this.queryFormat(this.queryParams, this.search))
				.then((resp) => {
					// console.log(resp.data);
					this.tableData = resp.data.results;
					this.search.total = resp.data.count;
				})
				.finally((error) => {
					this.loading = false;
				});
		},
		operation(type, id) {
			//新增按钮触发
			// console.log(type,id)
			// this.form = {}
			this.showDrawer = true;
			this.itemId = id;
			this.drawerType = type;
			type == "edit" && this.getInfo();
		},
		confirmForm() {
			//抽屉保存
			// console.log("保存");
			const self = this;
			this.$refs["form"].validate((valid) => {
				if (valid) {
					self.btnLoading = true;
					// console.log(self.drawerType)
					if (self.drawerType == 'add') {//新增
						self.form.areamanage = self.form.area[0]
						self.form.building = self.form.area[1]
						self.form.floormanage = self.form.area[2]
						// console.log(self.form)
						addShops(self.form)
							.then((resp) => {
								self.showDrawer = false;
								self.$message({
									message: '新增成功！',
									type: 'success'
								});
								self.getList();
								self.beforeClose()
							})
							.finally((error) => {
								self.btnLoading = false;
							});
					} else {
						self.form.areamanage = self.form.area[0]
						self.form.building = self.form.area[1]
						self.form.floormanage = self.form.area[2]
						updateShops(self.form, self.itemId)
							.then((resp) => {
								self.showDrawer = false;
								self.$message({
									message: '编辑成功！',
									type: 'success'
								});
								self.getList();

							})
							.finally((error) => {
								self.btnLoading = false;
							});
					}
				}
			});
		},
		beforeClose() {
			this.showDrawer = false;
			this.form = {}
			this.form = {
				area: [],
				shopCode: '',
				proportion: ''
			}
		},
	},
	created() {
		this.getList();
	},
};
</script>

<style>
</style>
