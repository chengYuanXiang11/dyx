import request from "@/request";
const ITINERARY_LIST_URL = '/market/seekpoint/'
const ITINERARY_PATH_LIST_URL = '/market/seekroutine/'

//获取巡更点列表
export const getPointList = (data) =>{
	return request({
		type:'get',
		url:ITINERARY_LIST_URL,
		data:data
	})
}
//新增巡更点
export const addPoint = (data) =>{
	return request({
		type:'post',
		url:ITINERARY_LIST_URL,
		data:data,
		json:true
	})
}
//删除巡更点
export const delPoint = (id) =>{
	return request({
		type:'DELETE',
		url:`${ITINERARY_LIST_URL}${id}/`,
	})
}
//获取单条巡更点数据
export const getInfoPoint = (id) =>{
	return request({
		type:'get',
		url:`${ITINERARY_LIST_URL}${id}/`
	})
}
//修改巡更点数据
export const updatePoint = (id,data) =>{
	return request({
		type:'put',
		url:`${ITINERARY_LIST_URL}${id}/`,
		data:data,
		json:true
	})
}
//获取巡更路线列表
export const getPathList = (data) =>{
	return request({
		type:'get',
		url:ITINERARY_PATH_LIST_URL,
		data:data
	})
}
//新增巡更路线
export const addPath = (data) =>{
	return request({
		type:'post',
		url:ITINERARY_PATH_LIST_URL,
		data:data,
		json:true
	})
}
//删除巡更路线
export const delPath = (id) =>{
	return request({
		type:'delete',
		url:`${ITINERARY_PATH_LIST_URL}${id}`
	})
}

// 查询巡更路线
export const getPathInfo = (id) =>{
	return request({
		type:'get',
		url:`${ITINERARY_PATH_LIST_URL}${id}`
	})
}


// 修改巡更路线
export const updatePath = (id,data) => {
    return request({
        type: 'put',
        url: `${ITINERARY_PATH_LIST_URL}${id}/`,
        data: data,
        json: true
    })
}