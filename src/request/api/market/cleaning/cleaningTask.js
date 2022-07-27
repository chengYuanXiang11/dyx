import request from "@/request";
const CLEAN_TASK_AREA_LIST = '/market/cleaningarea/get_select/'
const CLEAN_TASK_LIST = '/market/cleaningtask/'

//获取区域列表
export const getAreaList = (data) =>{
	return request({
		type:"get",
		url:`${CLEAN_TASK_AREA_LIST}?name__icontains=${data}`
	})
}
//获取表格数据
export const getList = (data) =>{
	return request({
		type:"get",
		url:`${CLEAN_TASK_LIST}?pageNum=${data.pageNum}
					&pageSize=${data.pageSize}
					&area__name=${data.areaname}
					&task_state=${data.state}
					&is_standard=${data.is_standard}
					&staff__username__icontains=${data.staff}
					&principal__icontains=${data.principal}
					&complete_datetime__icontains=${data.cleaning_time}`,
	})
}
//新建
export const addClean = (data) =>{
	return request({
		type:"post",
		url: CLEAN_TASK_LIST,
		data:data,
		json: true
	})
}
//删除
export const delClean = (id) => {
    return request({
        type: "delete",
        url: `${CLEAN_TASK_LIST}${id}/`,
    });
};
//获取单条
export const getInfo = (id) =>{
	return request({
		type:'get',
		url:`${CLEAN_TASK_LIST}?id=${id}`
	})
}