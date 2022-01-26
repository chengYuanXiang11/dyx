<template>
    <!-- 同行人选取组件 -->
    <el-form-item class="examine-label" :style="{ marginLeft: '8px',marginBottom:'20px' }">
        <el-timeline>
            <el-timeline-item>
                <template slot="dot">
                    <SelectUsersDialog
                        :visible.sync="PeerShowDialog"
                        :data="datas"
                        :users="users"
                        :oneself="true"
                        model="user"
                        :multiple="true"
                        placeholder="请选择人员"
                        @confirm="peerGetDatas"
                    ></SelectUsersDialog>
                    <div
                        v-for="(item, index) in value"
                        :key="item.user_id"
                        class="Approver-warp"
                    >
                        <el-badge
                            value="一"
                            @click.native="deleteUser(index)"
                        >
                            <el-avatar class="Approver" size="large">
                                <template #default>
                                    <div>
                                        {{
                                            item.user_name.substring(
                                                item.user_name.length - 2
                                            )
                                        }}
                                    </div>
                                </template>
                            </el-avatar>
                        </el-badge>
                        <span class="Approver-font">
                            {{ item.user_name }}
                        </span>
                    </div>
                    <!-- 添加按钮在满足一定条件下才会展示 -->
                    <el-button
                        :circle="true"
                        icon="el-icon-plus"
                        @click="peerSelectUsers"
                    ></el-button>
                </template>
            </el-timeline-item>
        </el-timeline>
    </el-form-item>
</template>
<script>
export default {
    name: "Peer",
    data() {
        return {
            PeerShowDialog: false,
            datas: [],
            users: [],
            //同行人
            PeerShowDialog: false,
        };
    },
    props: {
        value: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        // 打开选人
        peerSelectUsers() {
            this.datas = this.value;
            this.PeerShowDialog = true;
        },
        deleteUser(index) {
            this.value.splice(index,1)
        },
        // 同行人选人
        peerGetDatas(e, close) {
            this.$emit("input", e);
            close();
        },
    },
};
</script>
<style lang="scss" scoped>
.Approver-warp {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #010621;
    margin-right: 10px;
    position: relative;
    ::v-deep .el-badge__content.is-fixed {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        top: 6px;
        left: 11px;
        background: #333333;
        text-align: center;
        vertical-align: middle;
        border: none;
        cursor: pointer;
    }
    .Approver {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #048790;
        color: #fff;
        border: 1px solid #e6e6e6;
        cursor: pointer;
    }
    .Approver-font {
        position: absolute;
        top: 50px;
        width: 50px;
        left: 0px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.55);
        line-height: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
