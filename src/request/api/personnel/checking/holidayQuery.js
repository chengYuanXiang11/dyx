import request from "@/request";
const HOLIDAY_QUERY_URL = '/personnel/vacationcheck/'
const HOLIDAY_LOG_URL = '/personnel/vacationcheckrecord/'

export const getList = (data) =>{
	return request({
		type: 'get',
		url: HOLIDAY_QUERY_URL,
		data:data
	})
}

export const getInfo = (id) =>{
	return request({
		type: 'get',
		url: `${HOLIDAY_QUERY_URL}${id}/`,
	})
}

export const editHoliday = (data,id) =>{
	return request({
		type: 'put',
		url: `${HOLIDAY_QUERY_URL}${id}/`,
		data:data,
		json:true
	})
}

export const Log = (id,name,data) =>{
	return request({
		type:"get",
		url:`${HOLIDAY_LOG_URL}?vacation_check_id_id=${id}&change_key=${name}`,
		data:data
	})
}
