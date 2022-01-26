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
const FLOWLINE_URL = "flow/examine/flowline/";

export function getProcess(data) {
    return request({
        url: FLOWLINE_URL,
        type: "post",
        data:data,
        json:true
    });
}

const FOUNDFLOW_URL = "flow/examineinstance/"
// 初始化
export function getStatus() {
    return request({
        url: FOUNDFLOW_URL,
        type: "get"
    });
}
// 获取数据
export function getStatusPage(queryParams) {
    let {pageNum,pageSize,roleName,status}=queryParams
    if(status =='全部'){
        status =''
    }
    return request({
        url: `${FOUNDFLOW_URL}?node_name=${status}&creator__username__icontains=${roleName}&pageNum=${pageNum}&pageSize=${pageSize}`,
        type: "get"
    });
}
// 获取到审批人信息后，创建具体的流程
export function setFoundflow(data) {
    return request({
        url: FOUNDFLOW_URL,
        type: "post",
        data:data,
        json:true
    });
}

//获取在审核中或者拒绝
export function getStatusList(status,name){
    return request({
        url:`${FOUNDFLOW_URL}?node_name=${status}&creator__username__icontains=${name}`,
        type:"get",
    })
}

//获取申请详情(单条申请)
export function getOneTable(examine_id,id){
    return request({
        url:`${FOUNDFLOW_URL}?examine_id=${examine_id}&id=${id}`,
        type:"get",
    })
}
// 根据名词获取记录
export function getNameFlow(name){
    return request({
        url:`${FOUNDFLOW_URL}?creator__username__icontains=${name}`,
        type:"get",
    })
}



// 我的流程-我的申请
const MYINSTANCE = 'flow/examineinstance/myinstance'

export function myGetStatusPage(queryParams) {
    let {pageNum,pageSize}=queryParams
    return request({
        url: `${MYINSTANCE}?pageNum=${pageNum}&pageSize=${pageSize}`,
        type: "get"
    });
}

// 获取申请流程列表
export function getTableList(id,pageNum,pageSize){
    return request({
        url:`${MYINSTANCE}?examine_id=${id}&pageNum=${pageNum}&pageSize=${pageSize}`,
        type:"get",
    })
}

// flow/examineundo/?result=0
const NEEDTOBEURl = "flow/examineundo/";

//获取待办事项
export function needToBe(result,queryParams){
    let {pageNum,pageSize}=queryParams
    return request({
        url:`${NEEDTOBEURl}?result=${result}&pageNum=${pageNum}&pageSize=${pageSize}`,
        type:"get",
    })
}

// 提交代办事项
export function SubmitAgency(id,data){
    return request({
        url:`${NEEDTOBEURl}${id}/`,
        type:"put",
        data:data,
        json:true

    })
}
// 用户获取当前审批流程进行到的位置
const TASKURl="flow/task/listByexamineInst/";

export function listByExamineInst(examineinst_id){
    return request({
        url:TASKURl,
        type:"get",
        data:{"examineinst_id":examineinst_id},
        json:true

    })
}

//我的申请
const MyAPPLICATIONURL = "flow/examinetask";
export function myApplication(queryParams){
    let {pageNum,pageSize}=queryParams
    return request({
        url:`${MyAPPLICATIONURL}&pageNum=${pageNum}&pageSize=${pageSize}`,
        type:"get"

    })
}
// 获取抄送我的
export function copyMe(queryParams){
    let {pageNum,pageSize}=queryParams
    return request({
        url:`${MyAPPLICATIONURL}?node_name=抄送&pageNum=${pageNum}&pageSize=${pageSize}`,
        type:"get"

    })
}
