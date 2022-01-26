import request from "@/request";
const URL = '/market/contract/'

// 获取列表   按申请
export const getList = (data) => {
    return request({
        type: "get",
        url: URL,
        data:data
    });
};
