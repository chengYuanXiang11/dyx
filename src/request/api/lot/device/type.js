import request from "@/request";
// 设备类型
const LOTTYPE_URL= '/wiot/devicetype/'

export const getList = (data) => {
  return request({
      type: "get",
      url: LOTTYPE_URL,
      data: data,
  });
};

// 删除
export const delRow = (id) => {
  return request({
      type: "delete",
      url: `${LOTTYPE_URL}${id}/`,
  })
}

// 详情
export const getInfo = (id,data) => {
  return request({
      type: "get",
      url: `${LOTTYPE_URL}${id}/`,
      data: data,
  })
}

// 编辑
export const updateRow = (id,data) => {
  return request({
      type: "put",
      url: `${LOTTYPE_URL}${id}/`,
      data: data,
      json:true
  })
}

// 新增
export const addRow = (data) => {
  return request({
      type: "post",
      url: LOTTYPE_URL,
      data: data,
      json:true
  });
};




// 树状模糊搜索
const LOTINDEX_TREE_URL= 'wiot/devicetype/select/'

export const selectTree = (data) => {
  return request({
      type: "get",
      url: LOTINDEX_TREE_URL,
      data: data
  });
};
