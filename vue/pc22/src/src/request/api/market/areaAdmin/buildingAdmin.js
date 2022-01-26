import request from "@/request";
const BUILDING_LIST_URL = '/market/building/'

export const getBuildingList = (id,data) => {//获取列表
    return request({
        type: "get",
        url: `${BUILDING_LIST_URL}?area_manage=${id}`,
				data:data
    });
};
export const addBuilding = (data) => {//新增
    return request({
        type: "post",
        url: BUILDING_LIST_URL,
        data: data
    });
};
export const delBuilding = (id) => {//删除
    return request({
        type: "delete",
        url: `${BUILDING_LIST_URL}${id}/`,
    });
};
export const getInfo = (id) => {//获取详情
    return request({
        type: "get",
        url: `${BUILDING_LIST_URL}${id}/`,
    });
};
export const updateBuilding = (data,id) => {//修改建筑信息
    return request({
        type: "put",
        url: `${BUILDING_LIST_URL}${id}/`,
        data: data
    });
};