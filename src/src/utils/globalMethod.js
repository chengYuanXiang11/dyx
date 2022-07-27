import store from "../store";
import {
    getDicts
} from "@/request/api/basis/dict/data";
import {
    getConfigKey
} from "@/request/api/basis/config";
import {
    getModelSelect
} from "@/utils/modelSelect";
import {
    Loading,
    Message
} from 'element-ui';
import vm from '../main.js'
const toast = {
    offset: 120,
    // toast 距离顶部距离
    duration: 1500
    // toast 显示时间
}
const $toast = function (type, msg) {
    Message({
        message: msg,
        type: type,
        offset: toast.offset,
        duration: toast.duration,
    });
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */

function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        var body = document.querySelector("body");

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {cb}
 */
function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}
import {
    parseTime
} from "./timeFormat";
exports.install = function (Vue, options) {
    Vue.prototype.$toastError = (msg) => {
            $toast("error", msg)
        },
        Vue.prototype.$toast = (msg) => {
            $toast("success", msg)
        },
        Vue.prototype.hasPermi = function (values) {
            const permissions = store.getters && store.getters.permissions;
            return permissions.some(permission => {
                return permission === "*:*:*" || values.includes(permission);
            });
        },
        // 添加日期范围
        Vue.prototype.addDateRange = function addDateRange(params, dateRange, propName) {
            const search = JSON.parse(JSON.stringify(params));
            if (dateRange != null && dateRange !== "" && dateRange.length !== 0) {
                search.as = JSON.stringify({
                    create_datetime__range: dateRange
                });
            }
            return search;
        },
        // 表单重置
        Vue.prototype.resetForm = function (refName) {
            if (this.$refs[refName]) {
                this.$refs[refName].resetFields();
            }
        },
        // 回显数据字典
        Vue.prototype.selectDictLabel = function (datas, value) {
            var actions = [];
            Object.keys(datas).some((key) => {
                if (String(datas[key].dictValue) === ("" + String(value))) {
                    actions.push(datas[key].dictLabel);
                    return true;
                }
            });
            return actions.join("");
        },
        // 获取字典默认值
        Vue.prototype.selectDictDefault = function (datas) {
            var actions = [];
            Object.keys(datas).some((key) => {
                if (datas[key].is_default === true) {
                    actions.push(datas[key].dictValue);
                    return true;
                }
            });
            if (!actions[0] && datas[0]) {
                actions.push(datas[0].dictValue);
            }
            return actions.join("");
        },
        Vue.prototype.selectDictLabels = function (datas, value, separator) {
            var actions = [];
            var currentSeparator = undefined === separator ? "," : separator;
            var temp = value.split(currentSeparator);
            Object.keys(value.split(currentSeparator)).some((val) => {
                Object.keys(datas).some((key) => {
                    if (datas[key].dictValue == ("" + temp[val])) {
                        actions.push(datas[key].dictLabel + currentSeparator);
                    }
                });
            });
            return actions.join("").substring(0, actions.join("").length - 1);
        },
        // 通用下载方法
        Vue.prototype.download = function (file_url, fileName) {
            getBlob(process.env.VUE_APP_BASE_API + file_url, function (blob) {
                saveAs(blob, fileName);
            });
        },
        // 通用loading
        Vue.prototype.$load = (text) => {
            return Loading.service({
                lock: true,
                text: text ? text : '加载中，请稍后...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        /**
         * 构造树型结构数据
         * @param {*} data 数据源
         * @param {*} id id字段 默认 'id'
         * @param {*} parentId 父节点字段 默认 'parentId'
         * @param {*} children 孩子节点字段 默认 'children'
         * @param {*} rootId 根Id 默认 0
         */
        Vue.prototype.handleTree = function (data, id, parentId, children, rootId) {
            id = id || "id";
            parentId = parentId || "parentId";
            children = children || "children";
            // 排序
            function NumCompare(a, b) {
                // 数字比较函数
                return a.orderNum - b.orderNum;
            }
            rootId = rootId || Math.min.apply(Math, data.map(item => {
                return item[parentId];
            })) || 0;
            // 对源数据深度克隆
            const cloneData = JSON.parse(JSON.stringify(data));
            // 循环所有项
            const treeData = cloneData.filter(father => {
                const branchArr = cloneData.filter(child => {
                    // 返回每一项的子级数组
                    return father[id] === child[parentId];
                });
                branchArr.sort(NumCompare);
                branchArr.length > 0 ? father.children = branchArr : "";
                // 返回第一层
                return father[parentId] === rootId || !father[parentId];
            });
            treeData.sort(NumCompare);
            return treeData !== "" ? treeData : data;
        },
        Vue.prototype.getDicts = getDicts,
        Vue.prototype.getConfigKey = getConfigKey,
        Vue.prototype.getModelSelect = getModelSelect,
        Vue.prototype.parseTime = parseTime,
        /**
         * [过滤对象]
         * @param  obj [过滤前数据]
         * @param  arr [过滤条件，要求为数组]
         */
        Vue.prototype.filterObj = (obj, arr) => {
            if (typeof (obj) !== "object" || !Array.isArray(arr)) {
                throw new Error("参数格式不正确")
            }
            const result = {}
            Object.keys(obj).filter((key) => arr.includes(key)).forEach((key) => {
                result[key] = obj[key]
            })
            return result
        },
        Vue.prototype.closePage = (router) => {
            let view = vm.$route;
            store
                .dispatch("tagsView/delView", view)
                .then(({
                    visitedViews
                }) => {
                    if(router){
                        vm.$router.push(router);
                    }
                    else{
                        const latestView = visitedViews.slice(-1)[0];
                        if (latestView) {
                            vm.$router.push(latestView.fullPath);
                        } else {
                            vm.$router.push("/");
                        }
                    }
                });
        },
        Vue.prototype.deepClone = (arr) => {
            return JSON.parse(JSON.stringify(arr))
        }
}
