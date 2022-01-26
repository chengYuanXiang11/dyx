import request from "@/request";
const OFFICE_ADDRESS_URL = '/personnel/vacation/'

// 获取假期列表
export const getList = (data) => {
    return request({
        type: "get",
        url: OFFICE_ADDRESS_URL,
        data: data
    });
};
// 获取及假期详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};
/**
 * 新增假期类型*/
export const addOfficeAddress = (data) => {
    return request({
        type: "post",
        url: OFFICE_ADDRESS_URL,
        data: data,
        json: true
    });
};
// 编辑假期类型
export const updateOfficeAddress = (data, id) => {
    return request({
        type: "put",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
        data: data,
        json: true
    });
};

// 删除假期类型
export const delHoliday = (id) => {
    return request({
        type: "delete",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};
