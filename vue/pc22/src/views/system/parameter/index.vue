<template>
    <Table-page
        :page-size="search.pageSize"
        :total="search.total"
        :page-num="search.pageNum"
        @pagination="handlePagination"
    >
        <el-table v-loading="loading" :data="tableData" border height="100%">
            <el-table-column label="参数名称" prop="configName" />
            <el-table-column label="参数值" align="center">
                <template slot-scope="scope">
                    <el-image
                        class="homepagelogo"
                        :src="scope.row.configValue"
                        :preview-src-list="[scope.row.configValue]"
                        v-if="scope.row.configKey == 'homepagelogo'"
                    >
                    </el-image>
                    <span
                        v-else-if="
                            scope.row.configKey == 'pwdmemorytime' ||
                            scope.row.configKey == 'appmemorycache'
                        "
                        >{{
                            scope.row.configValue == "10000"
                                ? "长期"
                                : scope.row.configValue
                        }}</span
                    >
                    <span v-else-if="scope.row.configKey == 'singlesignon'">{{
                        scope.row.configValue == "1" ? "开启" : "关闭"
                    }}</span>
                    <span v-else>{{ scope.row.configValue }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型" prop="configType" />
            <el-table-column
                label="备注"
                prop="remark"
                :show-overflow-tooltip="true"
            />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        v-hasPermi="['permission:role:{id}:delete']"
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                        >编辑</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <Drawer
            :visible.sync="parameterDialog"
            title="编辑"
            @confirm="confirmForm"
            v-loading="confirmLoading"
            @closed="close"
        >
            <el-form
                ref="form"
                :model="form"
                label-width="120px"
                :rules="rules"
            >
                <el-form-item
                    label="上传图片"
                    prop="homepagelogo"
                    v-if="configKey == 'homepagelogo'"
                >
                    <Image-Upload
                        v-model="form.homepagelogo"
                        :max="1"
                        notip
                    ></Image-Upload>
                </el-form-item>
                <el-form-item
                    label="系统名称"
                    prop="homesystemname"
                    v-else-if="configKey == 'homesystemname'"
                >
                    <el-input
                        v-model="form.homesystemname"
                        placeholder="请输入系统名称"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="记住密码时长"
                    prop="pwdmemorytime"
                    v-else-if="configKey == 'pwdmemorytime'"
                >
                    <el-select
                        v-model="form.pwdmemorytime"
                        placeholder="请选择登录记住密码时长"
                    >
                        <el-option label="7天" value="7"> </el-option>
                        <el-option label="15天" value="15"> </el-option>
                        <el-option label="30天" value="30"> </el-option>
                        <el-option label="长期" value="10000"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="默认密码"
                    prop="resetpwd"
                    v-else-if="configKey == 'resetpwd'"
                >
                    <el-input
                        v-model="form.resetpwd"
                        placeholder="请输入默认密码"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="缓存有效期"
                    prop="appmemorycache"
                    v-else-if="configKey == 'appmemorycache'"
                >
                    <el-select
                        v-model="form.appmemorycache"
                        placeholder="app端登录缓存有效期"
                    >
                        <el-option label="7天" value="7"> </el-option>
                        <el-option label="15天" value="15"> </el-option>
                        <el-option label="30天" value="30"> </el-option>
                        <el-option label="长期" value="10000"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="单点登录"
                    prop="singlesignon"
                    v-else-if="configKey == 'singlesignon'"
                >
                    <el-switch
                        v-model="form.singlesignon"
                        active-value="1"
                        inactive-value="0"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入备注"
                    ></el-input>
                </el-form-item>
            </el-form>
        </Drawer>
    </Table-page>
</template>

<script>
import { getList, updateParameter } from "@/request/api/system/parameter";

export default {
    name: "Parameter",
    data() {
        return {
            search: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            loading: true,
            // 角色表格数据
            tableData: [],
            queryParams: {},
            parameterDialog: false,
            confirmLoading: false,
            form: {},
            rules: {
                homepagelogo: [
                    {
                        required: true,
                        message: "请上传图片",
                        trigger: "change",
                    },
                ],
                homesystemname: [
                    {
                        required: true,
                        message: "首页系统名称不能为空",
                        trigger: "blur",
                    },
                ],
                pwdmemorytime: [
                    {
                        required: true,
                        message: "请选择登录记住密码时长",
                        trigger: "change",
                    },
                ],
                resetpwd: [
                    {
                        required: true,
                        message: "请输入重置的默认密码",
                        trigger: "blur",
                    },
                    {
                        min: 8,
                        max: 16,
                        message: "密码为8-16个字符",
                        trigger: "blur",
                    },
                ],
                appmemorycache: [
                    {
                        required: true,
                        message: "请选择app端登录缓存有效期",
                        trigger: "change",
                    },
                ],
                singlesignon: [
                    {
                        required: true,
                        message: "请选择是否开启单点登录",
                        trigger: "change",
                    },
                ],
            },
            configKey: "",
        };
    },
    created() {
        this.getList();
        this.setDefaultValue();
    },
    methods: {
        // 分页方法
        handlePagination(e) {
            this.search.pageNum = e.pageNum;
            this.getList();
        },
        getList() {
            this.loading = true;
            getList(this.queryFormat(this.queryParams, this.search))
                .then((response) => {
                    this.tableData = response.data.results;
                    this.search.total = response.data.count;
                })
                .finally((error) => {
                    this.loading = false;
                });
        },
        handleUpdate(row) {
            this.configKey = row.configKey;
            if (row.configKey == "homepagelogo") {
                this.form.homepagelogo = [row.configValue];
            } else {
                this.form[row.configKey] = row.configValue;
            }
            this.form.remark = row.remark;
            this.form.id = row.id;
            this.parameterDialog = true;
        },
        setDefaultValue() {
            this.form = {
                id: undefined,
                homepagelogo: [],
                homesystemname: "",
                resetpwd: "",
                pwdmemorytime: "",
                appmemorycache: "",
                singlesignon: "",
                remark: "",
            };
        },
        close() {
            this.setDefaultValue();
            this.$refs["form"].resetFields();
        },
        confirmForm() {
            const self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    self.confirmLoading = true;
                    let data = {};
                    if (self.configKey == "homepagelogo") {
                        data.configValue = self.form.homepagelogo[0];
                    } else {
                        data.configValue = self.form[self.configKey];
                    }
                    data.remark = self.form.remark;
                    updateParameter(self.form.id, data)
                        .then((res) => {
                            this.close();
                            this.getList();
                            this.$success("修改成功！");
                        })
                        .finally((error) => {
                            self.confirmLoading = false;
                        });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.homepagelogo {
    width: 50px;
    height: 50px;
    border-radius: 4px;
}
</style>