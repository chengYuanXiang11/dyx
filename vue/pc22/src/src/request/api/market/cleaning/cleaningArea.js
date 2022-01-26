import request from "@/request";
const CLEAN_AREA_LIST_URL = '/market/cleaningarea/'

//获取列表
export const getList = (data) =>{
	return request({
		type:"get",
		url:`${CLEAN_AREA_LIST_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`
	})
}
//新建
export const addCleanArea = (data) =>{
	return request({
		type:'post',
		url: CLEAN_AREA_LIST_URL,
		data : data,
		json: true
	});
};
//删除
export const delCleanArea = (id) => {
    return request({
        type: "delete",
        url: `${CLEAN_AREA_LIST_URL}${id}/`,
    });
};
//详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${CLEAN_AREA_LIST_URL}${id}/`,
    });
};
//修改信息
export const updateCleanArea = (data,id) => {
    return request({
        type: "put",
        url: `${CLEAN_AREA_LIST_URL}${id}/`,
        data: data,
				json:true
    });
};