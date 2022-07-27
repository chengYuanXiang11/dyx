<template>
    <el-popover placement="bottom-start" trigger="click" :width="450" @show="reset">
        <el-input
            v-model="iconName"
            readonly
            placeholder="点击选择图标"
            slot="reference"
            clearable
            class="select-icon"
        >
            <template slot="prefix">
                <i class="el-icon-search" v-if="iconName == ''"></i>
                <svg-icon
                    v-else
                    :icon-class="iconName"
                />
            </template>
        </el-input>
        <div class="icon-body">
            <div class="icon-header">
                <el-input
                    v-model="name"
                    style="position: relative"
                    clearable
                    placeholder="请输入图标名称"
                    @clear="filterIcons"
                    @input.native="filterIcons"
                >
                    <i slot="suffix" class="el-icon-search el-input__icon" />
                </el-input>
                <el-button type="primary" icon="el-icon-circle-close" @click="clearIcon"></el-button>
            </div>
            <div class="icon-list">
                <div
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="selectedIcon(item)"
                    class="item"
                >
                    <div class="child-item">
                        <svg-icon :icon-class="item" />
                        <span>{{ item }}</span>
                    </div>
                </div>
            </div>
        </div>
    </el-popover>
</template>

<script>
import icons from "./requireIcons";
export default {
    name: "IconSelect",
    data() {
        return {
            name: "",
            iconList: icons,
            iconName:this.value
        };
    },
    props:{
        value:{
            type:String,
            default:""
        }
    },
    methods: {
        filterIcons() {
            this.iconList = icons;
            if (this.name) {
                this.iconList = this.iconList.filter((item) =>
                    item.includes(this.name)
                );
            }
        },
        selectedIcon(name) {
            this.iconName = name;
            document.body.click();
        },
        reset() {
            this.name = "";
            this.iconList = icons;
        },
        clearIcon(){
            this.selectedIcon('')
        }
    },
    watch: {
        value(newVal) {
            this.iconName = newVal;
        },
        iconName(newVal) {
            this.$emit("input", newVal);
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
    width: 100%;
    overflow: hidden;
    .icon-header{
        display: flex;
        .el-input{
            flex: 1;
        }
        ::v-deep .el-button{
            margin-left: 15px;
            padding:0 15px;
            i{
                font-size: 20px;
            }
        }
    }
    .icon-list {
        height: 200px;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        border: solid 1px #ddd;
        border-width: 1px 0px 0 1px;
        .item {
            cursor: pointer;
            width: 25%;
            padding-top: 25%;
            height: 0;
            position: relative;
            border: solid 1px #ddd;
            border-width: 0 1px 1px 0;
            box-sizing: border-box;
            &:hover {
                background-color: #048790;
                color: #fff;
                .svg-icon {
                    fill: #fff;
                }
            }
            .child-item {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                .svg-icon {
                    width: 32px;
                    height: 32px;
                }
                span {
                    margin-top: 10px;
                }
            }
        }
    }
}
::v-deep .el-input__prefix {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #999;
    left: 0;
    width: 40px;
    justify-content: center;
}
::v-deep .select-icon .el-input__inner{
    padding-left: 40px;
}
</style>
