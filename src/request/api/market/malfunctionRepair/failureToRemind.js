import request from "@/request";
const MALFUNCTION_REMIND_LIST = '/market/devicewarn/'

// 获取维修任务列表
export const getList = (data) => {
    return request({
        type: "get",
        url: MALFUNCTION_REMIND_LIST,
        data: data
    });
};
