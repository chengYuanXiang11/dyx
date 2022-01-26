// vuex
import store from "../store";
// 使用this对象
import vm from '../main.js'
// 公共方法
import {
    handleTree,
    filterObj,
    deepClone,
    download,
    parseTime
} from './common';
// 请求方法
import {
    getDicts
} from "@/request/api/common";
// 配置消息提示
import {
    Message
} from "element-ui";
const toast = {
    offset: 120,
    // toast 距离顶部距离
    duration: 1500
    // toast 显示时间
};
const $toast = function (type, msg) {
    Message({
        message: msg,
        type: type,
        offset: toast.offset,
        duration: toast.duration
    });
};
exports.install = function (Vue, options) {
    Vue.prototype.parseTime = parseTime
    /**
     * 构造树型结构数据
     * @param {*} data 数据源
     * @param {*} id id字段 默认 'id'
     * @param {*} parentId 父节点字段 默认 'parentId'
     * @param {*} children 孩子节点字段 默认 'children'
     * @param {*} rootId 根Id 默认 0
     */
    Vue.prototype.handleTree = handleTree
    /**
     * 验证权限
     * @param {*} values 权限字符数组
     */
    Vue.prototype.hasPermi = (values) => {
        const permissions = store.getters && store.getters.permissions;
        return permissions.some(permission => {
            return permission === "*:*:*" || values.includes(permission);
        });
    };
    /**
     * 过滤对象
     * @param {*} obj [过滤前数据]
     * @param {*} arr [过滤条件，要求为数组]
     */
    Vue.prototype.filterObj = filterObj
    /**
     * 深度克隆
     */
    Vue.prototype.deepClone = deepClone
    /**
     * 关闭当前页
     * @param {*} router 返回指定页
     */
    Vue.prototype.$closePage = (router) => {
        let view = vm.$route;
        store
            .dispatch("tagsView/delView", view)
            .then(({
                visitedViews
            }) => {
                if (router) {
                    vm.$router.push(router);
                } else {
                    const latestView = visitedViews.slice(-1)[0];
                    if (latestView) {
                        vm.$router.push(latestView.fullPath);
                    } else {
                        vm.$router.push("/");
                    }
                }
            });
    }
    /**
     * 刷新当前页
     */
    Vue.prototype.$refreshPage = () => {
        let view = vm.$route;
        store.dispatch("tagsView/delCachedView", view).then(() => {
            const {
                fullPath
            } = view;
            vm.$nextTick(() => {
                vm.$router.replace({
                    path: "/redirect" + fullPath,
                });
            });
        });
    }
    /**
     * 修改当前标签页名称
     */
    Vue.prototype.$editPageName = (name) => {
        let view = vm.$route;
        view.meta.title = name
        view = Object.assign({
            title: name
        }, view)
        store.dispatch("tagsView/updateVisitedView", view)
    }
    /**
     * 获取字典数据
     * @param {*} code 字典code
     */
    Vue.prototype.getDicts = getDicts;
    /**
     * 获取字典label
     * @param {*} data 字典数据
     * @param {*} value 字典值
     */
    Vue.prototype.formatDict = (datas, value) => {
        var actions = [];
        Object.keys(datas).some((key) => {
            if (String(datas[key].dictValue) === ("" + String(value))) {
                actions.push(datas[key].dictLabel);
                return true;
            }
        });
        return actions.join("");
    };
    /**
     * 获取字典默认值
     * @param {*} datas 字典数据
     */
    Vue.prototype.selectDictDefault = (datas) => {
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
    }
    /**
     * 格式化查询参数
     * @param {*} data 搜索表单对象
     * @param {*} config 搜索配置对象
     */
    Vue.prototype.queryFormat = (data, config) => {
        let paging = filterObj(config, ['pageNum', 'pageSize'])
        for (var key in data) {
            if (key == 'daterange' && data[key].length > 0) {
                data = Object.assign(data, {
                    as: JSON.stringify({
                        create_datetime__range: data[key]
                    })
                })
                delete data.daterange
            }
        }
        return Object.assign(paging, data)
    };
    /**
     * 成功提示
     */
    Vue.prototype.$success = (msg) => {
        $toast("success", msg)
    };
    /**
     * 失败提示
     */
    Vue.prototype.$error = (msg) => {
        $toast("error", msg)
    };
    /**
     * 普通提示
     */
    Vue.prototype.$info = (msg) => {
        $toast("info", msg)
    };
    /**
     * 警告提示
     */
    Vue.prototype.$warning = (msg) => {
        $toast("warning", msg)
    };
    // 通用下载方法
    Vue.prototype.download = download
}