import request from "@/request";
const FAULTRECORD_LIST_URL = '/market/devicerecord/'

// 获取类别列表
export const getList = (data) => {
    return request({
        type: "get",
        url: FAULTRECORD_LIST_URL,
        data:data
    });
};
//修改状态
export const updataState = (id,data) => {
    return request({
        type: "put",
        url: `${FAULTRECORD_LIST_URL}${id}/`,
        data:data,
				json:true
    });
};