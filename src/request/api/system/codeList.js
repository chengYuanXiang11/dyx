import request from "@/request";
const REQUST_URL = "/systembasic/codemanage/";
// 查询菜单列表
export function getList() {
    return request({
        url: REQUST_URL,
        type: "get",
    });
}

// 编辑code
export function updateCode(data) {
    return request({
        url: `${REQUST_URL}${data.id}/`,
        type: "put",
        data: data
    });
}
