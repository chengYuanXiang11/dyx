import axios from "axios";
import qs from "qs";

// 超时时间
axios.defaults.timeout = 10000;
// 请求域名
axios.defaults.baseURL = "http://mrppcapiuat.yugu8.com/pc";

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] =
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0MSwidXNlcm5hbWUiOiJrYW5namlhbmRvbmdAMTIzIiwic2Vzc2lvbl9pZCI6IjcyNDQ1YmJkLTA2ZTEtNDMzYi04NzNhLWZlYzA0MDcwNWFlZSIsImV4cCI6MTY0MDIyNzM2MCwib3JpZ19pYXQiOjE2NDAxNDA5NjB9.43m7Vr2orcSeB3rGwOrrX7s28fcWKT2AcGOLq3kxAlk"; // 让每个请求携带自定义token 请根据实际情况自行修改
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态

    return res.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 封装请求
 * @param type
 * @param url
 * @param data
 * @returns {Promise}
 */
export default function server({ type: type, url: url, data: data }) {
  let params = data || {};
  let Config = {
    method: type,
    url: url,
    params: type === "get" || type === "delete" ? params : null,
    data: type === "post" || type === "put" ? params : null,
    paramsSerializer: (params) =>
      qs.stringify(params, {
        arrayFormat: "repeat",
      }),
    headers: {},
  };
  if (type == "post" || type == "put") {
    Config.headers["Content-Type"] = "application/json";
  }
  return new Promise((resolve, reject) => {
    axios(Config).then(
      (response) => {
        resolve(response || {});
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function getWxTokenApi() {
  return server({
    type: "get",
    url: "https://api.weixin.qq.com/sns/oauth2/access_token",
    data: data,
  });
}
