import request from "@/request";
const TOTAL_LIST_URL = '/market/seekrecord/'

//获取列表
export const getList = (data) =>{
	return request({
		type:'get',
		url:TOTAL_LIST_URL,
		data:data
	})
}
