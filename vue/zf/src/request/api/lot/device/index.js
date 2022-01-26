import request from "@/request";
// 设备管理
const LOTINDEX_URL = "wiot/devicemanage/";

// 获取设备管理列表
export const getList = (data) => {
  return request({
    type: "get",
    url: LOTINDEX_URL,
    data: data,
  });
};

// 删除
export const delRow = (id) => {
  return request({
    type: "delete",
    url: `${LOTINDEX_URL}${id}/`,
  });
};

// 详情
export const getInfo = (id, data) => {
  return request({
    type: "get",
    url: `${LOTINDEX_URL}${id}/`,
    data: data,
  });
};

// 编辑
export const updateRow = (id, data) => {
  return request({
    type: "put",
    url: `${LOTINDEX_URL}${id}/`,
    data: data,
    json: true,
  });
};

// 新增
export const addRow = (data) => {
  return request({
    type: "post",
    url: LOTINDEX_URL,
    data: data,
    json: true,
  });
};

export const stopRow = (data) => {
  return request({
    type: "post",
    url: `${LOTINDEX_URL}stop/`,
    data: data,
    json: true,
  });
};

//获取全部设备类型
export const getListAll = (data) => {
  return request({
    type: "get",
    url: 'wiot/devicetype/getall/',
    data: data,
  });
};



// 请求对接配置
const DOCKING_URL = "wiot/configcontrol/";

// 获取对接配置列表
export function equipmentList(data) {
  return request({
    url: DOCKING_URL,
    type: "get",
    data: data,
  });
}


// 请求实例列表
const EXAMPLE_URL = "wiot/configcontrol/get_list/";
//获取实例列表
export function exampleList(data) {
  return request({
    url: EXAMPLE_URL,
    type: "get",
    data: data,
  });
}

