<template>
    <div class="app-container">
			<el-form :inline="true">
				<el-form-item label="区域名称" class="form-item_layout">
					<el-select v-model="queryForm.areaname" filterable placeholder="请选择">
						<el-option
							v-for="item in areaList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="员工" class="form-item_layout">
					<el-input v-model="queryForm.staff" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="负责人" class="form-item_layout">
					<el-input v-model="queryForm.principal" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="日期" class="form-item_layout" v-if="checkstate != '1'">
					<el-date-picker
						v-model="queryForm.cleaning_time"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="是否合格" class="form-item_layout" v-if="checkstate == '2'">
					<el-select v-model="queryForm.is_standard" placeholder="请选择">
						<el-option
							v-for="item in is_standard"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float: right;">
					<el-button type="primary" @click="getList">搜索</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
			<el-radio-group v-model="checkstate" @change="changestate">
				<el-radio-button :label="1">待检查</el-radio-button>
				<el-radio-button :label="2">已检查</el-radio-button>
				<el-radio-button :label="3">已失效</el-radio-button>
			</el-radio-group>
			<el-table class="yg-table" :data="tableData" v-loading="loading">
				<!-- <el-table-column label="日期" key="1" prop="" v-if="checkstate != '1'"></el-table-column> -->
				<el-table-column label="区域" key="2" prop="area"></el-table-column>
				<el-table-column label="员工" key="3">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.staff">{{item.user_name}},</span>
					</template>
				</el-table-column>
				<el-table-column label="打扫时间" key="4" prop="cleaning_time" width="160px"></el-table-column>
				<el-table-column label="完成时间" key="5" prop="complete_time" width="160px"></el-table-column>
				<el-table-column label="完成人" key="6" prop="finisher"></el-table-column>
				<el-table-column label="是否合格" key="7" v-if="checkstate == '2'">
					<template slot-scope="scope">
						<span v-if="scope.row.is_standard == 1">合格</span>
						<span v-if="scope.row.is_standard == 2">不合格</span>
					</template>
				</el-table-column>
				<el-table-column label="得分" key="8" prop="score" v-if="checkstate == '2'"></el-table-column>
				<el-table-column label="完成图片" key="10"  v-if="checkstate != '2'">
					<template slot-scope='scope'>
						<el-image
						v-for="(item,index) in scope.row.cleaning_finish_picture"
						:key="index"
						style="width: 50px; height: 50px;margin-right: 5px;"
						:src="item"
						placeholder="无上传"
						fit="fit"></el-image>
					</template>
				</el-table-column>
				<el-table-column label="完成备注" key="11" prop="finish_message" v-if="checkstate != '2'"></el-table-column>
				<el-table-column label="负责人" key="9" prop="principal.user_name"></el-table-column>
				<el-table-column label="操作" key="12">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="text"
							v-if="checkstate == '1'"
							@click="tocheck(scope.row.id)"
						>检查</el-button>
						<el-button
							size="mini"
							type="text"
							@click="todetail(scope.row.id)"
							v-if="checkstate != '1'"
						>查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				:total="total"
				:page.sync="queryForm.pageNum"
				:limit.sync="queryForm.pageSize"
				@pagination="getList"
				:pageSizes="[10]"
			/>
    </div>
</template>

<script>
import {getAreaList,getList} from '../../../../request/api/market/cleaning/cleaningCheck.js'
export default {
    name: "check",
    data() {
			return {
				tableData:[
					{cleaning_finish_picture:''}
				],
				loading:false,
				checkstate:'1',
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
				areaList:[],
				queryForm:{
					state:'1',
					staff:'',
					principal:'',
					areaname:'',//区域名称
					cleaning_time:'',//时间
					is_standard:'',//是否合格
					pageNum: 1,//分页#页码
					pageSize: 10,//分页#当页显示条数
				},
				total:0,
			};
    },
    methods: {
			reset(){//重置
				this.queryForm.areaname = ''
				this.queryForm.staff = ''
				this.queryForm.principal = ''
				this.queryForm.cleaning_time = ''
				this.queryForm.is_standard = ''
				this.queryForm.pageNum = 1
				// console.log(this.queryForm)
				this.queryForm.state = this.checkstate
				// console.log(this.taskstate)
				this.getList()
			},
			tocheck(id){
				this.$router.push({path:'/check',query:{id:id}})
			},
			todetail(id){
				this.$router.push({path:'/detail',query:{id:id}})
			},
			getList(){
				this.loading = true;
				console.log(this.queryForm)
				getList(this.queryForm).then(resp=>{
					this.tableData = resp.data.results
					this.total = resp.data.count;
					let res = this.tableData
					for(let i=0;i<res.length;i++){
						if(res[i].cleaning_finish_picture){
							res[i].cleaning_finish_picture = res[i].cleaning_finish_picture.split(",")
						}
					}
					this.tableData = res
					console.log(this.tableData)
				}).finally((error) => {
						this.loading = false;
				});
			},
			changestate(label){//切换任务状态
				this.queryForm.areaname = ''
				this.queryForm.staff = ''
				this.queryForm.principal = ''
				this.queryForm.cleaning_time = ''
				this.queryForm.is_standard = ''
				this.queryForm.state = this.checkstate
				this.queryForm.pageNum = 1
				// console.log(this.taskstate)
				this.getList()
			},
			getAreaList(){//获取区域名称
				getAreaList(this.queryForm.areaname).then(resp=>{
					// console.log(resp.data.results)
					// this.queryitem.arealist = resp.data.results
					for(let i=0;i<resp.data.results.length;i++){
						this.areaList.push({
							label:resp.data.results[i].label,
							value:resp.data.results[i].label,
						})
					}
					// console.log(this.queryForm.arealist)
				})
			},
    },
    created() {
        this.getAreaList()
				this.getList()
    },
};
</script>

<style scoped lang="scss">
	.form-item_layout{
		margin-right: 60px;
	}
</style>

