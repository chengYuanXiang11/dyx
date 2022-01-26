import request from "@/request";
const DICT_REQUEST_URL = "/system/listmanage/";

// 查询字典列表
export function getList() {
    return request({
        url: DICT_REQUEST_URL,
        type: "get",
        data: {
            pageNum:'all'
        }
    });
}

// 新增字段选项
export function addDict(data) {
    return request({
        url: DICT_REQUEST_URL,
        type: "post",
        data: data
    });
}

// 编辑字段选项
export function editDict(data,id) {
    return request({
        url: DICT_REQUEST_URL + `${id}/`,
        type: "put",
        data: data
    });
}

// 删除字段选项
export function delDict(id) {
    return request({
        url: DICT_REQUEST_URL + `${id}/`,
        type: "delete",
    });
}

// 获取一级列表
export function getDictOption(data) {
    return request({
        url: "/system/list/paparentInfo/",
        type: "get",
        data:data
    });
}

// 查询字典树形结构
export function getListTree() {
    return request({
        url: "/system/list/treeselect/",
        type: "get"
    });
}
