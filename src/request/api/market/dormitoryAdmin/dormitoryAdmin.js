import request from "@/request";
const DORMITORY_LIST_URL = '/market/dormitory/'

// 获取列表
export const getList = (data) => {
    return request({
        type: "get",
        url: DORMITORY_LIST_URL,
        data:data
    });
};
//新增
export const addDormitory = (data) =>{
	return request({
		type:'post',
		url: DORMITORY_LIST_URL,
		data : data
	})
}
//删除
export const delDormitory = (id) => {
    return request({
        type: "delete",
        url: `${DORMITORY_LIST_URL}${id}/`,
    });
};
//获取详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${DORMITORY_LIST_URL}${id}/`,
    });
};
//修改建筑信息
export const updateDormitory = (data,id) => {
    return request({
        type: "put",
        url: `${DORMITORY_LIST_URL}${id}/`,
        data: data
    });
};