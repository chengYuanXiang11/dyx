import request from "@/request";
const URL = ''


export const getList = (data) => {
  return request({
      type: "get",
      url: URL,
      data: data,
  });
};

// 详情
export const getInfo = (id) => {
  return request({
      type: "get",
      url: `${URL}${id}/`,
  })
}
