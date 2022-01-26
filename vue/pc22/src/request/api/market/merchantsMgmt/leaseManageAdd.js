import request from "@/request";

//获取区域列表
export const getArea = (data) => {
  return request({
      type: "get",
      url: '/market/area/',
      data:data
  });
};
// 获取建筑
export const getBuilding = (area_manage) => {
  return request({
      type: "get",
      url: `/market/building/`,
      data:area_manage
  });
};
// 获取楼层
export const getFloor = (building_manage) => {
  return request({
      type: "get",
      url: `/market/floor/`,
      data:building_manage
  });
};

// 获取商位
export const getSw = (data) => {
  return request({
      type: "get",
      url: `/market/lease/getlocationinfo/`,
      data:data
  });
};


// 提交
export const submitRequest = (data) => {
  return request({
      type: "post",
      url: '/market/lease/',
      data: data,
      json:true
  });
};

// 查看详情
export const getView = (id) => {
  return request({
      type: "get",
      url: `/market/lease/${id}/`,
  });
};

// 费用管理保存
export const getFeeSave = (id,data) => {
  return request({
      type: "put",
      url: `/market/lease/${id}/`,
      data: data,
      json:true
  });
};

// 签约
export const getContract = (data) => {
  return request({
      type: "post",
      url: '/market/lease/signingcontract/',
      data: data,
      json:true
  });
};

