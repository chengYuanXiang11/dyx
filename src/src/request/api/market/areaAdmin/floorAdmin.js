import request from "@/request";
const FLOOR_LIST_URL = '/market/floor/'

export const getFloorList = (id,data) => {//获取列表
    return request({
        type: "get",
        url: `${FLOOR_LIST_URL}?building_manage=${id}`,
				data:data
    });
};
export const addFloor = (data) => {//新增
    return request({
        type: "post",
        url: FLOOR_LIST_URL,
        data: data
    });
};
export const getInfo = (id) => {//获取详情
    return request({
        type: "get",
        url: `${FLOOR_LIST_URL}${id}/`,
    });
};
export const updateFloor = (data,id) => {//修改信息
    return request({
        type: "put",
        url: `${FLOOR_LIST_URL}${id}/`,
        data: data
    });
};
export const delFloor = (id) => {//删除
    return request({
        type: "delete",
        url: `${FLOOR_LIST_URL}${id}/`,
    });
};