import request from "@/request";
const WAREHOUSE_LIST_URL = '/market/warehouse/'

//获取列表
export const getList = (data) =>{
	return request({
		typpe:"get",
		url:`${WAREHOUSE_LIST_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
	});
};
//新增
export const addWarehouse = (data) =>{
	return request({
		type:'post',
		url: WAREHOUSE_LIST_URL,
		data : data,
		json:true
	});
};
//详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${WAREHOUSE_LIST_URL}${id}/`,
    });
};
//修改信息
export const updateWarehouse = (data,id) => {
    return request({
        type: "put",
        url: `${WAREHOUSE_LIST_URL}${id}/`,
        data: data,
				json:true
    });
};
//删除
export const delWarehouse = (id) => {
    return request({
        type: "delete",
        url: `${WAREHOUSE_LIST_URL}${id}/`,
    });
};
