import request from "@/request";

// 获取省市区
const PROVINCE_REQUEST_URL = '/system/areas/'
// 选人
const SELECT_USER_URL = '/system/personselect/'
// 选商品
const SELECT_GOODS = '/system/personselect/'

export function getProvince(id) {
    return request({
        type: "get",
        url: id ? `${PROVINCE_REQUEST_URL}${id}/` : PROVINCE_REQUEST_URL
    });
}

export function getPerson(id) {
    return request({
        type: "get",
        url: id ? `${SELECT_USER_URL}${id}/` : SELECT_USER_URL
    });
}

export function getGoods(data) {
    return request({
        type: "get",
        url: '/market/categoryclassify/',
        data:data
    });
}
