const compare = {
    default: 'equal',
    data: [{
        label: "等于",
        value: "equal"
    }, {
        label: "不等于",
        value: "notEqual"
    }, {
        label: "小于",
        value: "lesThan"
    }, {
        label: "小于等于",
        value: "lesThanOrEqual"
    }, {
        label: "大于",
        value: "greaterThan"
    }, {
        label: "大于等于",
        value: "greaterThanOrEqual"
    }]
}

let type = {
    leave: [{
            label: "请假类型",
            value: "leaveType"
        },
        {
            label: "请假时长（天）",
            value: "leaveTime"
        }
    ],
    makeup: [],
    overtime: [{
        label: "加班时长（天）",
        value: "overtimeHours"
    }],
    changeshift: [],
    goout: [{
        label: "外出总时长",
        value: "goOutTime"
    }],
    businesstrip: [{
        label: "出发地",
        value: "origin"
    }, {
        label: "目的地",
        value: "destination"
    }, {
        label: "交通工具",
        value: "vehicle"
    }, {
        label: "出差总时长",
        value: "travelTime"
    }],
    dimission: []
    // {
    //     label: "需求人数"
    //     value: "demandNum"
    // } {
    //     label: "领用数量"
    //     value: "receiveNum"
    // } {
    //     label: "采购数量"
    //     value: "purchaseNum"
    // } {
    //     label: "金额"
    //     value: "price"
    // } {
    //     label: "超出预算金额"
    //     value: "beyondPrice"
    // } {
    //     label: "总金额"
    //     value: "totalPrice"
    // }
}
let type_default_option = {
    label: "发起人",
    value: "initiator"
}
for(let key in type){
    type[key].splice(0,0,type_default_option)
}
export default {
    compare,
    type
}
