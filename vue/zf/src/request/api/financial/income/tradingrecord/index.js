import request from "@/request";
const URL = '/dmarket/payorder/'
const URLTP = '/dmarket/recharge/'

//租金，保证金，电费，水费，其他费用，额外费用记录查询
export const getList = (data,id) => {
  return request({
      type: "get",
      url: `${URL}?order_type=${id}`,
			data:data
  });
};
//充值记录,交易费
export const getListTP = (data) => {
  return request({
      type: "get",
      url: URLTP,
			data:data
  });
}