import request from "@/request";
const SHOP_LIST_URL = '/market/shop/'


// 获取商铺列表
export const getList = (data) => {
    return request({
        type: "get",
        url: SHOP_LIST_URL,
        data:data
    });
};
export const addShops = (data) => {//新增
    return request({
        type: "post",
        url: SHOP_LIST_URL,
        data: data
    });
};
export const getInfo = (id) => {//获取详情
    return request({
        type: "get",
        url: `${SHOP_LIST_URL}${id}/`,
    });
};
export const updateShops = (data,id) => {//修改建筑信息
    return request({
        type: "put",
        url: `${SHOP_LIST_URL}${id}/`,
        data: data
    });
};
export const delShops = (id) => {//删除
    return request({
        type: "delete",
        url: `${SHOP_LIST_URL}${id}/`,
    });
};