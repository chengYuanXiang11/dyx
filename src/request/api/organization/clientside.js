import request from "@/request";
const URL = '/permission/desktop/'

// 获取列表 
export const getClientList = (data) => {
    return request({
        type: "get",
        url: URL,
        data:data
    });
};
//新增
export const addClientside = (data) => {
  return request({
      type: "post",
      url: URL,
      data: data,
      json:true
  });
};
//删除
export const delClientside = (id) =>{
	return request({
	    type: "delete",
	    url: `${URL}${id}/`,
	})
}
//获取单条
export const getInfo = (id) => {
  return request({
      type: "get",
      url: `${URL}${id}/`,
  })
}
// 编辑
export const updateClientside = (id,data) => {
  return request({
      type: "put",
      url: `${URL}${id}/`,
      data: data,
      json:true
  })
}