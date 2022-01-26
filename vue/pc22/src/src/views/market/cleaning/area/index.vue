<template>
	<div class="app-container">
    <div class="app-container">
			<el-button type="primary" @click="operation('add')">新建</el-button>
    </div>
		<el-table class="yg-table" :data="tableData" v-loading="loading">
			<el-table-column label="区域名称" prop="name"/>
			<el-table-column label="负责人" prop="principal.user_name"/>
			<el-table-column label="员工">
				<template slot-scope="scope">
					<span v-for="(item,index) in scope.row.staff" :key="index">{{item.user_name}},</span>
				</template>
			</el-table-column>
			<el-table-column label="每日固定打扫次数">
				<template slot-scope="scope">
					<span v-for="(item,index) in scope.row.time" :key="index">第{{item.id}}次:{{item.time}}</br></span>
				</template>
			</el-table-column>
			<el-table-column label="备注" prop="description"/>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
						size="mini"
						type="text"
						@click="operation('edit',scope.row.id)"
						>编辑</el-button>
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
			:pageSizes="[1]"
		/>
		<Yg-Drawer
		v-model="showDrawer"
		:title="(drawerType == 'add' ? '新建' : '编辑')"
		@confirm="confirmForm"
		@closed="drawerClosed"
		@cancel="drawerClosed">
			<el-form ref="form" :model="form" :rules="rules" label-width="130px">
				<el-form-item label="区域名称" prop="name">
					<el-input
							style="width: 80%;"
							v-model="form.name"
							placeholder="请输入区域名称"
					></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="description">
					<el-input
					  type="textarea"
					  :rows="3"
						resize="none"
					  placeholder="请输入内容"
					  v-model="form.description">
					</el-input>
				</el-form-item>
				<el-form-item label="负责人">
					<el-tag type="primary" v-if="Object.keys(principalUser).length > 0" style="margin-right: 15px;">{{principalUser.user_name}}</el-tag>
					<el-button type="primary" size="mini" @click="selectUsers">{{Object.keys(principalUser).length > 0 ? '更换负责人' : '选择负责人'}}</el-button>
				</el-form-item>
				<el-form-item label="员工" prop="staff">
					<div class="user-list" v-if="staffUser.length > 0">
						<el-tag @close="removeUser(user)" closable type="primary" v-for="user in staffUser" :key="user.user_id">{{user.user_name}}</el-tag>
					</div>
					<el-button type="primary" size="mini" @click="selectstaffUsers">选择员工</el-button>
				</el-form-item>
				<el-form-item label="每日固定打扫次数">
					<el-input-number v-model="form.numbers" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
				</el-form-item>
				<el-form-item :label="`第${NoToChinese(index + 1)}次`" v-for="(o,index) in form.times" :key="index" :prop="'times.' + index + '.time'"
				:rules="{
					required: true, message: '请选择打扫时间', trigger: 'blur'
				}">
					<el-input v-model="o.time" @input="$forceUpdate()"></el-input>
				</el-form-item>
			</el-form>
		</Yg-Drawer>
		<SelectUsersDialog
				:visible.sync="showDialog"
				:data="principalUser"
				model="user"
				:multiple="false"
				placeholder="请选择负责人"
				@confirm="getDatas"
		></SelectUsersDialog>
		<SelectUsersDialog
				:visible.sync="showstaffDialog"
				:data="staffUser"
				model="user"
				:multiple="true"
				placeholder="请选择人员"
				@confirm="getDatasstaff"
		></SelectUsersDialog>
	</div>
</template>

<script>
import {
    getList,
    addCleanArea,
    delCleanArea,
    updateCleanArea,
    getInfo,
} from "../../../../request/api/market/cleaning/cleaningArea.js";
export default {
    name: "clean-area",
    data() {
        return {
            showDialog: false,
            showstaffDialog: false,
            form: {
                numbers: 1,
                staff: [],
                times: [{
                    time:''
                }],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入区域",
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
            showDrawer: false,
            drawerType: "",
            tableData: [],
            loading: false,
            total: 0,
            paging: {
                pageNum: 1,
                pageSize: 1,
            },
            principalUser: {},
            staffUser: [],
        };
    },
    methods: {
        del(id) {
            const self = this;
            self.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delCleanArea(id).then((res) => {
                    self.$toast("删除成功！");
                    self.getList();
                });
            });
        },
        removeUser(item) {
            let itemIndex = this.staffUser.findIndex(
                (o) => o.user_id == item.user_id
            );
            this.staffUser.splice(itemIndex, 1);
        },
        getDatas(e) {
            this.showDialog = false;
            this.principalUser = e;
        },
        getDatasstaff(e) {
            this.showstaffDialog = false;
            this.staffUser = e;
        },
        selectUsers() {
            this.showDialog = true;
        },
        selectstaffUsers() {
            this.showstaffDialog = true;
        },
        getInfo() {
            const self = this;
            let loading = this.$load();
            getInfo(this.itemId)
                .then((resp) => {
                    let res = self.filterObj(resp.data, [
                        "name",
                        "principal",
                        "staff",
                        "description",
                        "numbers",
                    ]);
                    self.form = Object.assign({},self.form,res);
                    self.form.times = [];
                    resp.data.time.map((item) => {
                        self.form.times.push({time:item.time})
                    });
                    self.principalUser = res.principal;
                    self.staffUser = res.staff;
                })
                .finally((error) => {
                    self.$nextTick(() => {
                        loading.close();
                    });
                });
        },
        getList() {
            this.loading = true;
            getList(this.paging)
                .then((resp) => {
                    this.tableData = resp.data.results;
                    this.total = resp.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        operation(type, id) {
            this.showDrawer = true;
            this.drawerType = type;
            this.itemId = id;
            type == "edit" && this.getInfo();
        },
        confirmForm() {
            const self = this;
            self.form.principal = self.principalUser.user_id;
            let res = self.staffUser.map((item) => {
                return item.user_id;
            });
            self.form.staff = res;
            self.form.time = self.form.times;
            this.$refs["form"].validate((valid)	 => {
                if (valid) {
                    self.btnLoading = true;
                    if (self.drawerType == "add") {
                        addCleanArea(self.form)
                            .then((resp) => {
                                self.showDrawer = false;
                                self.$toast("新增成功！");
                                self.getList();
                            })
                            .finally((error) => {
                                self.btnLoading = false;
                            });
                    } else {
                        updateCleanArea(self.form, self.itemId)
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
            this.showDrawer = false;
            (this.form = {
                numbers: 1,
                staff: [],
                times: [{
                    time:''
                }],
            }),
            this.principalUser = {};
            this.staffUser = [];
            this.resetForm("form");
        },
        handleChange(e) {
            let timesNum = this.form.times.length;
            let timesObj = {
                time: "",
            };
            if (e > timesNum) {
                let arr = [];
                for (var i = 0; i < e - timesNum; i++) {
                    arr.push(timesObj);
                }
                this.form.times = this.form.times.concat(arr);
            } else {
                this.form.times.splice(e, timesNum - e);
            }
            console.log(this.form.times);
        },
        NoToChinese(num) {
            if (!/^\d*(\.\d*)?$/.test(num)) {
                alert("Number is wrong!");
                return "Number is wrong!";
            }
            var AA = new Array(
                "零",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六",
                "七",
                "八",
                "九"
            );
            var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
            var a = ("" + num).replace(/(^0*)/g, "").split("."),
                k = 0,
                re = "";
            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0:
                        re = BB[7] + re;
                        break;
                    case 4:
                        if (
                            !new RegExp(
                                "0{4}\\d{" + (a[0].length - i - 1) + "}$"
                            ).test(a[0])
                        )
                            re = BB[4] + re;
                        break;
                    case 8:
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }
                if (
                    k % 4 == 2 &&
                    a[0].charAt(i + 2) != 0 &&
                    a[0].charAt(i + 1) == 0
                )
                    re = AA[0] + re;
                if (a[0].charAt(i) != 0)
                    re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                k++;
            }
            if (a.length > 1) {
                //加上小数部分(如果有小数部分)
                re += BB[6];
                for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
            }
            return re;
        },
    },
    created() {
        this.getList();
    },
};
</script>

<style scoped lang="scss">
.user-list {
    .el-tag {
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>