import request from "@/request";
const TEST_LIST_URL = "/market/detectionbills/"	

//获取检测列表
export const getList = (data) =>{
	return request({
		type: "get",
		url: TEST_LIST_URL,
		data:data
	})
}
//新建
export const addTest = (data) => {
    return request({
        type: "post",
        url: TEST_LIST_URL,
        data: data,
				json: true
    });
};
//获取单个
export const getInfo = (id) => {
    return request({
        type: "GET",
        url: `${TEST_LIST_URL}${id}/`,
    });
};
//修改
export const updateTest = (data,id) => {
    return request({
        type: "put",
        url: `${TEST_LIST_URL}${id}/`,
				data:data,
				json:true
    });
};
//删除
export const delTest = (id) => {
    return request({
        type: "delete",
        url: `${TEST_LIST_URL}${id}/`,
    });
};