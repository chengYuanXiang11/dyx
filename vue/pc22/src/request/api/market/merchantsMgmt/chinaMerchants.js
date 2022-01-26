import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/investmanage/'

const USER_LIST = '/permission/user/' //新建中获取招商经理数据
export const getUserList = (data) => {
  return request({
      type: "get",
      url: USER_LIST,
      data:data
  });
};

// 获取招商管理列表
export const getList = (data) => {
    return request({
        type: "get",
        url: OFFICE_ADDRESS_URL,
        data:data
    });
};

// 获取招商管理详情
export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};

// 新增招商管理客户
export const addOfficeAddress = (data) => {
    return request({
        type: "post",
        url: OFFICE_ADDRESS_URL,
        data: data,
        json:true
    });
};

// 编辑招商管理客户
export const updateOfficeAddress = (data,id) => {
    return request({
        type: "put",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
        data: data,
        json:true
    });
};

// 删除招商管理客户
export const delOfficeAddress = (id) => {
    return request({
        type: "delete",
        url: `${OFFICE_ADDRESS_URL}${id}/`,
    });
};
