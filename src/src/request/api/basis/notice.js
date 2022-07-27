import request from "@/request";

// 查询公告列表
export function listNotice(query) {
  return request({
    url: "/system/notice/list",
    type: "get",
    data: query
  });
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: "/system/notice/" + noticeId,
    type: "get"
  });
}

// 新增公告
export function addNotice(data) {
  return request({
    url: "/system/notice",
    type: "post",
    data: data
  });
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: "/system/notice",
    type: "put",
    data: data
  });
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: "/system/notice/" + noticeId,
    type: "delete"
  });
}
