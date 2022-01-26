import request from "@/request";
const URL = '/wiot/electricmeterrecord/'

// 按商位
export const getList = (data) => {
  return request({
      type: "get",
      url: URL,
      data: data,
  });
};


export const getListTwo = (data) => {
  return request({
      type: "get",
      url: '/market/lease/',
      data: data,
  });
};

export const getSearchList = (data) => {
  return request({
      type: "get",
      url: '/wiot/electricmeterrecorddetail/',
      data: data,
  });
};

