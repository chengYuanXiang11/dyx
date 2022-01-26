<template>
    <div class="icon-body app-container">
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
            <el-button
                type="primary"
                icon="el-icon-circle-close"
                @click="clearIcon"
            ></el-button>
        </div>
        <div class="icon-list">
            <div
                v-for="(item, index) in iconList"
                :key="index"
                class="item"
            >
                <svg-icon :icon-class="item" />
                <span>{{ item }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import icons from "./requireIcons";
export default {
    name: "IconList",
    data() {
        return {
            name: "",
            iconList: icons,
        };
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
        clearIcon() {
            this.selectedIcon("");
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
    background-color: #fff;
    border-radius: 8px;
    padding-right: 20px;
    .icon-header {
        display: flex;
        padding-right: 100px;
        .el-input {
            width: 300px;
        }
        ::v-deep .el-button {
            margin-left: 15px;
            padding: 0 15px;
            i {
                font-size: 20px;
            }
        }
    }
    .icon-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        border: solid 1px #ddd;
        border-width: 1px 0 0 1px;
        border-radius: 8px;
        overflow: hidden;
        .item {
            cursor: pointer;
            width: 10%;
            height: 120px;
            position: relative;
            padding: 0px 10px;
            border: solid 1px #ddd;
            border-width: 0 1px 1px 0;
            box-sizing: border-box;
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
                font-size: 12px;
            }
            &:hover {
                background-color: #048790;
                color: #fff;
                .svg-icon {
                    fill: #fff;
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
::v-deep .select-icon .el-input__inner {
    padding-left: 40px;
}
</style>
