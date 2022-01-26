
// 表格布局组件
import tablePage from './Layout/Table-page';
// 表单布局组件
import formPage from './Layout/Form-page';
// 页面布局组件
import page from './Layout/Page';
// 图片上传组件
import imgUpload from './ImagesUpload';
// 图片预览组件
import imgPreview from './ImagePreview';
// 右侧抽屉
import drawer from './Drawer';
// Dialog
import dialog from './Dialog';
// 参数下拉选择器
import dictSelect from './DictSelect';
// 选人弹窗
import SelectUsersDialog from './SelectUsersDialog';
// 选择商品
import GoodsSelect from "./goodsSelect";


export default {
    install (Vue) {
        Vue.component('TablePage', tablePage),
        Vue.component('FormPage', formPage),
        Vue.component('Page', page),
        Vue.component('ImageUpload', imgUpload),
        Vue.component('ImagePreview', imgPreview),
        Vue.component('Drawer', drawer),
        Vue.component('Dialog', dialog),
        Vue.component('DictSelect', dictSelect),
        Vue.component('SelectUsersDialog', SelectUsersDialog),
        Vue.component('GoodsSelect', GoodsSelect)
    }
}
