<template>
	<div class="app-container">
		<div class="operation">
			<el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<!-- 表格 -->
		<el-table :data="tableData" class="yg-table" v-loading="loading">
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
					<el-button
						size="mini"
						type="text"
						@click="operation('edit', scope.row.id)"
						>编辑</el-button>
					<el-button
						size="mini"
						type="text"
						@click="toBuilding(scope.row.id)"
						>建筑管理</el-button>
					<el-button
						size="mini"
						type="text"
						@click="MapAdmin(scope.row.id)"
						>地图管理</el-button>
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
			 :confirmLoading="btnLoading"
		>
			<h4>位置设置</h4>
			</br>
			<el-form 
				:model="form"
				:rules="rules"
				ref="form">
				<el-form-item label="区域名称" prop="area_name">
					<el-input
					    v-model="form.area_name"
					    placeholder="请输入区域名称"
					></el-input>
				</el-form-item>
				<el-form-item label="请输入负责人" prop="principal">
					<el-input
					    v-model="form.principal"
					    placeholder="请输入负责人"
					></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="contact">
					<el-input
					    v-model="form.contact"
					    placeholder="请输入负责人联系方式"
					></el-input>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
		<Yg-Drawer
			v-model="showMapDrawer"
			title="地图管理"
			@confirm="mapconfirmForm"
			@closed="mapdrawerClosed"
			@cancel="mapdrawerClosed"
		>
			<el-form>
				<el-form-item label="上传图片">
					<UploadImg v-model="imgList" :limit="1"></UploadImg>
				</el-form-item>
				<el-form-item label="地图资源">
					<el-input
						type="textarea"
						placeholder="请输入内容"
						v-model="mapres"
						resize="none"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="中心坐标">
					<el-input v-model="COI" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
import {getList,addArea,delArea,updateArea,getInfo} from "@/request/api/market/areaAdmin/areaAdmin";
export default {
	name: "Areamgmt",
	data() {
		return {
			COI:'',
			mapres:'',
			imgList:[],
			btnLoading:false,
			total:0,
			showMapDrawer:false,
			showDrawer:false,
			drawerType:"",
			itemId: undefined,
			tableData:[],
			loading:true,
			paging: {
				pageNum: 1,
				pageSize: 20,
			},
			form:{},
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
		};
	},
	methods: {
		getInfo() {
		    const self = this,
		    loading = this.$load();
		    getInfo(this.itemId)
		        .then((response) => {
							// console.log(response)
		            let res = self.filterObj(response.data, [
		                "area_name",
										"principal",
										"contact"
		            ]);
		            self.form = res;
		        })
		        .finally((error) => {
		            self.$nextTick(() => {
		                loading.close();
		            });
		        });
		},
		mapconfirmForm(){
			let res = {}
			for(let i=0;i<this.tableData.length;i++){
				if(this.tableData[i].id == this.itemId){
					res.area_name = this.tableData[i].area_name
					res.principal = this.tableData[i].principal
					res.contact = this.tableData[i].contact
				}
			}
			res.map = this.imgList.join(',')
			res.map_resource = this.mapres
			res.center = this.COI
			res.is_map = 1
			updateArea(res, this.itemId).then(resp=>{
				this.showMapDrawer = false;
				this.$toast("编辑成功！");
				this.getList();
			}).finally(error=>{
				this.btnLoading = false;
			})
		},
		MapAdmin(id){ //打开地图管理
			this.showMapDrawer = true
			this.itemId = id;
			const self = this,
			loading = this.$load();
			getInfo(this.itemId)
			.then((resp)=>{
				let res = resp.data
				self.imgList = res.map ? [res.map] : [];
				self.mapres = res.map_resource
				self.COI = res.center
			}).finally((error) => {
		            self.$nextTick(() => {
		                loading.close();
		            });
		        });
		},
		operation(type,id){
			this.form = {}
			this.showDrawer = true;
			this.drawerType = type;
			this.itemId = id;
			type == "edit" && this.getInfo();
		},
		getList(){
			this.loading = true
			getList(this.paging).then(resp=>{
				this.tableData = resp.data.results
				this.total = resp.data.count;
			}).finally((error)=>{
				this.loading = false
			})
		},
		confirmForm(){//抽屉保存
			const self = this
			self.$refs['form'].validate((vaild)=>{
				if(vaild){
					self.btnLoading = true
					if(self.drawerType == "add"){//新增
						addArea(self.form).then(resp=>{
							self.showDrawer = false;
							self.$toast("新增成功！");
							self.getList();
							self.form={}
						}).finally(error=>{
							self.btnLoading = false;
						})
					}else{//编辑
						updateArea(self.form, self.itemId).then(resp=>{
							self.showDrawer = false;
							self.$toast("编辑成功！");
							self.getList();
						}).finally(error=>{
							self.btnLoading = false;
						})
					}
				}
			})
		},
		del(id){//删除区域
			const self = this;
			self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    type: "warning",
			}).then(()=>{
				delArea(id).then((res) => {
				    self.$toast("删除成功！");
				    self.getList();
				});
			})
		},
		drawerClosed(){//抽屉取消
			this.showDrawer = false
		},
		toBuilding(id){
			// 建筑管理
			// this.$router.push("/building")
			this.$router.push({path:'/building',query:{id:id}})
			// 楼层管理
			// this.$router.push("/floor")
		},
		mapdrawerClosed(){
			this.showMapDrawer = false
		},
		
	},
	created() {
		this.getList()
		// console.log(this.$route)
	},
};
</script>

<style scoped lang="scss">
</style>

