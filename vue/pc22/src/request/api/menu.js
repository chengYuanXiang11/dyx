import request from "@/request";

// 获取路由
export const getRouters = () => {
	return request({
		type: "get",
		url: "/getRouters/"
	});
};
