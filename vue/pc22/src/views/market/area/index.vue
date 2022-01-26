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
			<el-table-column label="区域名称" prop="area_name" />
			<el-table-column label="负责人" prop="principal" />
			<el-table-column label="联系方式" prop="contact" />
			<el-table-column label="是否有地图">
				<template slot-scope="scope">
					<span v-if="scope.row.is_map == '1'">有</span>
					<span v-if="scope.row.is_map == '2'">没有</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" class-name="small-padding fixed-width" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="operation('edit', scope.row.id)">编辑</el-button>
					<el-button size="mini" type="text" @click="toBuilding(scope.row.id)">建筑管理</el-button>
					<el-button size="mini" type="text" @click="MapAdmin(scope.row.id)">地图管理</el-button>
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
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="区域名称" prop="area_name">
					<el-input v-model="form.area_name" placeholder="请输入区域名称"></el-input>
				</el-form-item>
				<el-form-item label="请输入负责人" prop="principal">
					<el-input v-model="form.principal" placeholder="请输入负责人"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="contact">
					<el-input v-model="form.contact" placeholder="请输入负责人联系方式"></el-input>
				</el-form-item>
			</el-form>
		</Drawer>
		<Drawer
			:visible.sync="showMapDrawer"
			v-loading="loading"
			element-loading-text="拼命加载中"
			title="地图管理"
			:before-close="mapdrawerClosed"
			@confirm="mapconfirmForm"
		>
			<el-form>
				<el-form-item label="上传图片">
					<Image-Upload :max="1" v-model="imgList"></Image-Upload>
				</el-form-item>
				<el-form-item label="地图资源">
					<el-input type="textarea" placeholder="请输入内容" v-model="mapres" resize="none"></el-input>
				</el-form-item>
				<el-form-item label="中心坐标">
					<el-input v-model="COI" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
		</Drawer>
	</Table-page>
</template>

<script>
import { getList, addArea, delArea, updateArea, getInfo } from "@/request/api/market/areaAdmin/areaAdmin";
export default {
	name: "Areamgmt",
	data() {
		return {
			showMapDrawer: false,
			COI: '',
			mapres: '',
			imgList: [],
			form: {},
			rules: {
				area_name: [
					{
						required: true,
						message: "请输入区域名称",
						trigger: "blur",
					},
				],
				principal: [
					{
						required: true,
						message: "请输入负责人",
						trigger: "blur",
					},
				],
				contact: [
					{
						required: true,
						message: "请输入负责人联系方式",
						trigger: "blur",
					},
				],
			},
			queryParams: {},
			itemId: '',
			loading: false,
			drawerType: '',
			showDrawer: false,
			tableData: [],
			search: {
				pageNum: 1,
				pageSize: 10,
				total: 100,
				isOpen: false,
			},
		};
	},
	methods: {
		toBuilding(id) {
			// 建筑管理
			// this.$router.push("/building")
			this.$router.push({ path: '/areaMgmt/building', query: { id: id } })
			// 楼层管理
			// this.$router.push("/floor")
		},
		mapdrawerClosed() {
			this.showMapDrawer = false
		},
		mapconfirmForm() {
			let res = {}
			for (let i = 0; i < this.tableData.length; i++) {
				if (this.tableData[i].id == this.itemId) {
					res.area_name = this.tableData[i].area_name
					res.principal = this.tableData[i].principal
					res.contact = this.tableData[i].contact
				}
			}
			res.map = this.imgList.join(',')
			res.map_resource = this.mapres
			res.center = this.COI
			res.is_map = 1
			updateArea(res, this.itemId).then(resp => {
				this.showMapDrawer = false;
				// this.$success("编辑成功！");
				this.getList();
			}).finally(error => {
				// this.btnLoading = false;
			})
		},
		MapAdmin(id) { //打开地图管理
			this.showMapDrawer = true
			this.itemId = id;
			const self = this
			// loading = this.$load();
			getInfo(this.itemId)
				.then((resp) => {
					let res = resp.data
					self.imgList = res.map ? [res.map] : [];
					self.mapres = res.map_resource
					self.COI = res.center
				}).finally((error) => {
					self.$nextTick(() => {
						// loading.close();
					});
				});
		},
		//抽屉保存
		confirmForm() {
			const self = this
			self.$refs['form'].validate((vaild) => {
				if (vaild) {
					// self.btnLoading = true
					if (self.drawerType == "add") {//新增
						addArea(self.form).then(resp => {
							self.showDrawer = false;
							self.$message({
								message: '编辑成功！',
								type: 'success'
							});
							self.getList();
							self.form = {}
						}).finally(error => {
							// self.btnLoading = false;
						})
					} else {//编辑
						updateArea(self.form, self.itemId).then(resp => {
							self.showDrawer = false;
							self.$message({
								message: '编辑成功！',
								type: 'success'
							});
							self.getList();
						}).finally(error => {
							// self.btnLoading = false;
						})
					}
				}
			})
		},
		beforeClose() {
			this.showDrawer = false
		},
		handlePagination(e) {
			this.search.pageNum = e.pageNum;
			this.getList();
		},
		handleSearch(e) {
			this.queryParams = e;
			this.search.pageNum = 1;
			this.getList();
		},
		getList() {
			this.loading = true
			getList(this.queryFormat(this.queryParams, this.search)).then(resp => {
				this.tableData = resp.data.results
				this.search.total = resp.data.count;
			}).finally((error) => {
				this.loading = false
			})
		},
		operation(type, id) {
			this.form = {}
			this.showDrawer = true;
			this.drawerType = type;
			this.itemId = id;
			type == "edit" && this.getInfo();
		},
		getInfo() {
			getInfo(this.itemId)
				.then((response) => {
					// console.log(response)
					let res = this.filterObj(response.data, [
						"area_name",
						"principal",
						"contact"
					]);
					this.form = res;
				})
		},
		del(id) {//删除区域
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				delArea(id).then((res) => {
					self.$message({
						message: '删除成功！',
						type: 'success'
					});
					self.getList();
				});
			})
		},
	},
	created() {
		this.getList()
	},
};
</script>

<style scoped lang="scss">
</style>

