import request from "@/request";
const POLLING_TASK_URL = '/market/poolingtask/'
const ORDER_LIST_URL = '/market/poolingticket/'
const INSPECTION_TREE_TABLE_URL = '/market/poolingareapick/'
// 获取列表
export const getList = (data) =>{
	return request({
		type:'get',
		url:POLLING_TASK_URL,
		data:data
	})
}
//获取巡检单
export const getItemList = (data) =>{
	return request({
		type:'get',
		url:ORDER_LIST_URL,
		data:data
	})
}
//新增任务
export const addTask = (data) =>{
	return request({
		type:'post',
		url:POLLING_TASK_URL,
		data:data,
		json:true
	})
}
//删除任务
export const delTask = (id) =>{
	return request({
		type:'delete',
		url:`${POLLING_TASK_URL}${id}`
	})
}
//巡检任务管理//获取单条
export const getInfo = (id) =>{
	return request({
		type:'get',
		url:`${POLLING_TASK_URL}${id}`
	})
}
//获取树形菜单数据
export const getTree = (id) =>{
	return request({
		type:'get',
		url:`${INSPECTION_TREE_TABLE_URL}?project_id=${id}`
	})
}
//任务管理确定
export const manageTask = (data,id) =>{
	return request({
		type:'put',
		url:`${POLLING_TASK_URL}${id}/`,
		data:data,
		json:true
	})
}