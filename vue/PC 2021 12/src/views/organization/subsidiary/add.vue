<template>
    <div class="app-container">
        <el-row>
            <el-col
                :lg="{ span: 12, offset: 1 }"
                :md="{ span: 14, offset: 1 }"
                :sm="{ span: 16, offset: 1 }"
                :xs="{ span: 24 }"
            >
                <el-form
                    ref="form"
                    :model="form"
                    label-width="80px"
                    :rules="rules"
                >
                    <div class="form-label">基本信息</div>
                    <el-form-item label="头像">
                        <el-avatar
                            :size="50"
                            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                        ></el-avatar>
                    </el-form-item>
                    <el-form-item label="账号" prop="account">
                        <el-input
                            v-model="form.account"
                            placeholder="请输入账号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input
                            v-model="form.pwd"
                            placeholder="请输入密码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="公司状态">
                        <el-radio-group
                            v-model="form.status"
                            @change="changeStatus"
                        >
                            <el-radio-button label="1">开启</el-radio-button>
                            <el-radio-button label="2">关闭</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <div class="form-label">公司信息</div>
                    <el-form-item label="公司名称">
                        <el-input
                            v-model="form.companyName"
                            placeholder="请输入公司名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="公司法人">
                        <el-input
                            v-model="form.legalPerson"
                            placeholder="请输入公司法人"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码">
                        <el-input
                            v-model="form.uscc"
                            placeholder="请输入统一社会信用代码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="公司电话">
                        <div class="mobile">
                            <el-input
                                class="area-code"
                                v-model="form.pwd"
                                placeholder="区号"
                            ></el-input>
                            <span></span>
                            <el-input
                                class="number"
                                v-model="form.pwd"
                                placeholder="请输入公司电话"
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="公司地址">
                        <el-input
                            v-model="form.address"
                            placeholder="请输入公司地址"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="营业执照上传">
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="" />
                        </el-dialog>
                    </el-form-item>
                    <div class="form-label">联系方式</div>
                    <el-form-item label="负责人">
                        <el-input
                            v-model="form.user"
                            placeholder="请输入负责人"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input
                            v-model="form.tel"
                            placeholder="请输入手机号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input
                            v-model="form.email"
                            placeholder="请输入邮箱"
                        ></el-input>
                    </el-form-item>
                    <div class="form-label">权限设置</div>
                    <el-tree
                        :data="data"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        class="yg-tree-checkbox"
                        default-expand-all
                    ></el-tree>
                    <el-form-item>
                        <div class="form-footer">
                            <el-button type="primary" @click="onSubmit"
                                >确定</el-button
                            >
                            <el-button>取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "Subsidiaryadd",
    data() {
        return {
            form: {
                status: "1",
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur",
                    },
                ],
                pwd: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                ],
            },
            data: [
                {
                    id: 1,
                    label: "一级 1",
                    children: [
                        {
                            id: 4,
                            label: "二级 1-1",
                            children: [
                                {
                                    id: 9,
                                    label: "三级 1-1-1",
                                },
                                {
                                    id: 10,
                                    label: "三级 1-1-2",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    label: "一级 2",
                    children: [
                        {
                            id: 5,
                            label: "二级 2-1",
                        },
                        {
                            id: 6,
                            label: "二级 2-2",
                        },
                    ],
                },
                {
                    id: 3,
                    label: "一级 3",
                    children: [
                        {
                            id: 7,
                            label: "二级 3-1",
                        },
                        {
                            id: 8,
                            label: "二级 3-2",
                        },
                    ],
                },
            ],
            defaultProps: {
                children: "children",
                label: "label",
            },
            dialogImageUrl:'',
            dialogVisible:false
        };
    },
    methods: {
        changeStatus(e) {
            if (e == "2") {
                this.$confirm("关闭后，公司及以下子公司账号都将被禁用！", "您确定关闭此公司吗？", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                    })
                    .catch(() => {
                        this.form.status = '1';
                    });
            }
        },
        onSubmit(){
            this.$refs["form"].validate(valid => {
                if(valid){

                }
                else{
                    this.$successError("请将表单填写完整")
                }
            })
        },
        handlePictureCardPreview(){

        },
        handleRemove(){

        }
    },
    created() {
    },
};
</script>

<style scoped lang="scss">
.form-label {
    font-size: 20px;
    border-left: solid 4px #048790;
    padding-left: 15px;
    margin: 20px 0;
}
::v-deep .el-form-item {
    display: flex;
    align-items: center;
    .el-form-item__label {
        line-height: inherit;
    }
    .el-form-item__content {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 15px !important;
        .mobile {
            display: flex;
            width: 100%;
            .area-code {
                width: 120px;
            }
            span {
                display: block;
                width: 100px;
                position: relative;
                &::before {
                    content: "";
                    height: 1px;
                    border-top: solid 1px #ddd;
                    position: absolute;
                    left: 10px;
                    right: 10px;
                    top: 50%;
                }
            }
        }
        .form-footer {
            margin: 40px 0;
            padding-left: 92px;
        }
    }
}
</style>

