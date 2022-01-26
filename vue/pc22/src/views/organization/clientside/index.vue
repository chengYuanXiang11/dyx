<template>
	<Table-page
	    :page-size="search.pageSize"
	    :total="search.total"
	    :page-num="search.pageNum"
	    :searchForm="search.form"
	    @pagination="handlePagination"
	    @search="handleSearch"
			label-width="300px"
	>
	<template slot="action-bar">
		<el-button
		    v-hasPermi="['permission:role:post']"
		    type="primary"
		    icon="el-icon-plus"
		    @click="operation('add')"
		    >新增</el-button>
	</template>
	<el-table class="yg-table" :data="tableData" height="100%">
		<el-table-column label="客户端名称" prop="desktop_name"></el-table-column>
		<el-table-column label="关联人员数量" prop="personnel_count"></el-table-column>
		<el-table-column label="关联设备数量" prop="devices_count"></el-table-column>
		<el-table-column label="状态" prop="status"></el-table-column>
		<el-table-column label="操作">
			<template slot-scope="scope">
				<el-button type="text" @click="operation('edit',scope.row.id)">编辑</el-button>
				<el-button type="text" @click="del(scope.row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<Drawer
		:visible.sync="showDrawer"
		:title="(drawerType == 'add' ? '新建' : '编辑')"
		@confirm="confirmForm"
		@closed="drawerClosed"
	>
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" class="form_label_styl">
		  <el-form-item label="客户端名称" prop="name">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="设备唯一编码" prop="code">
				<el-input v-model="form.code"></el-input>
			</el-form-item>
			<el-form-item label="状态">
				<el-radio label="1" v-model="form.state">正常</el-radio>
				<el-radio label="2" v-model="form.state">停用</el-radio>
			</el-form-item>
			<el-form-item label="人员设置" prop="datas">
				<select-users v-model="form.datas" type="user" :multiple="true"></select-users>
			</el-form-item>
			<el-form-item label="选择设备" prop="device">
				<el-select v-model="form.device" filterable placeholder="请选择" multiple style="width: 100%;">
					<el-option
						v-for="item in options"
						:key="'options' + item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="菜单权限" prop="power">
				<el-checkbox
				    v-model="menuExpand"
				    @change="handleCheckedTreeExpand($event, 'menu')"
				    >展开/折叠</el-checkbox
				>
				<el-checkbox
				    v-model="menuNodeAll"
				    @change="handleCheckedTreeNodeAll($event, 'menu')"
				    >全选/全不选</el-checkbox
				>
				<el-checkbox
				    v-model="form.menuCheckStrictly"
				    @change="handleCheckedTreeConnect($event, 'menu')"
				    >父子联动</el-checkbox
				>
				<el-tree
				    ref="menu"
				    class="tree-border"
				    :data="menuOptions"
				    show-checkbox
				    node-key="id"
				    :check-strictly="!form.menuCheckStrictly"
				    empty-text="加载中，请稍后"
				    :props="defaultProps"
				/>
			</el-form-item>
		</el-form>
	</Drawer>
	
	</Table-page>
</template>

<script>
import {
    treeselect as menuTreeselect,
    roleMenuTreeselect,
} from "@/request/api/organization/menu";
import { roleDeptTreeselect } from "@/request/api/organization/dept";
import { getList } from '@/request/api/lot/device/index.js';
import { getClientList,addClientside,delClientside,getInfo,updateClientside } from '@/request/api/organization/clientside.js';
export default{
	data(){
		return{
			options:[],
			queryParams:{},
			search: {
			    pageNum: 1,
			    pageSize: 10,
			    total: 0,
			    form: [
			        {
			            name: "desktop_name",
			            label: "客户端名称",
			            type: "input",
			        }
			    ],
			},
			defaultProps: {
			    children: "children",
			    label: "label",
			},
			// 菜单列表
			menuOptions: [],
			menuExpand: false,
			menuNodeAll: false,
			showstaffDialog: false,
			form:{
				device:[],
				state:"1",
				datas:[]
			},
			rules:{
				name:[{required: true,message: "客户端名称不能为空",trigger: "blur"}],
				code:[{required: true,message: "设备唯一编码不能为空",trigger: "blur"}],
				datas:[{required: true,message: "不能为空",trigger: "blur"}],
				power:[{required: true,message: "不能为空",trigger: "blur"}]
			},
			queryName:'',
			tableData:[],
			btnLoading:false,
			loading:false,
			showDrawer:false,
			itemId:'',
			drawerType:'',
		}
	},
	methods:{
		//删除
		del(id){
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				delClientside(id).then(resp=>{
					this.$error('删除成功！');
					this.getList()
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		// 分页方法
		handlePagination(e) {
			this.search.pageNum = e.pageNum;
			this.getList();
		},
		handleSearch(e) {
			this.queryParams = e;
			this.search.pageNum = 1;
			this.getList();
		},
		confirmForm(){
			this.form.power = this.getMenuAllCheckedKeys()
			// console.log(this.form)
			const self = this
			self.$refs['form'].validate((valid)=>{
				if(valid){
					// console.log(self.form)
					let res = {
						desktop_name:self.form.name,
						device_code:self.form.code,
						status:self.form.state,
						devices_count: self.form.power.length,
						personnel_count: self.form.datas.length,
						persons: self.form.datas.map(item=>{return item.user_id}),
						menu: self.form.power,
						device: self.form.device
					}
						// console.log(res)
					if(self.drawerType == 'add'){
						addClientside(res).then(resp=>{
							self.$success('新增成功！');
							self.showDrawer = false;
							self.getList()
						})
					}else{
						updateClientside(self.itemId,res).then(resp=>{
							self.$success('修改成功！');
							self.showDrawer = false;
							self.getList()
						})
					}
				}
			})
		},
		drawerClosed(){
			this.$refs.menu.setCheckedKeys([]);
			this.form={
				device:[],
				state:"1",
				datas:[],
				power:[]
			}
		},
		getList(){
			getClientList(this.queryFormat(this.queryParams, this.search)).then(resp=>{
				this.tableData = resp.data.results
				this.search.total = resp.data.count
			})
		},
		getInfo(){
			getInfo(this.itemId).then(resp=>{
				// console.log(resp)
				let obj = resp.data
				let res = {
					name : obj.desktop_name,
					code : obj.device_code,
					state : obj.status,
					datas : obj.persons.map((item)=>{
						return {
							user_id : item.id,
							user_name : item.username
						}
					}),
					device : obj.device.map(item=>{
						return item.id
					}),
					power : obj.menu.map(item=>{
						return item.id
					}),
				}
				this.$refs.menu.setCheckedKeys(res.power);
				this.form = res
			})
		},
		// 所有菜单节点数据
		getMenuAllCheckedKeys() {
		    // 目前被选中的菜单节点
		    const checkedKeys = this.$refs.menu.getCheckedKeys();
		    // 半选中的菜单节点
		    const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
		    checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
		    return checkedKeys;
		},
		/** 查询菜单树结构 */
		getMenuTreeselect() {
		    menuTreeselect().then((response) => {
		        this.menuOptions = this.handleTree(response.data, "id");
		    });
		},
		// 树权限（展开/折叠）
		handleCheckedTreeExpand(value, type) {
		    if (type == "menu") {
		        const treeList = this.menuOptions;
		        for (let i = 0; i < treeList.length; i++) {
		            this.$refs.menu.store.nodesMap[treeList[i].id].expanded =
		                value;
		        }
		    } else if (type == "dept") {
		        const treeList = this.deptOptions;
		        for (let i = 0; i < treeList.length; i++) {
		            this.$refs.dept.store.nodesMap[treeList[i].id].expanded =
		                value;
		        }
		    }
		},
		// 树权限（全选/全不选）
		handleCheckedTreeNodeAll(value, type) {
		    if (type == "menu") {
		        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
		    } else if (type == "dept") {
		        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
		    }
		},
		// 树权限（父子联动）
		handleCheckedTreeConnect(value, type) {
		    if (type == "menu") {
		        this.form.menuCheckStrictly = !!value;
		    } else if (type == "dept") {
		        this.form.deptCheckStrictly = !!value;
		    }
		},
		operation(type,id){
			this.showDrawer = true;
			this.itemId = id;
			this.drawerType = type;
			this.getdevice();
			this.getMenuTreeselect();
			type == 'edit' && this.getInfo()
		},
		//获取设备信息
		getdevice(){
			getList({pageNum: 'all'}).then(resp=>{
				this.options = resp.data.map(item=>{
					return {value:`${item.id}`,label:`${item.device_name}`}
				})
			})
		},
	},
	created() {
		this.getList()
	}
}
</script>

<style scoped lang="scss">
	.input_layout{
		width: 15%;
	}
	/deep/ .el-form-item__label{
		width: 90px !important;
	}
	.form_label_styl /deep/ .el-form-item__label{
		width: 120px !important;
	}
</style>
