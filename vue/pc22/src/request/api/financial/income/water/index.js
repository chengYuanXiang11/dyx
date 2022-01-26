import request from "@/request";
const URL = '/finance/waterratemanage/'


// 获取列表 
export const getList = (data) => {
  return request({
      type: "get",
      url: URL,
      data: data
  });
};

// 删除
export const delRow = (id) => {
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
export const updateRow = (id,data) => {
  return request({
      type: "put",
      url: `${URL}${id}/`,
      data: data,
      json:true
  })
}

// 新增
export const addRow = (data) => {
  return request({
      type: "post",
      url: URL,
      data: data,
      json:true
  });
};
