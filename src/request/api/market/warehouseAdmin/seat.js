import request from "@/request";
const SEAT_LIST_URL = '/market/warelocation/'
const SEAT_ALL_LIST_URL = '/market/warelocation/getlocation/'

//获取列表
export const getList = (id,data) =>{
	return request({
		typpe:"get",
		url:`${SEAT_ALL_LIST_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}&warehouse_id=${id}`,
		data:data
	});
};
//新建
export const addSeat= (data) =>{
	return request({
		type:'post',
		url: SEAT_LIST_URL,
		data : data
	});
};
//删除
export const delSeat = (id) => {
    return request({
        type: "delete",
        url: `${SEAT_LIST_URL}${id}/`,
    });
};
//详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${SEAT_LIST_URL}${id}/`,
    });
};
//修改信息
export const updateSeat = (data,id) => {
    return request({
        type: "put",
        url: `${SEAT_LIST_URL}${id}/`,
        data: data
    });
};