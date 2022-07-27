import request from "@/request";
const INSPECTION_LIST_URL = '/market/poolingproject/'
const INSPECTION_TREE_TABLE_URL = '/market/poolingareapick/'
const INSPECTION_TABLE_URL = '/market/poolingarea/'

//获取巡检项列表
export const getList = (data) =>{
	return request({
		type:'get',
		url:INSPECTION_LIST_URL,
		data:data
	})
}
//新增巡检项
export const addItem = (data) =>{
	return request({
		type:'post',
		url:INSPECTION_LIST_URL,
		data:data
	})
}
//删除单条巡检项
export const delItem = (id) =>{
	return request({
		type:'DELETE',
		url:`${INSPECTION_LIST_URL}${id}`
	})
}
//获取单条巡检项
export const getInfo = (id) =>{
	return request({
		type:'get',
		url:`${INSPECTION_LIST_URL}${id}`,
	})
}
//修改单条巡检项
export const updateItem = (data,id) =>{
	return request({
		type:'put',
		url:`${INSPECTION_LIST_URL}${id}/`,
		data:data
	})
}
//获取树形菜单数据
export const getTree = (id) =>{
	return request({
		type:'get',
		url:`${INSPECTION_TREE_TABLE_URL}?project_id=${id}`
	})
}
//点击树形菜单获取表格数据
export const getTable = (id,pid) =>{
	return request({
		type:'get',
		url:`${INSPECTION_TREE_TABLE_URL}${id}?project_id=${pid}`
	})
}
//新增树形菜单
export const addTree = (data) =>{
	return request({
		type:'post',
		url:`${INSPECTION_TABLE_URL}`,
		data: data,
		json: true
	})
}
//删除树形菜单
export const delTree = (id) =>{
	return request({
		type:'DELETE',
		url:`${INSPECTION_TABLE_URL}${id}`,
	})
}
//获取单条
export const getOneTree = (id) =>{
	return request({
		type:'get',
		url:`${INSPECTION_TABLE_URL}${id}/`,
	})
}
//修改单条数据
export const updateTree = (data,id) =>{
	return request({
		type:'put',
		url:`${INSPECTION_TABLE_URL}${id}/`,
		data: data,
		json: true
	})
}