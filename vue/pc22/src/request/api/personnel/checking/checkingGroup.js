import request from "@/request";
const CHECKING_GROUP_URL = '/attendance/attendancemanagegroup/'

// 获取考勤组列表
export const getList = (data) => {
    return request({
        type: "get",
        url: CHECKING_GROUP_URL,
        data: data
    });
};

// 新增考勤组
export const addCheckingGroup = (data) => {
    return request({
        type: "post",
        url: CHECKING_GROUP_URL,
        data: data,
        json: true
    });
};

// 获取部门或用户是否存在考勤组
export const getuserdept = (data) => {
    return request({
        type: "post",
        url: "/attendance/attendancemanagegroup/getuserdept/",
        data: data,
        json: true
    });
};

// 获取考勤组详情
export const getCheckingGroup = (id) => {
    return request({
        type: "get",
        url: CHECKING_GROUP_URL + id
    });
};

// 编辑考勤组
export const updateCheckingGroup = (id,data) => {
    return request({
        type: "put",
        url: `${CHECKING_GROUP_URL}${id}/`,
        data: data,
        json: true
    });
};

// 删除考勤组
export const removeCheckingGroup = (id) => {
    return request({
        type: "delete",
        url: `${CHECKING_GROUP_URL}${id}/`,
    });
};
