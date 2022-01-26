import request from "@/request";

// 选人
const SELECT_USER_URL = '/system/personselect/'

// 获取路由
export const getRouters = () => {
    return request({
        type: "get",
        url: "/getRouters/"
    });
};

// 根据字典类型查询字典数据信息
export function getDicts(listCode) {
    return request({
        url: "/system/list/subclassInfo/",
        type: "get",
        data: {
            listCode: listCode
        }
    });
}

// 查询人员
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

// 获取租聘
export const getRent = (data) => {
    return request({
        type: "get",
        url: 'finance/rentmanage/selectlocation/',
        data: data
    });
  };
