import request from "@/request";
const SHIFT_URL = '/attendance/workmanage/'

// 获取班次列表
export const getList = (data) => {
    return request({
        type: "get",
        url: SHIFT_URL,
        data:data
    });
};

// 新增班次
export const addShift = (data) => {
    return request({
        type: "post",
        url: SHIFT_URL,
        data:data
    });
};

// 获取自己建立的班次
export const getSelfList = (queryName,value) => {
    return request({
        type: "get",
        url: `${SHIFT_URL}?${queryName}=${value}`,
    });
};

// 删除班次
export const delShift = (id) => {
    return request({
        type: "delete",
        url: `${SHIFT_URL}${id}/`
    });
};

// 删除班次
export const queryDetails = (id) => {
    return request({
        type: "get",
        url: `${SHIFT_URL}${id}/`
    });
};

export const editShift = (data,id) => {
    return request({
        type: "put",
        url: `${SHIFT_URL}${id}/`,
        data:data
    });
};
