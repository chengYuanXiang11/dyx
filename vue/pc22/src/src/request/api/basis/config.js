import request from "@/request";

// 查询参数列表
export function listConfig(query) {
  return request({
    url: "/system/config/",
    type: "get",
    data: query
  });
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: "/system/config/" + configId + "/",
    type: "get"
  });
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: "/system/config/configKey/" + configKey + "/?status=1",
    type: "get"
  });
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: "/system/config/",
    type: "post",
    data: data
  });
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: "/system/config/" + data.id + "/",
    type: "put",
    data: data
  });
}

// 删除参数配置
export function delConfig(configId) {
  return request({
    url: "/system/config/" + configId + "/",
    type: "delete"
  });
}

// 清理参数缓存
export function clearCache() {
  return request({
    url: "/system/config/clearCache/",
    type: "delete"
  });
}

// 导出参数
export function exportConfig(query) {
  return request({
    url: "/system/config/export/",
    type: "get",
    data: query
  });
}
