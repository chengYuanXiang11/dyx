import request from "@/request";
const OFFICE_ADDRESS_URL = '/market/repairmanage/'

// 获取报修管理列表
export const getList = (data) => {
    return request({
        type: "get",
        url: OFFICE_ADDRESS_URL,
        data:data
    });
};

// 获取单条列表信息
export const getInfo = (id) => {
  return request({
      type: "get",
      url: `${OFFICE_ADDRESS_URL}${id}/`,
  });
};

// 安排人员 ,  点击完成后修改维修信息数据
export const arrangePersonnel = (data,id) => {
  return request({
      type: "put",
      url: `${OFFICE_ADDRESS_URL}${id}/`,
      data: data
  });
};
