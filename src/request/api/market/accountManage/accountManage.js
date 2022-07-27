import request from "@/request";
const ACCOUNT_LIST_URL = '/finance/deductionrules/'
const PAYITEMS_LIST_URL = '/finance/payitems/'

//获取列表
export const getList = (data) => {
    return request({
        type: "get",
        url: ACCOUNT_LIST_URL,
        data:data
    });
};
//获取账户类型
export const getItem = () => {
    return request({
        type: "get",
        url: PAYITEMS_LIST_URL
    });
};
//新增
export const addAccount = (data) => {
	return request({
		type:'post',
		url: ACCOUNT_LIST_URL,
		data:data,
		json:true
	})
}
//删除
export const delAccount = (id) => {
	return request({
		type:'delete',
		url: `${ACCOUNT_LIST_URL}?code_id=${id}`
	})
}
//获取单条
export const getInfo = (id) => {
	return request({
		type:'get',
		url: `${ACCOUNT_LIST_URL}get/?code_id=${id}`
	})
}
//修改
export const updateAccount = (id,data) => {
	return request({
		type:'put',
		url: `${ACCOUNT_LIST_URL}${id}/`,
		data:data,
		json:true
	})
}