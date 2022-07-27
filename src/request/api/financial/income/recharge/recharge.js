import request from "@/request";
const URL = '/finance/rechargeactivity/'

//新增
export const addRecharge = (data) => {
  return request({
      type: "post",
      url: URL,
      data: data,
      json:true
  });
};
// 获取列表 
export const getList = (data) => {
  return request({
      type: "get",
      url: URL,
  });
};
//删除
export const delRecharge = (id) => {
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
export const updateRecharge = (id,data) => {
  return request({
      type: "put",
      url: `${URL}${id}/`,
      data: data,
      json:true
  })
}
