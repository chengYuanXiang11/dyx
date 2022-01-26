import request from "@/request";
// 关联设备
const ASSOCIATED_URL= 'wiot/devicecontact/'


// 获取关联设备列表
export const getList = (data) => {
  return request({
      type: "get",
      url: ASSOCIATED_URL,
      data: data
  });
};


// 修改关联设备
export const putList = (id,data) => {
    return request({
        type: "put",
        url: `${ASSOCIATED_URL}${id}/`,
        data: data
    });
  };
  
//获取全部设备类型
export const getListAll = (data) => {
  return request({
    type: "get",
    url: 'wiot/devicetype/getall/',
    data: data,
  });
};

  