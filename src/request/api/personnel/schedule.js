import request from "@/request";
const SCHEDULE_ALL_USER= '/workbench/workbench/'
const SCHEDULE= '/workbench/getschedule/'

// 新建日程
export const addSchedule = (data) => {
    return request({
        type: "post",
        url: SCHEDULE_ALL_USER,
        data: data,
        json: true
    });
};


// 日程列表
export const allScheduleList = (data) => {
    return request({
        type: "get",
        url: SCHEDULE_ALL_USER,
        data: data
    });
};

// 日程列表
export const scheduleList = (data) => {
    return request({
        type: "get",
        url: SCHEDULE,
        data: data
    });
};


// 日程详情
export const scheduleDetails = (id) => {
    return request({
        type: "get",
        url: `${SCHEDULE_ALL_USER}${id}`
    });
};


// 编辑日程
export const scheduleUpdate = (id, data) => {
    return request({
        type: "put",
        url: `${SCHEDULE_ALL_USER}${id}/`,
        data: data,
        json: true
    });
};
