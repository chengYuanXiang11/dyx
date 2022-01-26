import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/repairtask/'

// 获取维修任务列表
export const getList = (data) => {
    return request({
        type: "get",
        url: OFFICE_ADDRESS_URL,
        data:data
    });
};

// 获取列表单条数据
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};

// 点击完成后修改维修信息数据
export const updateRepairInfo = (data,id) => {
    return request({
        type: "put",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
        data: data
    });
};
