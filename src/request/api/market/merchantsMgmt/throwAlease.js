import request from "@/request";
const URL = '/market/throwlease/'

// 获取列表  
export const getList = (data) => {
    return request({
        type: "get",
        url: URL,
        data: data
    });
};

export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${URL}${id}/`,
    });
};


//获取区域列表
export const getArea = (data) => {
    return request({
        type: "get",
        url: '/market/area/',
        data: data
    });
};
// 获取建筑
export const getBuilding = (area_manage) => {
    return request({
        type: "get",
        url: `/market/building/`,
        data: area_manage
    });
};
// 获取楼层
export const getFloor = (building_manage) => {
    return request({
        type: "get",
        url: `/market/floor/`,
        data: building_manage
    });
};

// 获取商位
export const getSw = (data) => {
    return request({
        type: "get",
        url: `/market/getleaselocation/`,
        data: data
    });
};

// 获取商位信息
export const getSwInfo = (data) => {
    return request({
        type: "get",
        url: `/market/getmerchantinfo/`,
        data: data
    });
};




// 提交
export const submitRequest = (data) => {
    return request({
        type: "post",
        url: '/market/throwlease/',
        data: data,
        json: true
    });
};
