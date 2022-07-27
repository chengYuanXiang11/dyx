import request from "@/request";
const PLAN_LIST_URL = '/market/seekplan/'

//获取巡更计划列表
export const getList = (data) =>{
	return request({
		type:'get',
		url:PLAN_LIST_URL,
		data:data
	})
}
//新增
export const addPlan = (data) =>{
	return request({
		type:'post',
		url:PLAN_LIST_URL,
		data:data,
		json:true
	})
}
//删除
export const delPlan = (id) =>{
	return request({
		type:"delete",
		url:`${PLAN_LIST_URL}${id}/`
	})
}
//获取单条
export const getInfo = (id) =>{
	return request({
		type:'get',
		url:`${PLAN_LIST_URL}${id}/`
	})
}
//修改
export const updataPlan = (id,data) =>{
	return request({
		type:'put',
		url:`${PLAN_LIST_URL}${id}/`,
		data:data,
		json:true
	})
}