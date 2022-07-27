<template>
    <div class="upload-main">
        <ul class="img-list">
            <li v-for="(o, index) in fileList" :key="index">
                <img :src="o" />
                <div class="showdow">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="预览"
                        placement="top"
                    >
                        <i class="el-icon-zoom-in" @click="preview(o)"></i>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除"
                        placement="top"
                    >
                        <i
                            class="el-icon-circle-close"
                            @click="handleRemove(index)"
                        ></i>
                    </el-tooltip>
                </div>
            </li>
						<li
									v-if="fileList.length < limit">
							<el-upload
									:action="action"
									list-type="picture-card"
									:limit="limit"
									:show-file-list="false"
									:before-upload="beforeUpload"
									:on-error="onError"
									:on-success="onSuccess"
									:headers="headers"
							>
									<i slot="default" class="el-icon-plus"></i> </el-upload
							>
						</li>
        </ul>
        <ElImageViewer
            v-if="showViewer"
            :initialIndex="initialIndex"
            :on-close="
                () => {
                    showViewer = false;
                }
            "
            :url-list="fileList"
        />
    </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
    data() {
        return {
            action: process.env.VUE_APP_BASE_API + "/system/savefile/",
            fileList: this.value,
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            showViewer: false,
            initialIndex:0
        };
    },
    components: {
        ElImageViewer,
    },
    props: {
        limit: {
            type: Number,
            default: 1,
        },
        value: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    watch: {
        value(newVal) {
            this.fileList = newVal;
        },
        fileList(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        handleRemove(index) {
            this.$confirm("是否删除该图片?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.fileList.splice(index, 1);
                })
                .catch(() => {});
        },
        preview(file) {
            this.initialIndex = this.fileList.findIndex(item => item == file)
            this.showViewer = true;
        },
        beforeUpload(file) {
            var index = file.name.lastIndexOf(".");
            //获取后缀
            var ext = file.name.substr(index + 1).toLowerCase();
            //输出结果
            var extarr = ["jpg", "png", "pdf", "bmp"];

            let flag = true;
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (extarr.indexOf(ext) == -1) {
                flag = false;
                this.$message.error("上传文件只能是BMP/JPG/PNG/PDF格式!");
            }
            if (!isLt2M) {
                this.$message({
                    message: "上传文件大小不能超过 10MB!",
                    type: "error",
                });
                flag = false;
            }
            return flag;
        },
        onError(err, file, fileList) {
            console.log(err);
        },
        onSuccess(response, file, fileList) {
            if (response.code != 200) {
                this.$notify.error({
                    title: response.msg,
                });
            } else {
                this.$toast("上传图片成功！");
                this.fileList.push(
                    process.env.VUE_APP_BASE_API + response.data.file_url
                );
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.upload-main {
    .img-list {
        display: flex;
        align-items: center;
				flex-wrap: wrap;
        li {
            width: 148px;
            height: 148px;
            margin-right: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            background: rgba(0, 0, 0, 0.3);
            &:hover {
                .showdow {
                    opacity: 1;
                }
            }
            .showdow {
                position: absolute;
                background: rgba(0, 0, 0, 0.7);
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20%;
                z-index: 99;
                opacity: 0;
                transition: all 0.3s;
                i {
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                }
            }
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>