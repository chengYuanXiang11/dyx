<template>
    <div>
        <el-upload
            accept="image/*"
            :headers="headers"
            :action="action"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            class="img-uploader"
            hidden
        >
            <el-button size="small" type="primary"
                >点击上传图片 到 文本编辑器</el-button
            >
        </el-upload>
        <quillEditor
            ref="myQuillEditor"
            v-model="content"
            :options="editorOption"
            class="editor"
        />
    </div>
</template>

<script>
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill"; //引入编辑器
import { getToken } from "@/utils/auth";

import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);

const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
    [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
    [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ font: [] }], // 字体种类-----[{ font: [] }]
    [{ align: [] }], // 对齐方式-----[{ align: [] }]
    ["clean"], // 清除文本格式-----['clean']
    ["image"], // 链接、图片、视频-----['link', 'image', 'video']
];
export default {
    name: "Editor",
    props: {
        /* 编辑器的内容 */
        value: {
            type: String,
            default: "",
        },
        /* 高度 */
        height: {
            type: Number,
            default: null,
        },
        /* 最小高度 */
        minHeight: {
            type: Number,
            default: null,
        },
    },
    components: {
        quillEditor,
    },
    data() {
        return {
            // 富文本编辑器默认内容
            content: this.value,
            //富文本编辑器配置
            editorOption: {
                //  富文本编辑器配置
                modules: {
                    clipboard: {
                        // 粘贴版，处理粘贴时候带图片
                        matchers: [
                            [Node.ELEMENT_NODE, this.handleCustomMatcher],
                        ],
                    },
                    imageResize: {},
                    toolbar: {
                        container: toolbarOptions, // container为工具栏，此次引入了全部工具栏，也可自行配置
                        handlers: {
                            image: function (value) {
                                // 劫持原来的图片点击按钮事件
                                if (value) {
                                    // 触发input框选择图片文件
                                    document
                                        .querySelector(".img-uploader input")
                                        .click();
                                } else {
                                    this.quill.format("image", false);
                                }
                            },
                        },
                    },
                },
                theme: "snow",
                placeholder: "请输入正文",
            },
            action: process.env.VUE_APP_BASE_API + "/system/savefile/",
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            ext: ["jpg", "png", "gif", "bmp"],
            size: 2,
        };
    },
    computed: {
        styles() {
            const style = {};
            if (this.minHeight) {
                style.minHeight = `${this.minHeight}px`;
            }
            if (this.height) {
                style.height = `${this.height}px`;
            }
            return style;
        },
    },
    watch: {
        value: {
            handler(val) {
                if (val !== this.content) {
                    this.content = val === null ? "" : val;
                }
            },
            immediate: true,
        },
        content(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
        beforeUpload(file) {
            const fileName = file.name.split(".");
            const fileExt = fileName[fileName.length - 1];
            const isTypeOk = this.ext.indexOf(fileExt) >= 0;
            const isSizeOk = file.size / 1024 / 1024 < this.size;
            if (!isTypeOk) {
                this.$error(`上传图片只支持 ${this.ext.join(" / ")} 格式！`);
            }
            if (!isSizeOk) {
                this.$error(`上传图片大小不能超过 ${this.size}MB！`);
            }
            return isTypeOk && isSizeOk;
        },
        onSuccess(response) {
            if (response.code != 200) {
                this.$notify.error({
                    title: response.msg,
                });
            } else {
                this.$success("上传图片成功！");
                let quill = this.$refs.myQuillEditor.quill;
                let length = quill.getSelection().index;
                let url = process.env.VUE_APP_BASE_API + response.data.file_url;
                // 插入图片
                quill.insertEmbed(length, "image", url);
                // 调整光标到最后
                quill.setSelection(length + 1);
            }
        },
        handleCustomMatcher(node, Delta) {
            let ops = [];
            Delta.ops.forEach((op) => {
                if (op.insert && typeof op.insert === "string") {
                    // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
                    ops.push({
                        insert: op.insert,
                    });
                }
            });
            Delta.ops = ops;
            return Delta;
        },
    },
};
</script>

<style lang='scss' >
.editor {
    line-height: normal !important;
    height: 500px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
    content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
}
</style>