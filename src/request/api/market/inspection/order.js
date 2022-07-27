import request from "@/request";
const ORDER_LIST_URL = '/market/poolingticket/'
const ITEM_LIST_URL = '/market/poolingproject/'
//获取巡检单列表
export const getList = (data) =>{
	return request({
		type:'get',
		url:ORDER_LIST_URL,
		data:data
	})
}
//获取巡检项
export const getItem = () =>{
	return request({
		type:'get',
		url:ITEM_LIST_URL,
	})
}
//新增巡检单
export const addOrder = (data) =>{
	return request({
		type:'post',
		url:ORDER_LIST_URL,
		data:data,
		json:true
	})
}
//获取单条
export const getInfo = (id) =>{
	return request({
		type:'get',
		url:`${ORDER_LIST_URL}${id}`,
	})
}
//删除
export const delOrder = (id) =>{
	return request({
		type:'DELETE',
		url:`${ORDER_LIST_URL}${id}`
	})
}
//修改
export const updateOrder = (data,id) =>{
	return request({
		type:'put',
		url:`${ORDER_LIST_URL}${id}/`,
		data:data,
		json:true
	})
}