<template>
	<div class="app-container">
		<div style="width: 50%;display: inline-block;float: left;">
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
					<span v-for="(item,index) in msg.staff">{{item}}</span>
				</el-col>
			</el-row>
			<el-row class="title_layout">
				<el-col :span="3">任务图片</el-col>
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
		</div>
		<!-- 检查表单 -->
		<div style="width: 45%;display: inline-block;float: right;border-left: 1px solid #606266;padding-left: 20px;">
			<h3>检查</h3>
			<el-form ref="form" :model="form" :rules="rules" label-width="140px">
				<el-form-item label="是否合格" class="form-item_layout" prop="is_standard">
					<el-radio v-model="form.is_standard" label="1" border>合格</el-radio>
					<el-radio v-model="form.is_standard" label="2" border>不合格</el-radio>
				</el-form-item>
				<el-form-item label="评分" class="form-item_layout" prop="score">
					<el-input-number v-model="form.score" :min="0" :max="10" label="分数" size="small"></el-input-number>
				</el-form-item>
				<el-form-item label="说明" class="form-item_layout">
					<el-input v-model="form.check_message"  size="small"></el-input>
				</el-form-item>
				<el-form-item label="图片" class="form-item_layout">
					<UploadImg v-model="form.imgList" :limit="3"></UploadImg>
				</el-form-item>
				<el-form-item label="是否需要重新打扫" class="form-item_layout">
					<el-switch
					  v-model="switchval"
						@change="getreclean"
					  active-color="#048790"
					  inactive-color="#606266">
					</el-switch>
				</el-form-item>
				<el-form-item label="打扫时间" class="form-item_layout" v-if="switchval">
					<el-date-picker
						v-model="form.date"
						type="datetimerange"
						value-format="yyyy-MM-dd HH:mm:ss"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item class="form-item_layout">
					<el-button type="primary" @click="updateState">确定</el-button>
					<el-button style="float: right;">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {getInfo,updateState} from '../../../../request/api/market/cleaning/cleaningCheck.js'
export default{
	name:'check',
	data() {
		return{
			switchval:false,
			form:{
				is_standard:'1',
				is_reclean:'2',
				score:0
			},
			rules:{
				is_standard: [
				    {
				        required: true,
				        message: "请选择是否合格",
				        trigger: "change",
				    },
				],
				score: [
				    {
				        required: true,
				        message: "请输入分数",
				        trigger: "change",
				    },
				],
			},
			srcList:[],
			id:this.$route.query.id,
			msg:{
				principal:""
			}
		}
	},
	methods:{
		getreclean(val){
			if(val){
				this.form.is_reclean = '1'
			}else{
				this.form.is_reclean = '2'
			}
		},
		getInfo(){
			// console.log(this.id)
			getInfo(this.id).then(resp=>{
				// console.log(resp.data)
				this.msg = resp.data
				let res = this.msg.staff
				res = res.replace("[","")
				res = res.replace("]","")
				res = res.replace("'","")
				res = res.replace("'","")
				res = res.replace("'","")
				res = res.replace("'","")
				this.msg.staff = res
				let res1 = this.msg.cleaning_check_picture
				this.msg.cleaning_check_picture = res1.split(",")
				let res2 = this.msg.cleaning_finish_picture
				this.msg.cleaning_finish_picture = res2.split(",")
				console.log(this.msg)
			})
		},
		getSrcList(url){//大图预览
			this.srcList = url
		},
		updateState(){
			console.log(this.form)
			this.form.check_state = "2"
			updateState(this.id,this.form).then(resp=>{
				this.$notify({
					title: '成功',
					message: '检查成功',
					type: 'success'
				});
			})
		}
	},
	created() {
		this.getInfo()
	}
}
</script>
<style scoped lang="scss">
	.title_layout{
		margin-top: 20px;
	}
	.form-item_layout{
		margin-right: 60px;
	}
</style>