<template>
    <div class="app-container">
			<div class="operation">
				<el-button type="primary" @click="operation('add')">新建</el-button>
			</div>
			<el-table class="yg-table" :data="tableData">
				<el-table-column label="类别名称" prop="typeName"/>
				<el-table-column label="检测项数量" prop="detectionNumber"/>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
						<el-button type="text" @click="del(scope.row.id)">删除</el-button>
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
			<Yg-Drawer
				 v-model="showDrawer"
				 :title="(drawerType == 'add' ? '新建' : '编辑')"
				 @confirm="confirmForm"
				 @closed="drawerClosed"
				 @cancel="drawerClosed"
				 :confirmLoading="btnLoading"
			>
				<el-form ref="form" :model="form" :rules="rules" label-width="100px">
					<el-form-item label="检测单名称:" prop="typeName">
						<el-input
								style="width: 80%;"
								v-model="form.typeName"
								placeholder="请输入检测单名称"
						></el-input>
					</el-form-item>
					<el-form-item label="检测的项目" :rules="{required: true, message: '检测项不能为空', trigger: 'blur'}">
						<el-card class="box-card" style="width: 80%;margin-bottom: 10px;padding-bottom: 15px;" 
						v-for="(item,index) in form.detectionItem" :key="index">
						  <el-col :span="24" class="card-layout">
								<el-col :span="23"><font size="3">项目{{index+1}}</font></el-col>
								<el-col :span="1" style="position: relative;">
									<el-button type="text" @click="delcard(index)" style="position: absolute;">
										<i class="el-icon-delete" style="margin-left: 7px;font-size: 17px;"></i>
									</el-button>
								</el-col>
							</el-col>
							<el-form-item label="名称" :prop="'detectionItem.' + index + '.detectionName'" 
							style="margin-bottom: 20px;"
							:rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
								<el-input v-model="item.detectionName" style="width: 80%;" size="mini"></el-input>
							</el-form-item>
							<el-form-item label="单位" :prop="'detectionItem.' + index + '.unit'"
							:rules="{required: true, message: '单位不能为空', trigger: 'blur'}">
								<el-input v-model="item.unit" style="width: 80%;" size="mini"></el-input>
							</el-form-item>
						</el-card>
					</el-form-item>
					<el-form-item>
						<el-button type="text" @click="additem">+ 新增巡检项</el-button>
					</el-form-item>
				</el-form>
			</Yg-Drawer>
    </div>
</template>

<script>
import {getList,addTest,getInfo,updateTest,delTest} from '../../../../request/api/market/marketTesting/testitem.js'
export default {
    data() {
        return {
					form:{
						typeName:'',
						detectionItem:[
							{detectionName:'',unit:''},
						]
					},
					rules:{
						typeName:{required: true, message: '检测单名称不能为空', trigger: 'blur'},
					},
					itemId:'',
					drawerType:'',
					btnLoading:false,
					showDrawer:false,
          tableData:[],
					paging: {
						pageNum: 1,
						pageSize: 20,
					},
					total:0
        };
    },
    methods: {
			del(id){
				const self = this;
				self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
				    confirmButtonText: "确定",
				    cancelButtonText: "取消",
				    type: "warning",
				}).then(() => {
				    delTest(id).then((res) => {
				        self.$toast("删除成功！");
				        self.getList();
				    });
				});
			},
			delcard(index){
				this.form.detectionItem.splice(index,1)
			},
			getInfo(){
				const self = this
				getInfo(this.itemId).then(resp=>{
					self.form.typeName = resp.data.typeName
					self.form.detectionItem = JSON.parse(resp.data.detectionItem)
				})
			},
			additem(){
				this.form.detectionItem.push({
					detectionName:'',
					unit:''
				})
			},
			operation(type,id){
				this.showDrawer = true;
				this.drawerType = type;
				this.itemId = id;
				type == "edit" && this.getInfo();
			},
			drawerClosed(){//抽屉取消
				this.showDrawer = false;
				(this.form={
						typeName:'',
						detectionItem:[
							{detectionName:'',unit:''},
						]
					}),
				this.resetForm("form");
			},
			confirmForm(){//抽屉确定
				const self = this
				// console.log(self.form)
				this.$refs["form"].validate((valid) =>{
					if(valid){
						if(self.drawerType == "add"){
							addTest(self.form).then(resp=>{
								self.showDrawer = false;
								self.$toast("新增成功！");
								self.getList();
							})
						}else{
							
							updateTest(self.form,self.itemId).then(resp=>{
								self.showDrawer = false;
								self.$toast("编辑成功！");
								self.getList();
							})
						}
					}
				})
			},
			getList(){//获取列表
				getList(this.paging).then(resp=>{
					// console.log(resp)
					this.tableData = resp.data.results;
					this.total = resp.data.count;
					// console.log(this.tableData)
				})
			}
    },
    created() {
        // console.log(this.$route)
				this.getList()
    },
};
</script>

<style scoped lang="scss">
	.card-layout{
		margin-bottom: 15px;
	}
</style>

