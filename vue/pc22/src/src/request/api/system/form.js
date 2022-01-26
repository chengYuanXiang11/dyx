import request from "@/request";
const REQUST_URL = "/work/workflow/";

// 查询表单列表
export function getList() {
    return request({
        url: REQUST_URL,
        type: "get",
        data: {
            pageNum: "all"
        }
    });
}
// 
export function changeStatus(status, name, id) {
    return request({
        url: `${REQUST_URL}${id}/`,
        type: "put",
        data: {
            code_status: status ? 1 : 0,
            code_name: name
        }
    });
}

const FLOW_URL = "/flow/examine/";

// 编辑流程
export function updateFlow(id,data) {
    return request({
        url: `${FLOW_URL + id}/`,
        type: "put",
        data: data
    });
}
// 新增流程
export function addFlow(data) {
    return request({
        url: FLOW_URL,
        type: "post",
        data: data
    });
}
// 流程详情
export function flowDetails(code) {
    return request({
        url: `${FLOW_URL}?code=${code}`,
        type: "get",
    });
}

const FLOW_GROUP_URL = '/flow/examinegroup/'
// 编辑流程
export function getFlowGroup(data) {
    return request({
        url: FLOW_GROUP_URL,
        type: "get",
        data:data
    });
}