import request from "@/request";
const CLEAN_CHECK_AREA_LIST = '/market/cleaningarea/get_select/'
const CLEAN_CHECK_LIST = '/market/cleaningcheck/'

//获取区域列表
export const getAreaList = (data) =>{
	return request({
		type:"get",
		url:`${CLEAN_CHECK_AREA_LIST}?name__icontains=${data}`
	})
}
export const getList = (data) =>{
	return request({
		type:"get",
		url:`${CLEAN_CHECK_LIST}?pageNum=${data.pageNum}
					&pageSize=${data.pageSize}
					&check_state=${data.state}
					&is_standard=${data.is_standard}
					&area=${data.areaname}
					&staff__icontains=${data.staff}
					&principal__icontains=${data.principal}
					&cleaning_time__icontains=${data.cleaning_time}`,
		// data:data
	})
}
export const getInfo = (id) =>{
	return request({
		type:'get',
		url:`${CLEAN_CHECK_LIST}${id}`
	})
}
//检查
export const updateState = (id,data) =>{
	return request({
		type:'put',
		url:`${CLEAN_CHECK_LIST}${id}/`,
		data:data,
		json:true
	})
}


