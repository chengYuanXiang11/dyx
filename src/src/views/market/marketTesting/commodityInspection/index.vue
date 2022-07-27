<template>
	<div class="app-container">
		<el-form :model="queryForm" :inline="true">
			<el-form-item label="商品名称:" class="querForm-layout">
				<el-input v-model="queryForm.shopName" placeholder="请输入商品名称"></el-input>
			</el-form-item>
			<el-form-item label="商户名称:" class="querForm-layout">
				<el-input v-model="queryForm.commercialTenant" placeholder="请输入商户名称"></el-input>
			</el-form-item>
			<el-form-item label="时间:" class="querForm-layout">
				<el-date-picker v-model="queryForm.create_datetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
					placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item style="float: right;">
				<el-button @click="reset">重置</el-button>
				<el-button type="primary" @click="query">查询</el-button>
				<el-button type="text" v-if="afold == false" @click="isafold">展开<i class="el-icon-arrow-down"></i>
				</el-button>
				<el-button type="text" v-if="afold == true" @click="isafold">收起<i class="el-icon-arrow-up"></i>
				</el-button>
			</el-form-item>
			</br>
			<el-form-item label="检测类型" class="querForm-layout" v-if="afold">
				<el-select v-model="queryForm.detectionType" placeholder="请选择" clearable>
					<el-option label="送检" value="送检"></el-option>
					<el-option label="抽检" value="抽检"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否合格" class="querForm-layout" v-if="afold">
				<el-select v-model="queryForm.checkResult" placeholder="请选择" clearable>
					<el-option label="合格" value="合格"></el-option>
					<el-option label="不合格" value="不合格"></el-option>
					<el-option label="未检测" value="未检测"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-divider></el-divider>
		<div class="operation">
			<el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<el-table :data="tableData" class="yg-table">
			<el-table-column label="商品名称" prop="shopName" />
			<el-table-column label="批次" prop="batch" />
			<el-table-column label="商户" prop="commercialTenant.storeName" />
			<el-table-column label="检测类型" prop="detectionType" />
			<el-table-column label="时间" prop="create_datetime" />
			<el-table-column label="是否合格">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.checkResult == '合格'">合格</el-tag>
					<el-tag type="danger" v-if="scope.row.checkResult == '不合格'">不合格</el-tag>
					<el-tag type="info" v-if="scope.row.checkResult == '未检测'">未检测</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" v-if="scope.row.checkResult != '未检测'" @click="checkMsg(scope.row.id)">查看</el-button>
					<el-button type="text" v-if="scope.row.checkResult == '未检测'"
						@click="operation('edit',scope.row.id)">编辑</el-button>
					<el-button type="text" v-if="scope.row.checkResult == '未检测'" @click="del(scope.row.id)">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination :total="total" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
		<!-- 新建抽屉 -->
		<Yg-Drawer v-model="showDrawer" :title="(drawerType == 'add' ? '新建' : '编辑')" @confirm="confirmForm"
			@closed="drawerClosed" @cancel="drawerClosed">
			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
				<el-form-item label="检测类型" prop="detectionType">
					<el-radio-group v-model="form.detectionType">
						<el-radio label="送检"></el-radio>
						<el-radio label="抽检" v-if="drawerType == 'add'"></el-radio>
					</el-radio-group>
				</el-form-item>
				<div v-if="form.detectionType == '送检'">
					<el-form-item label="商品名称" prop="shopName">
						<el-select v-model="form.shopName" filterable remote reserve-keyword placeholder="请输入关键词"
							:remote-method="getShopName" :loading="loading">
							<el-option v-for="item in goodsoptions" :key="item.id" :label="item.name"
								:value="item.name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属商户" prop="commercialTenant">
						<el-select v-model="form.commercialTenant" filterable remote reserve-keyword
							placeholder="请输入关键词" :remote-method="getcommercialTenant" :loading="loading">
							<el-option v-for="item in shopsoptions" :key="item.id" :label="item.storeName"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="批次">
						<el-input v-model="form.batch" placeholder="请输入批次" style="width: 50%;"></el-input>
					</el-form-item>
					<el-form-item label="检测单号">
						<el-input v-model="form.detectionOddNumbers" placeholder="请输入检测单号" style="width: 50%;">
						</el-input>
					</el-form-item>
					<el-form-item label="商品检测单" prop="shopDetectionType" :rules="[{required: true, message: '请选择', trigger: 'blur'}]">
						<el-select v-model="form.shopDetectionType.typeName" placeholder="请选择" @change="getItem">
							<el-option v-for="item in testoptions" :key="item.id" :label="item.typeName" :value="item.typeName">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-form :model="form.shopDetectionType" ref="form" :rules="rules">
							<el-form-item v-for="(item,index) in form.shopDetectionType.project"
								:label="item.detectionName" :key="index" :prop="'project.' + index + '.nums'" :rules="[
									{required: true, message: '不能为空', trigger: 'blur'}]" style="margin-bottom: 20px;">
								<el-input v-model="item.nums" style="width: 30%;margin-right: 5px;"
									onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>{{item.unit}}
								<el-radio-group v-model="item.result"
									:fill="item.result == '合格' ? '#52C41A' : '#FF4D4F'">
									<el-radio-button label="合格"></el-radio-button>
									<el-radio-button label="不合格"></el-radio-button>
								</el-radio-group>
							</el-form-item>
						</el-form>
					</el-form-item>
					<el-form-item label="样本位置" prop="sampleLocation">
						<el-input v-model="form.sampleLocation" style="width: 50%;" placeholder="请输入内容"></el-input>
					</el-form-item>
					<el-form-item label="检测单上传" prop="detectionBills">
						<UploadImg v-model="form.detectionBills"
							:limit="form.shopDetectionType.project.length <= 0 ? 1 : form.shopDetectionType.project.length">
						</UploadImg>
					</el-form-item>
				</div>
				<div v-if="form.detectionType == '抽检'">
					<el-form-item label="商品名称" prop="shopName">
						<el-select v-model="form.shopName" filterable remote reserve-keyword placeholder="请输入关键词"
							:remote-method="getShopName" :loading="loading">
							<el-option v-for="item in goodsoptions" :key="item.id" :label="item.name"
								:value="item.name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属商户" prop="commercialTenant">
						<el-select v-model="form.commercialTenant" filterable remote reserve-keyword
							placeholder="请输入关键词" :remote-method="getcommercialTenant" :loading="loading">
							<el-option v-for="item in shopsoptions" :key="item.id" :label="item.storeName"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</div>
			</el-form>
		</Yg-Drawer>
		<Yg-Drawer v-model="checkDrawer" title="查看" confirmBtnText="确定"  @confirm="CdrawerClosed"
			@closed="CdrawerClosed" @cancel="CdrawerClosed">
			<el-form label-width="120px">
			  <el-form-item label="检测类型">
			    {{form.detectionType}}
			  </el-form-item>
			  <el-form-item label="商品名称">
			    {{checkForm.shopName}}
			  </el-form-item>
			  <el-form-item label="所属商户">
			    {{checkForm.commercialTenant.storeName}}
			  </el-form-item>
			  <el-form-item label="批次">
			    {{checkForm.batch}}
			  </el-form-item>
			  <el-form-item label="检测单号">
			    {{checkForm.detectionOddNumbers}}
			  </el-form-item>
			  <el-form-item label="商品检测单">
			    {{checkForm.shopDetectionType.typeName}}
					<el-form-item v-for="(item,index) in checkForm.shopDetectionType.project" :key="index">
						{{item.detectionName}}&nbsp;&nbsp;&nbsp;农药残留&nbsp;&nbsp;&nbsp;{{item.nums}}{{item.unit}}&nbsp;&nbsp;&nbsp;&nbsp;
						<el-tag :type="item.result=='合格' ? 'success' : 'danger'">{{item.result}}</el-tag>
					</el-form-item>
			  </el-form-item>
			  <el-form-item label="样本位置">
			    {{checkForm.sampleLocation}}
			  </el-form-item>
			  <el-form-item label="检测单图片">
					<el-image
					v-for="(item,index) in checkForm.detectionBills"
					:key="index"
					style="width: 100px; height: 100px;margin-right: 15px;"
					:src="item"
					fit="fit"></el-image>
			  </el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
	import {
		getList,
		queryGoods,
		queryShops,
		queryTestItem,
		addShops,
		delShops,
		getInfo,
		editTest
	} from '../../../../request/api/market/marketTesting/commodityInspection.js'
	export default {
		data() {
			return {
				itemId: '',
				testoptions: [],
				shopsoptions: [],
				goodsoptions: [],
				loading: false,
				form: {
					detectionType: '送检',
					shopDetectionType: {
						typeName: '',
						project: []
					},
					commercialTenant:''
				},
				rules: {
					detectionType: [{
						required: true,
						message: "请选择检测类型",
						trigger: "blur",
					}],
					shopName: [{
						required: true,
						message: "请选择商品",
						trigger: "blur",
					}],
					commercialTenant: [{
						required: true,
						message: "请选择商户",
						trigger: "blur",
					}],
					shopDetectionType: [{
						required: true,
						message: "请选择检测单",
						trigger: "blur",
					}],
					sampleLocation: [{
						required: true,
						message: "请选择检测类型",
						trigger: "blur",
					}],
					detectionBills: [{
						required: true,
						message: "请上传检测单",
						trigger: "blur",
					}],
				},
				checkForm:{
					shopDetectionType:'',
					commercialTenant:{}
				},
				checkDrawer:false,
				showDrawer: false,
				drawerType: '',
				total: 1,
				tableData: [],
				afold: false,
				queryForm: {
					pageNum: 1,
					pageSize: 20,
				}
			};
		},
		methods: {
			checkMsg(id){
				// console.log(id)
				this.checkDrawer = true
				this.itemId = id
				getInfo(this.itemId).then(resp=>{
					// console.log(resp)
					this.checkForm = resp.data
				})
				
			},
			getInfo(){
				getInfo(this.itemId).then(resp=>{
					// this.checkForm = resp.data
					this.form = {
						detectionType: '送检',
						shopDetectionType: {
							typeName: '',
							project: []
						}
					}
					this.form.shopName = resp.data.shopName	
					this.form.commercialTenant = resp.data.commercialTenant.storeName
					// console.log(this.form)
				})
			},
			del(id) {
				// console.log(id)
				const self = this;
				self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					delShops(id).then((res) => {
						self.$toast("删除成功！");
						self.getList();
					});
				});
			},
			getItem(res) {
				let obj = ''
				for (let i = 0; i < this.testoptions.length; i++) {
					if (this.testoptions[i].typeName == res) {
						obj = this.testoptions[i].detectionItem
					}
				}
				obj = JSON.parse(obj)
				for (let i = 0; i < obj.length; i++) {
					obj[i].nums = 0
					obj[i].result = '合格'
				}
				this.form.shopDetectionType.project = obj
				// console.log(this.form.shopDetectionType.project)
			},
			getTestItem() {
			
					let paging = {
						pageNum: 1,
						pageSize: 99
					};
					queryTestItem(paging).then(resp => {
						this.testoptions = resp.data.results
						// console.log(this.testoptions)
					})
				
			},
			getcommercialTenant(query) { //获取匹配的商户列表
				if (query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						queryShops(query).then(resp => {
							this.shopsoptions = resp.data.results
						})
					}, 200);
				} else {
					this.shopsoptions = [];
				}
			},
			getShopName(query) { //获取匹配的商品列表
				if (query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						queryGoods(query).then(resp => {
							this.goodsoptions = resp.data.results
							// console.log(this.goodsoptions)
						})
					}, 200);
				} else {
					this.goodsoptions = [];
				}
			},
			operation(type, id) {
				this.showDrawer = true
				this.drawerType = type
				this.itemId = id
				this.getTestItem()
				type == "edit" && this.getInfo();
			},
			confirmForm() { //抽屉确定
				const self = this
				this.$refs["form"].validate((valid) => {
					if (valid) {
						if (self.drawerType == 'add') {
							if (self.form.detectionType == '送检') {
								// self.form.shopDetectionType.project = self.testitem
								addShops(self.form).then(resp => {
									self.showDrawer = false;
									self.$toast("新增成功！");
									self.getList();
								})
							} else {
								let res = self.filterObj(self.form,[
									"commercialTenant",
									"detectionType",
									"shopName"
								])
								res.commercialTenant = self.form.commercialTenant
								// console.log(res,self.form)
								addShops(res).then(resp => {
									self.showDrawer = false;
									self.$toast("新增成功！");
									self.getList();
								})
							}
						}else{
							// console.log(self.form.commercialTenant)
							let res = self.form
							res.commercialTenant = self.form.commercialTenant.id
							editTest(self.form,self.itemId).then(resp=>{
								self.showDrawer = false;
								self.$toast("编辑成功！");
								self.getList();
							})
						}
					}
				})
			},
			CdrawerClosed(){
				(this.form = {
					detectionType: '送检',
					shopDetectionType: {
						typeName: '',
						project: []
					},
					commercialTenant:{
						storeName:'',
						id:''
					}
				}),
					this.resetForm("form");
					this.checkDrawer = false
			},
			drawerClosed() { //抽屉取消、关闭
				this.showDrawer = false;
				(this.form = {
					detectionType: '送检',
					shopDetectionType: {
						typeName: '',
						project: []
					},
					commercialTenant:{
						storeName:'',
						id:''
					}
				}),
				// this.testitem = []
					this.testoptions = [],
					this.shopsoptions = [],
					this.resetForm("form");
			},
			reset() { //重置查询
				this.queryForm = {
					pageNum: 1,
					pageSize: 20,
				};
				this.getList()
			},
			query() { //查询
				this.getList()
			},
			getList() { //获取列表
				getList(this.queryForm).then(resp => {
					this.tableData = resp.data.results
					this.total = resp.data.count
					// console.log(this.tableData)
				})
			},
			isafold() { //展开收起
				this.afold = !this.afold
			},
		},
		created() {
			// console.log(this.$route)
			this.getList()
		},
	};
</script>

<style scoped lang="scss">
	.querForm-layout {
		margin-right: 30px;
	}
</style>
