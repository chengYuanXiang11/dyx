// 排班管理
const scheduling = {
    namespaced: true,
    state: {
        // 考勤班次数据
        existingShift: {
            data:[
                {
                    id: -1,
                    working_shift_name: "休息",
                    color: "#d9d9d9",
                    first_working_time: "休息",
                    new: true,
                }
            ],
            //只展示我的班次
            self:false
        },
        // 全部考勤班次
        existingShiftAll: [], // 排班周期数据
        ruleForm: {
            name: "",
            Days: 3,
            cycle: [],
        },
        // 颜色列表
        color: [
            "#6691F7",
            "#EA6D74",
            "#F19851",
            "#7A6ECD",
            "#56B887",
            "#DA5BAA",
            "#4467BD",
        ],
    },

    getters: {},
    mutations: {
        // 修改考勤班次(数据)
        setExistingShift(state, payload) {
            state.existingShift.data = payload;
        },
        setExistingShift(state, payload) {
            state.existingShift.data = payload;
        },
        // 修改考勤班次(all)
        setExistingShiftAll(state, payload) {
            state.existingShiftAll = payload;
        },
        // 修改排班周期
        setRuleForm(state, payload) {
            state.ruleForm = payload;
        },
        // 处理refForm数据
        processingData(state, payload) {
            payload.period_shift = payload.period_shift.map((v) => {
                let index = state.existingShift.data.findIndex((value) => {
                    return value.id === v;
                });
                return Object.assign({}, state.existingShift.data[index]);
            });
            payload = {
                name: payload.period_name,
                Days: payload.period_num,
                cycle: payload.period_shift,
            };
            state.ruleForm = payload;
        },
    }
};
export default scheduling;
