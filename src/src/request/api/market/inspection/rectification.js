import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/costrules/'

// 获取列表
export const getList = (data) => {
    return request({
        type: "get",
        url: OFFICE_ADDRESS_URL,
        data:data
    });
};

// 获取详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};

/**
 * 新增
 * @param  {String} office_addr_name 办公地点名称

 */
export const addOfficeAddress = (data) => {
    return request({
        type: "post",
        url: OFFICE_ADDRESS_URL,
        data: data,
        json:true
    });
};

// 编辑
export const updateOfficeAddress = (data,id) => {
    return request({
        type: "put",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
        data: data,
        json:true
    });
};

// 删除
export const delOfficeAddress = (id) => {
    return request({
        type: "delete",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};
