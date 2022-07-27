
// 右侧弹窗组件
import Drawer from './Drawer';
// 分页组件
import Pagination from "@/components/Pagination";
// 省市区三级联动
import Province from "./Province";
// 选择职务
import PostSelect from "./PostSelect";
// 上传图片
import UploadImg from "./UploadImg";
// 选择用户弹窗
import SelectUsersDialog from "./SelectUsersDialog";
// 选择商品
import GoodsSelect from "./goodsSelect";


export default {
    install (Vue) {
        Vue.component('Yg-Drawer', Drawer),
        Vue.component('Pagination', Pagination),
        Vue.component('Province', Province),
        Vue.component('PostSelect', PostSelect),
        Vue.component('UploadImg', UploadImg),
        Vue.component('SelectUsersDialog', SelectUsersDialog),
        Vue.component('GoodsSelect', GoodsSelect)
    }
}
