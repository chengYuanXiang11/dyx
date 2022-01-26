<template>
    <div class="app-container">
			<div class="app-container">
				<el-button type="primary" @click="operation('add')">新建</el-button>
			</div>
			<el-form ref="queryForm" :model="queryitem" :inline="true">
				<el-form-item label="区域名称" class="form-item_layout">
					<el-select v-model="queryitem.areaname" filterable placeholder="请选择">
						<el-option
							v-for="item in queryitem.arealist"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工" class="form-item_layout">
					<el-input v-model="queryitem.staff" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="负责人" class="form-item_layout">
					<el-input v-model="queryitem.principal" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="日期" class="form-item_layout" v-if="taskstate != '1'">
					<el-date-picker
						v-model="queryitem.cleaning_time"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="是否合格" class="form-item_layout" v-if="taskstate == '2'">
					<el-select v-model="queryitem.is_standard" placeholder="请选择">
						<el-option
							v-for="item in is_standard"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right;">
					<el-button type="primary" @click="query">搜索</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
			<el-radio-group v-model="taskstate" @change="changestate">
				<el-radio-button :label="1">待完成</el-radio-button>
				<el-radio-button :label="2">已完成</el-radio-button>
				<el-radio-button :label="3">已失效</el-radio-button>	
			</el-radio-group>
			<el-table class="yg-table" :data="tableData" v-loading="loading">
				<!-- <el-table-column label="日期" v-if="taskstate != '1'" prop="complete_datetime" key="1"/> -->
				<el-table-column label="区域" prop="area"  key="2"/>
				<el-table-column label="员工" prop="staff" key="3">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.staff" :key="index">{{item.user_name}},</span>
					</template>
				</el-table-column >
				<el-table-column label="打扫时间" prop="cleaning_time" key="4" width="160px"/>
				<el-table-column label="完成时间" v-if="taskstate == '2'" prop="complete_time"  key="5"/>
				<el-table-column label="完成人" v-if="taskstate == '2'" prop="modifier" key="6"/>
				<el-table-column label="是否合格" v-if="taskstate == '2'" prop="is_standard" key="7">
					<template slot-scope="scope">
						<span v-if="scope.row.is_standard == 1">合格</span>
						<span v-if="scope.row.is_standard == 2">不合格</span>
					</template>
				</el-table-column>
				<el-table-column label="得分" v-if="taskstate == '2'" prop="score" key="8"/>
				<el-table-column label="任务图片" v-if="taskstate != '2'" key="9" style="position: relative;" width="100px">
					<template slot-scope="scope">
							<!-- <el-image
							@click="getSrcList(scope.row.cleaning_picture)"
							v-for="(item,index) in scope.row.cleaning_picture"
							:key="index"
							style="width: 50px; height: 50px"
							:src="item"
							:preview-src-list="srcList"
							placeholder="无上传"
							fit="fit"></el-image> -->
							<el-image
							v-if="scope.row.cleaning_picture"
							@click="getSrcList(scope.row.cleaning_picture)"
							:preview-src-list="srcList"
							style="width: 50px; height: 50px"
							:src="scope.row.cleaning_picture[0]"
							fit="fit"
							>
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
							</el-image>
							<span 
							v-if="scope.row.cleaning_picture" 
							style="position: absolute;bottom: 10px;left: 43px;color: #048790;"
							>
							+{{scope.row.cleaning_picture.length}}
							</span>
					</template>
				</el-table-column>
				<el-table-column label="任务内容" v-if="taskstate != '2'" prop="cleaning_message" key="10"/>
				<el-table-column label="负责人" prop="principal.user_name" key="11"/>
				<el-table-column label="操作" v-if="taskstate != '3'"  key="12">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="text"
							v-if="taskstate == '2'"
							@click="check(scope.row.id)"
						>查看</el-button>
						<el-button
							size="mini"
							type="text"
							v-if="taskstate == '1'"
							@click="del(scope.row.id)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				:total="total"
				:page.sync="queryitem.pageNum"
				:limit.sync="queryitem.pageSize"
				@pagination="getList"
				:pageSizes="[10]"
			/>
			<Yg-Drawer
				v-model="showDrawer"
				title="新建"
				@confirm="confirmForm"
				@closed="drawerClosed"
				@cancel="drawerClosed"
			>
				<el-form ref="form" :model="form" :rules="rules" label-width="80px">
					<el-form-item label="卫生区域" prop="name">
						<el-select v-model="form.name" filterable placeholder="请选择">
							<el-option
								v-for="item in queryitem.arealist"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="打扫时间" prop="date">
						<el-date-picker
						      v-model="form.date"
						      type="datetimerange"
									value-format="yyyy-MM-dd HH:mm:ss"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
					</el-form-item>
					<el-form-item label="员工" class="form-item_layout" prop="staff">
						<div class="user-list" v-if="DstaffUser.length > 0" style="display: inline-block;">
							<el-tag @close="removeUser(user)" closable type="primary" v-for="user in DstaffUser" :key="user.user_id" style="margin-right: 10px;">{{user.user_name}}</el-tag>
						</div>
						<el-button type="primary" size="mini" @click="DselectstaffUsers">选择员工</el-button>
					</el-form-item>
	<!-- 				<el-form-item label="负责人" class="form-item_layout" prop="principal">
						<el-tag type="primary" v-if="Object.keys(DprincipalUser).length > 0" style="margin-right: 15px;">{{DprincipalUser.user_name}}</el-tag>
						<el-button type="primary" size="mini" @click="DselectUsers">{{Object.keys(DprincipalUser).length > 0 ? '更换负责人' : '选择负责人'}}</el-button>
					</el-form-item> -->
					<el-form-item label="任务内容">
						<el-input v-model="form.cleaning_message" placeholder="请输入内容"></el-input>
					</el-form-item>
					<el-form-item label="任务图片">
						<UploadImg v-model="form.imgList" :limit="3"></UploadImg>
					</el-form-item>
				</el-form>
			</Yg-Drawer>
			<SelectUsersDialog
					:visible.sync="DshowstaffDialog"
					:data="DstaffUser"
					model="user"
					:multiple="true"
					placeholder="请选择人员"
					@confirm="DgetDatasstaff"
			></SelectUsersDialog>
    </div>
</template>

<script>
import {getAreaList,getList,addClean,delClean} from '../../../../request/api/market/cleaning/cleaningTask.js'
export default {
    name: "clean-task",
    data() {
        return {
					srcList:[],
					form:{
						staff:[],
						principal:{},
						imgList:[]
					},
					rules:{
						name: [
						    {
						        required: true,
						        message: "请输入区域",
						        trigger: "blur",
						    },
						],
						date: [
						    {
						        required: true,
						        message: "请输入打扫时间",
						        trigger: "blur",
						    },
						],
						staff: [
						    {
						        required: true,
						        message: "请选择员工",
						        trigger: "change",
						    },
						],
					},
					showDrawer:false,
					tableData:[],
					taskstate:1,//状态按钮
					loading:false,
					is_standard:[{
						value: '',
						label: '全部'
					}, {
						value: '1',
						label: '合格'
					}, {
						value: '2',
						label: '不合格'
					},],
					showDialog: false,
					// DshowDialog: false,
					showstaffDialog: false,
					DshowstaffDialog: false,
					staffUser:[],//员工
					DstaffUser:[],
					queryitem:{
						staff:'',
						principal:'',
						arealist:[],//区域名称下拉
						areaname:'',//区域名称
						cleaning_time:'',//时间
						is_standard:'',//是否合格
						pageNum: 1,//分页#页码
						pageSize: 10,//分页#当页显示条数
					},
					total:0,
					btnLoading:false
        };
    },
    methods: {
			check(id){
				this.$router.push({path:'/taskcheck',query:{id:id}})
			},
			getSrcList(url){//大图预览
				this.srcList = url
			},
			del(id){
				const self = this;
				self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
				    confirmButtonText: "确定",
				    cancelButtonText: "取消",
				    type: "warning",
				}).then(() => {
				    delClean(id).then((res) => {
				        self.$toast("删除成功！");
				        self.getList();
				    });
				});
			},
			confirmForm(){
				const self = this;
				// self.form.principal = self.DprincipalUser.user_id
				self.form.staff = self.DstaffUser.map(item =>{
					return item.user_id
				})
				this.$refs["form"].validate(val =>{
					if(val){
						let res = {}
						res.task_state = "1"
						res.area = self.form.name
						res.cleaning_time =  self.form.date.join(",")
						res.cleaning_message = self.form.cleaning_message
						res.cleaning_picture = self.form.imgList.join(',')
						res.staff = self.form.staff
						res.pretime = "1"
						// console.log(res)
						addClean(res).then(resp=>{
							self.showDrawer = false;
							self.$toast("新增成功！");
							self.getList();
						}).finally((error) => {
								self.btnLoading = false;
						});
					}
				})
			},
			drawerClosed(){
				this.showDrawer = false;
				(this.form = {}),
				this.DstaffUser = [];
				this.resetForm("form");
			},
			operation(id){
				 this.showDrawer = true;
			},
			getList(){//获取表格数据
				this.loading = true;
				this.queryitem.state = this.taskstate
				getList(this.queryitem).then(resp=>{
					this.tableData = resp.data.results
					this.total = resp.data.count;
					for(let i=0;i<this.tableData.length;i++){
						if(this.tableData[i].cleaning_picture){
							var res = this.tableData[i].cleaning_picture
							this.tableData[i].cleaning_picture = res.split(",")
						}
						// this.tableData[i].cleaning_picture = this.tableData[i].cleaning_picture
					}
					// console.log(this.tableData)
					
				}).finally((error) => {
						this.loading = false;
				});
			},
			changestate(label){//切换任务状态
				this.queryitem.areaname = ''
				this.queryitem.staff = ''
				this.queryitem.principal = ''
				this.queryitem.cleaning_time = ''
				this.queryitem.is_standard = ''
				// console.log(this.taskstate)
				this.getList()
			},
			query(){
				// console.log(this.principalUser)
				this.getList()
			},
			reset(){//重置查询条件
				this.queryitem.areaname = ''
				this.staffUser = []
				this.principalUser = {}
				this.queryitem.cleaning_time = ''
				this.queryitem.is_standard = ''
				this.getList()
			},
			getAreaList(){//获取区域名称
				getAreaList(this.queryitem.areaname).then(resp=>{
					// console.log(resp.data.results)
					// this.queryitem.arealist = resp.data.results
					for(let i=0;i<resp.data.results.length;i++){
						this.queryitem.arealist.push({
							label:resp.data.results[i].label,
							value:resp.data.results[i].label,
						})
					}
					console.log(this.queryitem.arealist)
				})
			},
			//选择人员
			
			// DselectUsers() {
			//     this.DshowDialog = true;
			// },
			
			DselectstaffUsers() {
			    this.DshowstaffDialog = true;
			},
			
			// DgetDatas(e) {
			// 	this.DshowDialog = false;
			// 		this.DprincipalUser = e;
			// },
			
			DgetDatasstaff(e) {
				this.DshowstaffDialog = false;
					this.DstaffUser = e;
			},
			removeUser(item){
				let itemIndex = this.staffUser.findIndex(o => o.user_id == item.user_id)
				this.staffUser.splice(itemIndex,1)
			},
			//选择人员 ---------end
			changeTimestyle(oldtime) {
			    // 时间转换
			    var datejson = new Date(oldtime).toJSON();        
			    var date = new Date( + new Date(datejson) 
			                         + 8*3600*1000).toISOString().
			                         replace(/T/g,' ').
			                         replace(/\.[\d]{3}Z/,'')  
			    return date;
			},
    },
    created() {
				this.getAreaList()
				this.getList()
    },
};
</script>

<style scoped lang="scss">
	.title_location{
		padding-top: 5px;
	}
	.form-item_layout{
		margin-right: 60px;
	}
</style>