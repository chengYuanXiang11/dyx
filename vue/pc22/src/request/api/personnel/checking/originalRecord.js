import request from "@/request";
const TABLE_LIST_URL = '/attendance/punchCard/'

export const getList = (data) => {
    return request({
        type: "get",
        url: TABLE_LIST_URL,
        data:data
    });
};
