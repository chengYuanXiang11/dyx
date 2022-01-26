import request from "@/request";

// wx
export function getWxTokenApi(data) {
  return request({
    type: "post",
    url: "/system/wx_code_jsapipay",
    data: data,
  });
}
//zfb
export function getZfbTokenApi(data) {
  return request({
    type: "post",
    url: "system/alipay",
    data: data,
  });
}

