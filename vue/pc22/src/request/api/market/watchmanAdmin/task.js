import request from "@/request";
const TASK_LIST_URL = '/market/seektask/'

//获取列表
export const getList = (data) =>{
	return request({
		type:'get',
		url:TASK_LIST_URL,
		data:data
	})
}
//更改状态
export const updataState = (data,id) =>{
	return request({
		type:'put',
		url:`${TASK_LIST_URL}${id}/`,
		data:data,
		json:true
	})
}