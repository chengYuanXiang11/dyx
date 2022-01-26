<template>
	<div class="app-container">
		<div class="operation">
		    <el-button type="primary" @click="operation('add')">新建</el-button>
		</div>
		<!-- 表格 -->
		<el-table :data="tableData" class="yg-table" v-loading="loading">
			<el-table-column label="商铺编号" prop="shopCode" />
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
						>编辑</el-button
					>
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
			<el-form ref="form" :model="form" :rules="rules">
				<el-form-item label="选择区域" prop="area">
						<AreaSelect v-model="form.area"></AreaSelect>
				</el-form-item>
				<h4>铺位设置</h4>
				<el-form-item label="铺位编号" prop="shopCode">
					<el-input
					    v-model="form.shopCode"
					    placeholder="铺位编号"
					></el-input>
				</el-form-item>
				<el-form-item label="面积" prop="proportion">
					<el-input
					    v-model="form.proportion"
					    placeholder="面积"
					></el-input>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
	</div>
</template>

<script>
import { getList,addShops,getInfo,updateShops,delShops } from "@/request/api/market/shopsAdmin/shopsAdmin";
import AreaSelect from "@/views/components/areaSelect/index";
export default {
    data() {
        return {
						btnLoading: false,
            loading: true,
            tableData: [],
            paging: {
                pageNum: 1,
                pageSize: 20,
            },
            total: 0,
            showDrawer: false,
            drawerType: "",
            itemId: undefined,
            form: {
                area: [],
								shopCode:'',
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
				del(id){//删除
					const self = this;
					self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
					    confirmButtonText: "确定",
					    cancelButtonText: "取消",
					    type: "warning",
					}).then(()=>{
						delShops(id).then((res) => {
						    self.$toast("删除成功！");
						    self.getList();
						});
					})
				},
				getInfo(){
					const self = this,
					loading = this.$load();
					getInfo(this.itemId).then(resp=>{
						let res = self.filterObj(resp.data,[
							"areamanage",
							"building",
							"floormanage",
							"shopCode",
							"proportion"
						]);
						// console.log(res)
						self.form.area = [res.areamanage.id,res.building.id,res.floormanage.id]
						self.form.shopCode = res.shopCode
						self.form.proportion = res.proportion
					// console.log(111)
						// console.log(self.form)
					}).finally((error) => {
							self.$nextTick(() => {
									loading.close();
							});
					});
				},
        getList() {
            //商铺列表
            this.loading = true;
            getList(this.paging)
                .then((resp) => {
                    // console.log(resp.data);
										this.tableData = resp.data.results
										this.total = resp.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        operation(type, id) {
            //新增按钮触发
						// console.log(type,id)
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
							if(valid){
								self.btnLoading = true;
								// console.log(self.drawerType)
								if(self.drawerType == 'add'){//新增
									self.form.areamanage = self.form.area[0]
									self.form.building = self.form.area[1]
									self.form.floormanage = self.form.area[2]
									// console.log(self.form)
									addShops(self.form)
										.then((resp)=>{
											self.showDrawer = false;
											self.$toast("新增成功！");
											self.getList();
										})
										.finally((error) => {
										    self.btnLoading = false;
										});
								}else {
									self.form.areamanage = self.form.area[0]
									self.form.building = self.form.area[1]
									self.form.floormanage = self.form.area[2]
									updateShops(self.form, self.itemId)
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
        drawerClosed() {
            //抽屉取消
            // console.log("取消");
						this.showDrawer = false;
						(this.form = {
						    area: "",
						    shopCode: "",
						    proportion: "",
						}),
						this.resetForm("form");
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style>
</style>
