import request from "@/request";

// 查询操作日志列表
export function list(query) {
  return request({
    url: "/system/operation_log/",
    type: "get",
    data: query
  });
}

// 删除操作日志
export function delOperationLog(operId) {
  return request({
    url: "/system/operation_log/" + operId + "/",
    type: "delete"
  });
}

// 清空操作日志
export function cleanOperationLog() {
  return request({
    url: "/system/operation_log/clean/",
    type: "delete"
  });
}

// 导出操作日志
export function exportOperationLog(query) {
  return request({
    url: "/system/operation_log/export/",
    type: "get",
    data: query
  });
}
