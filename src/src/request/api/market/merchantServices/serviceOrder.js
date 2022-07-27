import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/serviceorder/'

// 获取类别列表
export const searchList = data=>{
    return request({
        type:"get",
        url:'market/servicestype/',
        data:data
    })
}

// 获取列表
export const getList = (data) => {
    return request({
        type: "get",
        url: OFFICE_ADDRESS_URL,
        data:data,
        json:true
    });
};

// 获取详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};

// 编辑
export const updateOfficeAddress = (data,id) => {
    return request({
        type: "put",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
        data: data,
        json:true
    });
};
