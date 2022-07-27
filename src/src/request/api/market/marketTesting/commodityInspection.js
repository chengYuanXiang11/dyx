import request from "@/request";
const SHOP_LIST_URL = "/market/shopdetection/"
const GOODS_QUERY_URL = "/market/categoryclassify/"
const SHOP_QUERY_URL = "/market/merchant/"
const TESTITEM_QUERY_URL = "/market/detectionbills/"

//获取检测列表
export const getList = (data,query) =>{
	return request({
		type: "get",
		url: `${SHOP_LIST_URL}`,
		data:data
	})
}
//商品搜索
export const queryGoods = (query) =>{
	return request({
		type:"get",
		url:`${GOODS_QUERY_URL}?name=${query}`
	})
}
//商户搜索
export const queryShops = (query) =>{
	return request({
		type:"get",
		url:`${SHOP_QUERY_URL}?storeName=${query}`
	})
}
//检测单搜索
export const queryTestItem = (query) =>{
	return request({
		type:"get",
		url:TESTITEM_QUERY_URL
	})
}
//新增
export const addShops = (data) =>{
	return request({
		type:"post",
		url:SHOP_LIST_URL,
		data:data,
		json:true
	})
}
//删除
export const delShops = (id) =>{
	return request({
		type:"DELETE",
		url:`${SHOP_LIST_URL}${id}/`
	})
}
//获取单个详情
export const getInfo = (id) =>{
	return request({
		type:"get",
		url:`${SHOP_LIST_URL}${id}/`
	})
}
//获取单个详情
export const editTest = (data,id) =>{
	return request({
		type:"put",
		url:`${SHOP_LIST_URL}${id}/`,
		data:data,
		json:true
	})
}