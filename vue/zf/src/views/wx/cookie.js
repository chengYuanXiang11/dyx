import cookies from "js-cookie";
// 0未授权未授权1授权未授权2 授权成功

export function loadLoginStatus(name) {
  return cookies.get(name) || 0;
}
// 保持授权状态
export function saveLoginStatus(name, status) {
  return cookies.set(name, status, { expires: 30 });
}
// 删除授权状态
export function removeLoginStatus(name) {
  return cookies.remove(name);
}
