<template>
    <!-- <div class="app-container">
			<el-button type="primary" @click="operation('add')" style="margin-bottom: 15px;">新建</el-button>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="货车进出费" name="carcost"></el-tab-pane>
				<el-tab-pane label="商品交易费" name="commoditycost" :disabled="true"></el-tab-pane>
			</el-tabs>
			<el-table class="yg-table" :data="tableData" v-loading="loading">
				<el-table-column label="名称" prop="name"></el-table-column>
				<el-table-column label="规则类型" prop="guizetype"></el-table-column>
				<el-table-column label="费用类型" prop="feiyongtype"></el-table-column>
				<el-table-column label="金额(元/KG)" prop="jine"></el-table-column>
				<el-table-column label="生效时间" prop="time"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="operation('edit',scope.row.id,scope.row.name)">编辑</el-button>
						<el-button type="text" v-if="scope.row.name != '其他'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<pagination
			    v-show="paging.total > 0"
			    :total="paging.total"
			    :page.sync="paging.pageNum"
			    :limit.sync="paging.pageSize"
			    @pagination="getList"
			/>
			
			<Yg-Drawer
				v-model="showQita"
				title="其他"
				@confirm="confirmFormQita"
				@closed="drawerClosedQita"
				@cancel="drawerClosedQita"
			>
				<el-form :model="formQita" :rules="rulesQita" ref="formQita" label-width="100px">
					<el-form-item label="收费类型:">{{'进门费'}}</el-form-item>
					<el-form-item label="规则类型:">{{'单品'}}</el-form-item>
					<el-form-item label="名称:">{{'其他'}}</el-form-item>	
					<el-form-item label="适用用户:">{{'全部'}}</el-form-item>
					<el-form-item label="商品类别:">{{'全部'}}</el-form-item>
					<el-form-item label="收费金额:">
						<el-input
							placeholder=""
							v-model="formQita.jine">
							<i slot="suffix">元/KG</i>
						</el-input>
					</el-form-item>
				</el-form>
			</Yg-Drawer>
			<Yg-Drawer
				v-model="showDrawer"
				:title="(drawerType == 'add' ? '新建' : '编辑')"
				@confirm="confirmForm"
				@closed="drawerClosed"
				@cancel="drawerClosed"
				:confirmLoading="btnLoading"
			>
				<el-form :model="form" :rules="rules" ref="form" label-width="100px">
					<el-form-item label="费用类型:" prop="costtype">
						<el-radio v-model="form.costtype" label="1">进门收费</el-radio>
						<el-radio v-model="form.costtype" label="2">出门收费</el-radio>
					</el-form-item>
					<el-form-item label="规则类型:" prop="ruletype">
						<el-radio v-model="form.ruletype" label="1">单品</el-radio>
						<el-radio v-model="form.ruletype" label="2">混合</el-radio>
					</el-form-item>
					<el-form-item label="名称:" prop="name">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="商品类别:" prop="sptype">
						<GoodsSelect v-model="form.goods"></GoodsSelect>
					</el-form-item>
					<el-form-item label="收费金额:" prop="jine">
						<el-input
							placeholder=""
							v-model="form.jine">
							<i slot="suffix">元/KG</i>
						</el-input>
					</el-form-item>
					<el-form-item label="适用用户:" prop="userscope">
						<el-input v-model="form.userscope"></el-input>
					</el-form-item>
					<el-form-item label="生效时间:" prop="stattime">
						<el-date-picker
							v-model="form.stattime"
							type="datetime"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
				</el-form>
			</Yg-Drawer>
    </div> -->
</template>

<script>
export default {
    name: "transactionFee",
    data() {
        return {
					formQita:{},
					rulesQita:{},
					form:{
						costtype:'1',
						ruletype:'1',
						goods:[]
					},
					rules:{
						costtype:[{required: true, message: '请选择费用类型', trigger: 'blur'}],
						ruletype:[{required: true, message: '请选择规则类型', trigger: 'blur'}],
						name:[{required: true, message: '请输入名称', trigger: 'blur'}],
						sptype:[{required: true, message: '请选择商品类别', trigger: 'blur'}],
						jine:[{required: true, message: '请输入收费金额', trigger: 'blur'}],
						userscope:[{required: true, message: '请选择适用用户', trigger: 'blur'}],
						stattime:[{required: true, message: '请选择生效时间', trigger: 'blur'}]
					},
					activeName:'carcost',
					btnLoading:false,
					itemId:'',
					drawerType:'',
					showDrawer:false,
					showQita:false,
					paging:{
						pageNum:1,
						pageSize:20,
						total:0
					},
					loading:false,
          tableData:[]
        };
    },
    methods: {
			confirmFormQita(){},
			drawerClosedQita(){},
			handleClick(){//tabs标签页切换
			
			},
			getInfo(){},
			confirmForm(){},
			drawerClosed(){},
			getList(){
				let res = [{
					id:1,
					name:"其他",
					guizetype:"测试规则类型",
					feiyongtype:"测试费用类型",
					jine:"1000000",
					time:"2021-11-26"
				},{
					id:2,
					name:"测试名称2",
					guizetype:"测试规则类型",
					feiyongtype:"测试费用类型",
					jine:"1000000",
					time:"2021-11-26"
				},{
					id:3,
					name:"测试名称3",
					guizetype:"测试规则类型",
					feiyongtype:"测试费用类型",
					jine:"1000000",
					time:"2021-11-26"
				}];
				this.tableData = res
			},
			operation(type,id,name){
				this.drawerType = type
				this.itemId = id
				if(name != '其他'){
					this.showDrawer = true
					type == 'edit' && this.getInfo()
				}else{
					this.showQita = true
					
				}
			}
    },
    created() {
        // console.log(this.$route)
				this.getList()
    },
};
</script>

<style scoped lang="scss">
</style>

