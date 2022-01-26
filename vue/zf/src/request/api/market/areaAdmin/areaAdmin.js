import request from "@/request";
const AREA_LIST_URL = '/market/area/'

//获取区域列表
export const getList = (data) => {
    return request({
        type: "get",
        url: AREA_LIST_URL,
        data:data
    });
};

//新建区域
export const addArea = (data) => {
    return request({
        type: "post",
        url: AREA_LIST_URL,
        data: data
    });
};

//删除区域
export const delArea = (id) => {
    return request({
        type: "delete",
        url: `${AREA_LIST_URL}${id}/`,
    });
};

//编辑区域
export const updateArea = (data,id) => {
    return request({
        type: "put",
        url: `${AREA_LIST_URL}${id}/`,
        data: data
    });
};
// 获取区域详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${AREA_LIST_URL}${id}/`,
    });
};