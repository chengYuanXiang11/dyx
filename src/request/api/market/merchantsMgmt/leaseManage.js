import request from "@/request";
const ADDRESS_URL = '/market/getlocationlease/'


// 获取列表
export const getList = (data) => {
    return request({
        type: "get",
        url: ADDRESS_URL,
        data:data
    });
};

// 获取租赁管理列表
export const getLeaseList = (data) => {
    return request({
        type: "get",
        url: '/market/lease/',
        data:data
    });
};

// 获取详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${ADDRESS_URL}${id}/`,
    });
};

// 新增
export const addOfficeAddress = (data) => {
    return request({
        type: "post",
        url: ADDRESS_URL,
        data: data,
        json:true
    });
};

// 编辑
export const updateOfficeAddress = (data,id) => {
    return request({
        type: "put",
        url: `${ADDRESS_URL}${id}/`,
        data: data,
        json:true
    });
};

// 删除
export const delOfficeAddress = (id) => {
    return request({
        type: "delete",
        url: `${ADDRESS_URL}${id}/`,
    });
};
