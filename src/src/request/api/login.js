import request from "@/request";

// 登录方法
/**
 * 封装请求
 * @param username  用户名
 * @param password  密码
 * @param idValueC  验证码
 * @param idKeyC    验证码key
 */
export function login(username, password, code, uuid) {
	const data = {
		username,
		password,
		idValueC: code,
		idKeyC: uuid
	};
	return request({
		type: "post",
		url: "/login/",
		data: data
	});
}

// 获取用户详细信息
export function getInfo() {
	return request({
		type: "get",
		url: "/getInfo/"
	});
}

// 退出方法
export function logout() {
	return request({
		type: "post",
		url: "/logout/"
	});
}

// 获取验证码
export function getCodeImg() {
	return request({
		type: "get",
		url: "/captcha/refresh/"
	});
}

// 获取短信验证码
export function getSmsCode() {
	return request({
		type: "get",
		url: "/web/system/sendSms/"
	});
}
