import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/servicecare/'

// 获取列表   按申请
export const getList = (data) => {
    return request({
        type: "get",
        url: '/market/getmerchantlease/',
        data:data
    });
};

// 获取列表  按商位
export const getListTwo = (data) => {
    return request({
        type: "get",
        url: '/market/getlocationlease/',
        data:data
    });
};

// 获取列表  按申请--查看
export const getListInfo= (id,data) => {
    return request({
        type: "get",
        url: `/market/getlocationlease/${id}/`,
        data:data
    });
};

