import request from "@/request";
const URL = '/market/announcement/'

// 获取商户
export const getMerchant = (data) => {
    return request({
        type: "get",
        url: '/market/merchant/',
        data: data
    });
};
// 获取商户(等接口)
// 根据名字搜索商户
export const getSearchMerchant = (name) => {
    return request({
        type: "get",
        url: `/market/merchant?storeName=${name}`
    });
};


// 获取列表
export const getList = (data) => {
    return request({
        type: "get",
        url: URL,
        data: data
    });
};

export const getInfo = (id) => {
    return request({
        type: "get",
        url: `${URL}${id}`
    });
};


export const delRow = (id) => {
    return request({
        type: "delete",
        url: `${URL}${id}/`,
    })
}
export const delMul = (data) => {
  return request({
      type: "delete",
      url: URL,
      data: data
  });
};

export const postList = (data) => {
    return request({
        type: "post",
        url: URL,
        data: data,
        json: true
    });
};
