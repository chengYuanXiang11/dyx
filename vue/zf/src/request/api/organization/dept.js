import request from "@/request";
const DEPT_REQUEST_URL = "/permission/dept/"
// 查询部门列表
export function listDept() {
    return request({
        url: DEPT_REQUEST_URL,
        type: "get",
        data: {
            pageNum: 'all'
        }
    });
}

// 查询部门下拉树结构
export function treeselect() {
    return request({
        url: "/permission/dept/treeselect/",
        type: "get"
    });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
    return request({
        url: "/permission/dept/roleDeptTreeselect/" + roleId + "/?status=1",
        type: "get"
    });
}

// 新增部门
export function addDept(data) {
    return request({
        url: DEPT_REQUEST_URL,
        type: "post",
        data: data
    });
}

// 部门详情
export function deptDetails(id) {
    return request({
        url: DEPT_REQUEST_URL + `${id}/`,
        type: "get",
    });
}

// 修改部门
export function updateDept(data) {
    return request({
        url: DEPT_REQUEST_URL + data.id + "/",
        type: "put",
        data: data
    });
}

// 删除部门
export function delDept(deptId) {
    return request({
        url: DEPT_REQUEST_URL + deptId + "/",
        type: "delete"
    });
}

// 根据名称模糊搜索部门
export function nameSearchDept(data) {
    return request({
        url: DEPT_REQUEST_URL,
        type: "get",
        data:data
    });
}
