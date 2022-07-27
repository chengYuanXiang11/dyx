import request from "@/request";

// 查询通知列表
export function listMessage(query) {
  return request({
    url: "/system/message/",
    type: "get",
    data: query
  });
}

// 查询通知详细
export function getMessage(messageId) {
  return request({
    url: "/system/message/" + messageId + "/",
    type: "get"
  });
}

// 新增通知配置
export function addMessage(data) {
  return request({
    url: "/system/message/",
    type: "post",
    data: data
  });
}

// 修改通知配置
export function updateMessage(data) {
  return request({
    url: "/system/message/" + data.id + "/",
    type: "put",
    data: data
  });
}

// 删除通知配置
export function delMessage(messageId) {
  return request({
    url: "/system/message/" + messageId + "/",
    type: "delete"
  });
}

// 导出通知
export function exportMessage(query) {
  return request({
    url: "/system/message/export/",
    type: "get",
    data: query
  });
}

// 获取用户通知列表
export function userMessage(query) {
  return request({
    url: "/system/message/user_messages/",
    type: "get",
    data: query
  });
}

// 修改通知为已读
export function updateIsRead(data) {
  return request({
    url: "/system/message/is_read/" + data.id + "/",
    type: "put"
  });
}
