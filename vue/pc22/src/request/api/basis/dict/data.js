import request from "@/request";

// 查询字典数据列表
export function listData(query) {
    return request({
        url: "/system/dict/data/",
        type: "get",
        data: query
    });
}

// 查询字典数据详细
export function getData(dictCode) {
    return request({
        url: "/system/dict/data/" + dictCode + "/",
        type: "get"
    });
}

// 根据字典类型查询字典数据信息
export function getDicts(listCode) {
    return request({
        url: "/system/list/subclassInfo/",
        type: "get",
        data: {
            listCode: listCode
        }
    });
}

// 新增字典数据
export function addData(data) {
    return request({
        url: "/system/dict/data" + "/",
        type: "post",
        data: data
    });
}

// 修改字典数据
export function updateData(data) {
    return request({
        url: "/system/dict/data/" + data.id + "/",
        type: "put",
        data: data
    });
}

// 删除字典数据
export function delData(dictCode) {
    return request({
        url: "/system/dict/data/" + dictCode + "/",
        type: "delete"
    });
}

// 导出字典数据
export function exportData(query) {
    return request({
        url: "/system/dict/data/export/",
        type: "get",
        data: query
    });
}
