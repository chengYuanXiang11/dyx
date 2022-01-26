<template>
    <div class="app-container">
			<el-form>
				<el-form-item label="巡检时间">{{form.pooling_time}}</el-form-item>
				<el-form-item label="巡检人">{{ formatUser(form.pooling_checker) }}</el-form-item>
				<el-form-item label="巡检单">{{form.pooling_ticket}}</el-form-item>
				<el-form-item v-for="(item,index) in form.project_details" :key="index">
					<div class="project-list">
						<div class="item">
						    <span>巡检项：</span>
						    <p>{{ item.project_name }}</p>
						</div>
						<div class="item">
						    <span>是否合格：</span>
						    <p>{{ item.is_pass==1 ? '合格':'不合格'}}</p>
						</div>
						<template v-if="item.is_pass == 2">
							<div class="task-list"
								v-for="(taskitem,taskindex) in item.task_issue"
								:key="'task' + taskindex"
							>
								<div class="task-item">
									<div class="header">
										{{ "任务" + (taskindex + 1) }}
									</div>
									<div class="main">
										<el-form-item label="区域">{{taskitem.area}}</el-form-item>
										<el-form-item label="整改人">{{taskitem.modifier}}</el-form-item>
										<el-form-item label="图片">
											<el-image
											v-for="(itemimg,imgindex) in taskitem.picture" :key="'img' + imgindex"
											style="width: 80px; height:80px;margin-top: 10px;"
											:src="itemimg"
											fit="fit"></el-image>
										</el-form-item>
									</div>
									<template v-if="item.is_modify == 1">
										<div class="afterTitle">
											整改后
											<el-radio-group
													style="float: right;"
													v-model="taskitem.is_pass">
													<el-radio-button :label="1">通过</el-radio-button>
													<el-radio-button :label="2">不通过</el-radio-button>
											</el-radio-group>
										</div>
										<div class="main">
											<el-form-item label="完成人">{{taskitem.after_modify.finisher}}</el-form-item>
											<el-form-item label="时间">{{taskitem.after_modify.time}}</el-form-item>
											<el-form-item label="说明">{{taskitem.after_modify.remark}}</el-form-item>
											<el-form-item label="图片">{{taskitem.after_modify.after_picture}}</el-form-item>
										</div>
									</template>
								</div>
							</div>
							
						</template>
					</div>
				</el-form-item>
			</el-form>
    </div>
</template>

<script>
import {getInfo} from '../../../../../request/api/market/inspection/task.js'
export default {
    data() {
        return {
					id:this.$route.query.id,
          form:{}
        };
    },
    methods: {
				formatUser(arr) {
						if (!arr) {
								return false;
						}
						return arr.length <= 0 ? "" : arr.join(",");
				},
				getData(){
					getInfo(this.id).then(resp=>{
						this.form = resp.data
					})
				},
        saveForm() {
            alert("submit!");
        },
        cancelForm() {
            this.closePage();
        },
    },
		created() {
			this.getData()
		}
};
</script>

<style lang="scss" scoped>
.project-list {
    border-radius: 2px 2px 0px 0px;
    border: 1px solid #d9d9d9;
    width: 547px;
    padding: 8px 16px;
    .item {
        display: flex;
        color: rgba(1, 6, 33, 0.9);
        align-items: center;
        font-size: 14px;
        padding: 8px 0;
        span {
            margin-right: 10px;
        }
    }
    .task-list {
        border: solid 1px #d9d9d9;
        border-radius: 2px;
        margin: 8px 0 16px;
        .header {
            height: 46px;
            display: flex;
            align-items: center;
            color: rgba(1, 6, 33, 0.9);
            justify-content: space-between;
            padding-left: 16px;
            background-color: #f5f5f5;
            border-bottom: solid 1px #d9d9d9;
            span {
                color: #048790;
                padding: 0px 16px;
                cursor: pointer;
            }
        }
        .main {
            padding: 16px;
            .el-input,
            .el-cascader {
                width: 60%;
            }
        }
				.afterTitle {
				    font-size: 15px;
				    margin: 10px 10px;
				    font-weight: bold;
						
				}
    }
    .el-button {
        width: 100%;
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        font-size: 16px;
        color: #048790;
    }
}
</style>