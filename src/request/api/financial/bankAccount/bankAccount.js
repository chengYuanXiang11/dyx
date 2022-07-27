import request from "@/request";
const BANK_ACCOUNT_URL = '/finance/bankaccount/'
const TYPE_BANK_ACCOUNT_URL = '/finance/bankaccount/search/'
const PAY_TYPE_LIST = '/system/listmanage/'

//获取账户列表
export const getList = (data) => {
    return request({
        type: "get",
        url: BANK_ACCOUNT_URL,
        data:data
    });
};
//获取绑定账户
export const getType = (data) => {
    return request({
        type: "post",
        url: TYPE_BANK_ACCOUNT_URL,
				data:data,
				json:true
    });
};
//添加
export const addBank = (data) => {
    return request({
        type: "post",
        url: BANK_ACCOUNT_URL,
				data:data,
				json:true
    });
};
//删除
export const delBank = (id) => {
    return request({
        type: "DELETE",
        url: `${BANK_ACCOUNT_URL}${id}`,
    });
};
//获取单条
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${BANK_ACCOUNT_URL}${id}/`,
    });
};
//修改
export const updateBank = (data,id) => {
    return request({
        type: "put",
        url: `${BANK_ACCOUNT_URL}${id}/`,
				data:data,
				json:true
    });
};
