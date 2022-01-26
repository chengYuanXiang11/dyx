import request from "@/request";

export const getList = (data) => {
    return request({
        type: "get",
        url: '/market/leaserecord/',
        data: data
    });
};


export const getHistory = (data) => {
    return request({
        type: "get",
        url: '/market/leaserecordinfo/',
        data: data
    });
};

