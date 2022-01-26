<template>
    <div class="upload-main">
        <el-row v-if="list">
            <el-col v-for="(item, index) in fileList" :key="index">
                <el-col class="file_warp">
                    <el-col class="file_content">
                        <el-image
                            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                            style="
                                width: 40px;
                                height: 40px;
                                margin-right: 15px;
                            "
                        ></el-image>
                        <el-col class="file_news">
                            <span class="file_name">
                                {{ item.name }}
                            </span>
                            <span class="file_size"> {{ item.size }}</span>
                        </el-col>
                    </el-col>
                    <el-col :span="8" class="file_handler">
                        <el-button type="text" @click="remove(index)"
                            >删除</el-button
                        >
                    </el-col>
                </el-col>
                <el-progress
                    v-if="!(item.percentage == 100)"
                    :percentage="item.percentage"
                    status="success"
                ></el-progress>
            </el-col>
        </el-row>
        <el-upload
            ref="upload2"
            :limit="limit"
            :drag="drag"
            :headers="upload.headers"
            :action="upload.url"
            :on-error="handleFileErroe"
            :on-success="handleFileSuccess"
            :on-progress="handleFileUploadProgress"
            :before-upload="handleUploadChange"
            :multiple="multiple"
            :http-request="customUpload"
            :show-file-list="false"
        >
            <span v-if="drag">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                </div>
            </span>

            <el-button slot="trigger" v-if="list">添加附件</el-button>
        </el-upload>
    </div>
</template>
<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
    name: "Execl",
    data() {
        return {
            action: process.env.VUE_APP_BASE_API + "/system/savefile/",
            fileList: this.value,
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            initialIndex: 0,
            asdd: [],
            // 导入参数
            upload: {
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/system/savefile/",
            },
            imgUrl: "",
            srcList: [],
        };
    },
    props: {
        limit: {
            type: Number,
            default: 6,
        },
        value: {
            type: Array,
            default: () => [],
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        list: {
            type: Boolean,
            default: true,
        },
        drag: {
            type: Boolean,
            default: false,
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
        handleUploadChange(file) {
            let key = false;
            if (this.fileList.length == 0) {
                key = false;
            } else if (this.fileList.some((v) => v.name === file.name)) {
                key = true;
            }
            if (key) {
                this.$message.error("文件重复");
                return false;
            } else {
                let M = Math.floor(file.size / 1024 / 1024);
                let k = Math.ceil(file.size / 1024);
                let size = `${M > 0 ? M : ""}${M > 0 ? "M" : ""}${
                    k <= 0 ? 1 : k
                }k`;
                this.fileList.push({
                    name: file.name,
                    percentage: 0,
                    type: file.type,
                    size,
                });
            }
        },

        customUpload(file) {
            let FormDatas = new FormData();
            FormDatas.append("file", file.file);
            axios({
                url: this.upload.url,
                method: "post",
                data: FormDatas,
                headers: {
                    "content-type": "multipart/form-data",
                    Authorization: "Bearer " + getToken(),
                },
                //上传进度
                onUploadProgress: (progressEvent) => {
                    let num =
                        ((progressEvent.loaded / progressEvent.total) * 100) |
                        0; //百分比
                    file.onProgress({ percent: num, name: file.file.name }); //进度条
                },
            })
                .then((data) => {
                    file.onSuccess(data); //上传成功(
                })
                .catch((err) => {
                    file.onError(err);
                });
        },
        remove(index) {
            this.fileList.splice(index, 1);
        },
        //根据文件类型返回图片
        filType(type) {
            switch (type) {
                case "text/plain":
                    return "这是一个text格式的文件";
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return "这是一个xlsx格式的文件";
            }
        },
        // 文件上传中处理（进度处理）
        handleFileUploadProgress(event, file, fileList) {
            let arrLength = 0;
            if (this.fileList.length > 0) {
                arrLength = this.fileList.findIndex(
                    (v) => v.name === event.name
                );
            }
            let percentage = Math.floor(event.percent);
            this.$set(this.fileList[arrLength], "percentage", percentage);
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            let arrLength = this.fileList.findIndex(
                (v) => v.name === file.name
            );
            this.$set(
                this.fileList[arrLength],
                "url",
                process.env.VUE_APP_BASE_API + response.data.file_url
            );
            // 当全部上传完成后在删除
            if (this.fileList.every((v) => v.percentage === 100)) {
                if (this.$refs.upload2) {
                    this.$refs.upload2.clearFiles();
                }
                this.$emit("uploadStatue", true);
            }
        },
        // 文件上传失败处理
        handleFileErroe(err, file, fileList) {
            let index = this.fileList.findIndex((v) => v.name === file.name);
            this.fileList.splice(index, 1);
            this.$message.error("文件上传失败，请稍后重试");
            this.$emit("uploadStatue", false);
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
    .file_warp {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        border: 1px solid #e6ebf5;
        border-radius: 5px;
        margin: 5px 0;
        .file_content {
            display: flex;
            justify-content: flex-start;
            .file_news {
                display: flex;
                flex-flow: column;
                .file_name {
                    font-size: 14px;
                    color: #606266;
                    vertical-align: middle;
                    margin-bottom: 5px;
                }
                .file_size {
                    font-size: 14px;
                    color: #c0c4cc;
                    vertical-align: middle;
                }
            }
        }
        .file_handler {
            display: flex;
            justify-content: flex-end;
            margin-right: 15px;
        }
    }
}
</style>
