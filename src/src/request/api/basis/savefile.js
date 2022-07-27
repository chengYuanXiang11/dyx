import request from "@/request";

// 查询文件列表
export function listSaveFile(query) {
  return request({
    url: "/system/savefile/",
    type: "get",
    data: query
  });
}

// 新增文件
export function addSaveFile(data) {
  return request({
    url: "/system/savefile/",
    type: "post",
    data: data
  });
}

// 删除文件
export function delSaveFile(menuId) {
  return request({
    url: "/system/savefile/" + menuId + "/",
    type: "delete"
  });
}

// 清理废弃文件
export function clearSaveFile() {
  return request({
    url: "/system/clearsavefile/",
    type: "post"
  });
}
