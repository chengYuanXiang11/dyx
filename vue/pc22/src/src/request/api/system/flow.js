import request from "@/request";
const FLOW_URL = "flow/examinegroup/";
// 查询流程列表
export function getFlow() {
    return request({
        url: FLOW_URL,
        type: "get",
    });
}

// // 流程详情
// export function flowDetails(code) {
//     return request({
//         url: `${FLOW_URL}?code=${code}`,
//         type: "get",
//     });
// }
