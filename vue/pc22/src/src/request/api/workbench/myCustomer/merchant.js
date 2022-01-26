import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/merchant/'

// 获取商户管理列表
export const getList = (data) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}`,
        data:data
    });
};

// 获取商户管理详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};

// 新增商户管理
export const addOfficeAddress = (data) => {
    return request({
        type: "post",
        url: OFFICE_ADDRESS_URL,
        data: data,
        json:true
    });
};

// 编辑商户管理
export const updateOfficeAddress = (data,id) => {
    return request({
        type: "put",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
        data: data,
        json:true
    });
};

// 删除商户管理
export const delOfficeAddress = (id) => {
    return request({
        type: "delete",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};
