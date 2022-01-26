<template>
	<div class="app-container">
		<h3>任务信息</h3>
		<el-row class="title_layout">
			<el-col :span="3">日期</el-col>
			<el-col :span="20">{{msg.create_datetime}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">区域</el-col>
			<el-col :span="20">{{msg.area}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">打扫时间</el-col>
			<el-col :span="20">{{msg.cleaning_time}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">员工</el-col>
			<el-col :span="20">
				<span v-for="(item,index) in msg.staff" :key="index">{{item.user_name}},</span>
			</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">任务图片</el-col>
			<el-col :span="20">
				<el-image
				@click="getSrcList(msg.cleaning_picture)"
				v-for="(item,index) in msg.cleaning_picture"
				:key="index"
				style="width: 100px; height: 100px;margin-right: 15px;"
				:src="item"
				:preview-src-list="srcList"
				placeholder="无上传"
				fit="fit"></el-image>
			</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">任务内容</el-col>
			<el-col :span="20">{{msg.cleaning_message}}</el-col>
		</el-row>
		<h3 style="margin-top: 40px;">完成信息</h3>
		<el-row class="title_layout">
			<el-col :span="3">完成人</el-col>
			<el-col :span="20">{{msg.modifier}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">完成时间</el-col>
			<el-col :span="20">{{msg.complete_time}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">完成图片</el-col>
			<el-col :span="20">
				<el-image
				@click="getSrcList(msg.cleaning_finish_picture)"
				v-for="(item,index) in msg.cleaning_finish_picture"
				:key="index"
				style="width: 100px; height: 100px;margin-right: 15px;"
				:src="item"
				:preview-src-list="srcList"
				placeholder="无上传"
				fit="fit"></el-image>
			</el-col>  	
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">完成备注</el-col>
			<el-col :span="20">{{msg.area}}</el-col>
		</el-row>
		<h3 style="margin-top: 40px;">检查信息</h3>
		<el-row class="title_layout">
			<el-col :span="3">是否合格</el-col>
			<el-col :span="20">{{msg.is_standard}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">得分</el-col>
			<el-col :span="20">{{msg.score}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">检查图片</el-col>
			<el-col :span="20">
				<el-image
				@click="getSrcList(msg.cleaning_check_picture)"
				v-for="(item,index) in msg.cleaning_check_picture"
				:key="index"
				style="width: 100px; height: 100px;margin-right: 15px;"
				:src="item"
				:preview-src-list="srcList"
				placeholder="无上传"
				fit="fit"></el-image>
			</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">说明</el-col>
			<el-col :span="20">{{msg.principal}}</el-col>
		</el-row>
		<el-row class="title_layout">
			<el-col :span="3">负责人</el-col>
			<el-col :span="20">{{msg.principal.user_name}}</el-col>
		</el-row>
	</div>
</template>

<script>
import {getInfo} from '../../../../request/api/market/cleaning/cleaningTask.js'
export default{
	name:'task-check',
	data() {
		return{
			srcList:[],
			id:this.$route.query.id,
			msg:{
				principal:""
			}
		}
	},
	methods:{
		getInfo(){
			getInfo(this.id).then(resp=>{
				// console.log(resp.data.results)
				this.msg = resp.data.results[0]
				let res = this.msg.cleaning_picture
				this.msg.cleaning_picture = res.split(",")
				// cleaning_check_picture  cleaning_finish_picture
				let res2 = this.msg.cleaning_finish_picture
				this.msg.cleaning_finish_picture = res.split(",")
				let res3 = this.msg.cleaning_check_picture
				this.msg.cleaning_check_picture = res.split(",")
			})
		},
		getSrcList(url){//大图预览
			this.srcList = url
		},
	},
	created() {
		this.getInfo()
	}
}
</script>

<style scoped>
	.title_layout{
		margin-top: 20px;
	}
</style>
