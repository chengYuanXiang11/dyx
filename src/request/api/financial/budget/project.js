import request from "@/request";
const BUDGETPROJECT = '/finance/budgetproject/'


//获取预算项目信息
export const getBudgets = () => {
    return request({
        url: BUDGETPROJECT,
        type: "get",
    });
};
// 获取所有预算项目信息
export const getBudgetsAll = () => {
    return request({
        url: `${BUDGETPROJECT}?pageNum=all`,
        type: "get",
    });
};
//获取单条预算项目信息
export const getSingleBudgets = (id) => {
    return request({
        url: `${BUDGETPROJECT}${id}`,
        type: "get",
    });
};


//新增预算项目信息
export const addBudgets = (data) => {
    return request({
        url: BUDGETPROJECT,
        type: "post",
        data:data,
        json:true
    });
};

//修改预算项目信息
export const PUTBudgets = (id,data) => {
    return request({
        url:`${BUDGETPROJECT}${id}/`,
        type: "put",
        data:data,
        json:true
    });
};
//删除预算项目信息
export const DeleteBudgets = (id,data) => {
    return request({
        url:`${BUDGETPROJECT}${id}/`,
        type: "delete",
        data:data,
        json:true
    });
};
