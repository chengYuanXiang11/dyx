import request from "@/request";

const PRARMETER_REQUEST_URL = "/system/config/";

// 查询参数列表
export function getList(data) {
    return request({
        url: PRARMETER_REQUEST_URL,
        type: "get",
        data
    });
}

// 修改参数
export function updateParameter(id,data) {
    return request({
        url: PRARMETER_REQUEST_URL + `${id}/`,
        type: "put",
        data:{
            configValue:data.configValue,
            remark:data.remark
        }
    });
}