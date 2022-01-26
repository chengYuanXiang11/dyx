import request from "@/request";

// 上传code
export function getWxTokenApi() {
  return request({
    type: "get",
    // url: `${RECORD_URL}${id}/`,
    data: data,
  });
}
