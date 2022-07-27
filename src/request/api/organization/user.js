import request from "@/request";
import {
    praseStrEmpty
} from "@/utils/common";
// 查询用户列表
export function listUser(query) {
    return request({
        url: "/permission/user/",
        type: "get",
        data: query
    });
}

// 查询用户详细
export function getUser(userId) {
    return request({
        url: "/permission/user/details/?userId=" + praseStrEmpty(userId),
        type: "get"
    });
}

// 新增用户
export function addUser(data) {
    return request({
        url: "/permission/user/",
        type: "post",
        data: data,
        json: true
    });
}

// 修改用户
export function updateUser(data) {
    return request({
        url: "/permission/user/" + data.id + "/",
        type: "put",
        data: data,
        json: true
    });
}

// 删除用户
export function delUser(userId) {
    return request({
        url: "/permission/user/" + userId + "/",
        type: "delete"
    });
}

// 导出用户
export function exportUser(query) {
    return request({
        url: "/permission/user/export/",
        type: "get",
        data: query
    });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
    const data = {
        userId,
        password
    };
    return request({
        url: "/permission/user/resetPwd/",
        type: "put",
        data: data
    });
}

// 用户状态修改
export function changeUserStatus(userId, status) {
    const data = {
        userId,
        status
    };
    return request({
        url: "/permission/user/changeStatus/",
        type: "put",
        data: data
    });
}

// 查询用户个人信息
export function getUserProfile() {
    return request({
        url: "/permission/user/profile/",
        type: "get"
    });
}

// 修改用户个人信息
export function updateUserProfile(data) {
    return request({
        url: "/permission/user/profile/",
        type: "put",
        data: data
    });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword
    };
    return request({
        url: "/permission/user/profile/updatePwd/",
        type: "put",
        data: data
    });
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: "/permission/user/profile/avatar/",
        type: "put",
        data: data
    });
}

// 下载用户导入模板
export function importTemplate() {
    return request({
        url: "/permission/user/importTemplate/",
        type: "get"
    });
}

// 用户导入
export function importsUser(data) {
    return request({
        url: "/permission/user/importTemplate/",
        type: "post",
        data: data
    });
}