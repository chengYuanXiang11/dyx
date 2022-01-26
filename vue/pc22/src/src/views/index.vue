<template>
    <div class="dashboard-editor-container app-container">
        <!-- 组件示例 -->
        <el-row>
            <el-col>
                <h1>上传图片</h1>
                <UploadImg v-model="imgList" :limit="3"></UploadImg>
                <!--    
                        参数：  v-model
                        类型：  Array
                        说明：  图片列表，默认为[]
                        示例
                        imgList: [
                            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
                        ]
                        *************************
                        参数：  limit
                        类型：  Number
                        说明：  上传图片限制，默认为1
                -->
            </el-col>
            <el-col>
                <h1>选人组件</h1>
                <SelectUsersDialog
                    :visible.sync="showDialog"
                    :data="datas"
                    model="user"
                    :multiple="true"
                    placeholder="请选择人员"
                    @confirm="getDatas"
                ></SelectUsersDialog>
                <el-button @click="selectUsers">选择人员</el-button>
                <!--    
                        参数：  visible.sync
                        类型：  Boolean
                        说明：  是否显示选人弹窗
                        *************************
                        参数：  data
                        类型：  object
                        示例
                        datas:{
                            depts:[], // 部门列表
                            users:[], // 用户列表
                        }
                        *************************
                        参数：  hasDept
                        类型：  Boolean
                        说明：  部门是否可选，默认false
                        *************************
                        参数：  placeholder
                        类型：  String
                        说明：  为空时的说明文字
                -->
            </el-col>
            <el-col>
                <h1>省市区组件</h1>
                <Province
                    v-model="address"
                    @getLabels="getLabels"
                    ref="address"
                ></Province>
                <!--    
                        参数：  v-model
                        类型：  Array
                        示例
                        address: [110000, 110100, 110101]
                        *************************
                        方法：  @getLabels
                        说明：  获取省市区名称集合
                -->
            </el-col>
            <el-col>
                <h1>岗位组件</h1>
                <PostSelect v-model="post"></PostSelect>
                <!--    
                        参数：  v-model
                        类型：  String
                        *************************
                -->
            </el-col>
            <el-col>
                <h1>右侧抽屉组件</h1>
                <Yg-Drawer
                    v-model="open"
                    title="标题"
                    @confirm="submitForm"
                    @closed="closed"
                    @cancel="cancel"
                >
                </Yg-Drawer>
                <el-button @click="open = true">选择人员</el-button>
                <!--    
                        参数：  v-model
                        类型：  Boolean
                        说明：  是否显示抽屉
                        *************************
                        参数：  title
                        类型：  String
                        说明：  标题名称
                        *************************
                        参数：  wrapperClosable
                        类型：  Boolean
                        说明：  点击遮罩层是否可以关闭
                        *************************
                        参数：  withHeader
                        类型：  Boolean
                        说明：  控制是否显示 header 栏
                        *************************
                        参数：  cancelBtnText
                        类型：  String
                        说明：  取消按钮文字
                        *************************
                        参数：  confirmBtnText
                        类型：  String
                        说明：  确认按钮文字
                        *************************
                        参数：  showFooter
                        类型：  Boolean
                        说明：  是否显示底部
                        *************************
                        参数：  confirmLoading
                        类型：  Boolean
                        说明：  确认按钮加载状态
                        *************************
                        参数：  @confirm
                        类型：  function
                        说明：  确认按钮事件
                        *************************
                        参数：  @cancel
                        类型：  function
                        说明：  取消按钮事件
                        *************************
                        参数：  @closed
                        类型：  function
                        说明：  抽屉关闭事件
                        *************************
                -->
            </el-col>
            <el-col>
                <h1>选择商品</h1>
                <GoodsSelect v-model="goods"></GoodsSelect>
                <!--    
                        参数：  v-model
                        类型：  Boolean
                        说明：  是否显示抽屉
                        *************************
                -->
            </el-col>
            <el-col>
                <h1>分页组件</h1>
                <pagination
                    v-show="pagings.total > 0"
                    :total="pagings.total"
                    :page.sync="pagings.pageNum"
                    :limit.sync="pagings.pageSize"
                    @pagination="getList"
                />
                <!--    
                        参数：  total
                        类型：  Number
                        说明：  总条数
                        *************************
                        参数：  page
                        类型：  Number
                        说明：  当前页
                        *************************
                        参数：  limit
                        类型：  Number
                        说明：  每页条数
                        *************************
                        方法：  @pagination
                        类型：  function
                        说明：  分页事件，用于请求数据
                        *************************
                -->
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "DashboardAdmin",
    data() {
        return {
            address: [],
            addressLabels: [],
            post: "",
            imgList: [
                "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            ],
            showDialog: false,
            open: false,
            pagings: {
                total: 100,
                pageNum: 1,
                pageSize: 20,
            },
            goods:[],
        };
    },
    created() {
        let arr = [
            {
                fullPath: "/index",
                path: "/index",
                name: "首页",
                meta: {
                    title: "首页",
                    icon: "Home",
                    noCache: true,
                    affix: true,
                },
                title: "首页",
            },
        ];
        // console.log(JSON.stringify(arr))
    },
    methods: {
        selectUsers() {
            this.showDialog = true;
        },
        getLabels(e) {
            this.addressLabels = e;
        },
        submitForm() {
            this.$toast("确认事件");
        },
        closed() {
            this.$toast("关闭事件");
        },
        cancel() {
            this.$toast("取消事件");
        },
        getList() {
            this.$toast("执行分页方法");
        },
        getDatas(e,close) {
            close()
        },
    },
};
</script>

<style lang="scss" scoped>
h1 {
    font-weight: normal;
    color: #1f2f3d;
    font-size: 28px;
    margin-bottom: 20px;
}
.el-col {
    margin-bottom: 20px;
}
::v-deep .pagination-container {
    justify-content: flex-start;
    margin-top: 0;
}
</style>
