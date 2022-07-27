import {
    Quill
} from 'vue-quill-editor'
//quill图片可拖拽上传
import {
    ImageDrop
} from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop);
//quill图片可拖拽改变大小
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{
        'header': 1
    }, {
        'header': 2
    }],
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }],
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }],
    [{
        'direction': 'rtl'
    }],
    [{
        'size': ['small', false, 'large', 'huge']
    }],
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],
    [{
        'color': []
    }, {
        'background': []
    }],
    [{
        'font': []
    }],
    [{
        'align': []
    }],
    ['clean'],
    ['link', 'image'],
    ['upload'],
];

const handlers = {
    //   实现图片上传功能
    'image': function (value) {
        if (value) {
            // document.querySelector('.avatar-uploader input').click()
            document.querySelector('.upload-component input').click()
        } else {
            this.quill.format('image', false)
        }
    }

};
// 工具栏功能提示
const titleConfig = [{
        Choice: '.ql-bold',
        title: '加粗'
    },
    {
        Choice: '.ql-italic',
        title: '斜体'
    },
    {
        Choice: '.ql-underline',
        title: '下划线'
    },
    {
        Choice: '.ql-header',
        title: '段落格式'
    },
    {
        Choice: '.ql-strike',
        title: '删除线'
    },
    {
        Choice: '.ql-blockquote',
        title: '块引用'
    },
    {
        Choice: '.ql-code',
        title: '插入代码'
    },
    {
        Choice: '.ql-code-block',
        title: '插入代码段'
    },
    {
        Choice: '.ql-font',
        title: '字体'
    },
    {
        Choice: '.ql-size',
        title: '字体大小'
    },
    {
        Choice: '.ql-list[value="ordered"]',
        title: '编号列表'
    },
    {
        Choice: '.ql-list[value="bullet"]',
        title: '项目列表'
    },
    {
        Choice: '.ql-direction',
        title: '文本方向'
    },
    {
        Choice: '.ql-header[value="1"]',
        title: 'h1'
    },
    {
        Choice: '.ql-header[value="2"]',
        title: 'h2'
    },
    {
        Choice: '.ql-align',
        title: '对齐方式'
    },
    {
        Choice: '.ql-color',
        title: '字体颜色'
    },
    {
        Choice: '.ql-background',
        title: '背景颜色'
    },
    {
        Choice: '.ql-image',
        title: '图像'
    },
    {
        Choice: '.ql-upload',
        title: '文件'
    },
    {
        Choice: '.ql-link',
        title: '添加链接'
    },
    {
        Choice: '.ql-formula',
        title: '插入公式'
    },
    {
        Choice: '.ql-clean',
        title: '清除字体格式'
    },
    {
        Choice: '.ql-script[value="sub"]',
        title: '下标'
    },
    {
        Choice: '.ql-script[value="super"]',
        title: '上标'
    },
    {
        Choice: '.ql-indent[value="-1"]',
        title: '向左缩进'
    },
    {
        Choice: '.ql-indent[value="+1"]',
        title: '向右缩进'
    },
    {
        Choice: '.ql-header .ql-picker-label',
        title: '标题大小'
    },
    {
        Choice: '.ql-header .ql-picker-item[data-value="1"]',
        title: '标题一'
    },
    {
        Choice: '.ql-header .ql-picker-item[data-value="2"]',
        title: '标题二'
    },
    {
        Choice: '.ql-header .ql-picker-item[data-value="3"]',
        title: '标题三'
    },
    {
        Choice: '.ql-header .ql-picker-item[data-value="4"]',
        title: '标题四'
    },
    {
        Choice: '.ql-header .ql-picker-item[data-value="5"]',
        title: '标题五'
    },
    {
        Choice: '.ql-header .ql-picker-item[data-value="6"]',
        title: '标题六'
    },
    {
        Choice: '.ql-header .ql-picker-item:last-child',
        title: '标准'
    },
    {
        Choice: '.ql-size .ql-picker-item[data-value="small"]',
        title: '小号'
    },
    {
        Choice: '.ql-size .ql-picker-item[data-value="large"]',
        title: '大号'
    },
    {
        Choice: '.ql-size .ql-picker-item[data-value="huge"]',
        title: '超大号'
    },
    {
        Choice: '.ql-size .ql-picker-item:nth-child(2)',
        title: '标准'
    },
    {
        Choice: '.ql-align .ql-picker-item:first-child',
        title: '居左对齐'
    },
    {
        Choice: '.ql-align .ql-picker-item[data-value="center"]',
        title: '居中对齐'
    },
    {
        Choice: '.ql-align .ql-picker-item[data-value="right"]',
        title: '居右对齐'
    },
    {
        Choice: '.ql-align .ql-picker-item[data-value="justify"]',
        title: '两端对齐'
    }
];

export default {
    placeholder: '',
    theme: 'snow', // 主题
    modules: {
        toolbar: {
            container: toolOptions, // 工具栏选项
            handlers: handlers, // 事件重写
        },
        imageResize: {}, // 拖拽改变图片大小
        // imageDrop: true, // 拖拽上传文件
    },
    titleConfig,
};
