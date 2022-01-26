import request from "@/request";

// 查询角色列表
export function listRole(query) {
  return request({
    url: "/permission/role/",
    type: "get",
    data: query
  });
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: "/permission/role/" + roleId + "/",
    type: "get"
  });
}

// 新增角色
export function addRole(data) {
  return request({
    url: "/permission/role/",
    type: "post",
    data: data
  });
}

// 修改角色
export function updateRole(data) {
  return request({
    url: "/permission/role/" + data.id + "/",
    type: "put",
    data: data,
    json: true
  });
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: "/permission/role/" + data.id + "/",
    type: "put",
    data: data
  });
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  };
  return request({
    url: "/permission/role/changeStatus/",
    type: "put",
    data: data
  });
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: "/permission/role/" + roleId + "/",
    type: "delete"
  });
}

// 导出角色
export function exportRole(query) {
  return request({
    url: "/permission/role/export/",
    type: "get",
    data: query
  });
}
