<template>
    <Page>
        <div class="item">
            <el-row>
                <el-col :span="12">
                    <h1>选择人员组件</h1>
                    <div class="tip">
                        <p>当<el-tag>type="all"</el-tag>时，<el-tag>v-model</el-tag>的值必须为对象，同时包含<el-tag>users,depts</el-tag>两个key</p>
                        <p>当<el-tag>type="user/dept"</el-tag>时，<el-tag>v-model</el-tag>的值必须为数组</p>
                        <p>当<el-tag>type="user/dept"</el-tag>且<el-tag>multiple='false'</el-tag>时，<el-tag>v-model</el-tag>的值必须为对象</p>
                    </div>
                    <select-users v-model="datas" type="all" :multiple="true"></select-users>
                    <el-table :data="selectUsers">
                        <el-table-column prop="props" label="参数" width="180">
                        </el-table-column>
                        <el-table-column prop="tip" label="说明" width="180">
                        </el-table-column>
                        <el-table-column prop="type" label="类型">
                        </el-table-column>
                        <el-table-column prop="option" label="可选值">
                        </el-table-column>
                        <el-table-column prop="default" label="默认值">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </Page>
</template>

<script>
export default {
    name: "components",
    data() {
        return {
            datas:{
                users:[],
                depts:[]
            },
            selectUsers: [
                {
                    props: "type",
                    tip: "选择类型",
                    type: "String",
                    option: "all | user | dept",
                    default: "all",
                },
                {
                    props: "multiple",
                    tip: "是否多选，当type为all时，multiple必须为true",
                    type: "Boolean",
                    option: "false",
                    default: "true",
                },
                {
                    props: "v-model",
                    tip: "选中的数据",
                    type: "Object | Array",
                    option: "-",
                    default: "-",
                },
                {
                    props: "oneself",
                    tip: "是否可以选中自己",
                    type: "Boolean",
                    option: "false",
                    default: "true",
                },
                {
                    props: "placeholder",
                    tip: "未选中时的信息",
                    type: "String",
                    option: "-",
                    default: "请选择成员",
                },
                {
                    props: "disabled",
                    tip: "禁用选择",
                    type: "Boolean",
                    option: "false",
                    default: "true",
                },
            ],
        };
    },
    computed: {},
    methods: {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
.item{
    margin-bottom: 20px;
    .tip{
        font-size: 14px;
        margin-bottom: 20px;
        line-height: 22px;
        color: #5e6d82;
        padding:10px 20px 0;
        background: #f5f5f5;
        overflow: hidden;
        border-left: solid 4px #E6A23C;
        p{
            margin-bottom: 10px;
            .el-tag{
                margin: 0px 5px;
            }
        }
    }
    h1 {
        font-size: 22px;
        font-weight: normal;
        color: #1f2f3d;
        margin-bottom: 20px;
    }
}
</style>
