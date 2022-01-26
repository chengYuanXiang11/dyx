import request from "@/request";
const URL = '/finance/inoutfee/'

//获取列表
export const getList = (data) => {
  return request({
      type: "get",
      url: URL,
			data:data
  });
};
//新增
export const addFee = (data) => {
  return request({
      type: "post",
      url: URL,
      data: data,
      json:true
  });
};
//删除
export const delFee = (id) => {
  return request({
      type: "delete",
      url: `${URL}${id}/`,
  })
}
// 详情
export const getInfo = (id) => {
  return request({
      type: "get",
      url: `${URL}${id}/`,
  })
}
// 编辑
export const updateFee = (id,data) => {
  return request({
      type: "put",
      url: `${URL}${id}/`,
      data: data,
      json:true
  })
}