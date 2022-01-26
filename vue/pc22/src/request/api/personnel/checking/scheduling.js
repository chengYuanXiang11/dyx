import request from "@/request";
const SCHEDULING_URL = '/attendance/scheduling/'

// 获取排班列表
export const getShift= (id) => {
    return request({
        type: "get",
        url: `${SCHEDULING_URL}?attendance=${id}`
    });
};
// 根据考勤组id和时间获取排班列表
/**
 * @param { Number } id     考勤组id
 * @param { yyyy-mm} time   时间(2021-08)
 * @returns
 */
export const getNameShift = (id,time,username) => {
    if(username===""||username ===undefined){
        return request({
        type: "get",
        url: `${SCHEDULING_URL}?attendance=${id}&scheduling_time=${time}`
    });
    }else{
       return request({
        type: "get",
        url: `${SCHEDULING_URL}?attendance=${id}&scheduling_time=${time}&username=${username}`
    });
    }

};

// 新增排班
export const addShift = (data) => {
    return request({
        type: "post",
        url: SCHEDULING_URL,
        data:data,
        json: true
    });
};

//更新排班信息
export const putShift = (data,id) => {
    id=id===-1?'':id
    return request({
        type: "put",
        url: `${SCHEDULING_URL}${id}/`,
        data:data,
        json: true
    });
};


// 删除班次
export const delShift = (id) => {
    return request({
        type: "delete",
        url: `${SHIFT_URL}${id}/`
    });
};

// 删除班次
export const queryDetails = (id) => {
    return request({
        type: "get",
        url: `${SHIFT_URL}${id}/`
    });
};

export const editShift = (data,id) => {
    return request({
        type: "put",
        url: `${SHIFT_URL}${id}/`,
        data:data
    });
};
