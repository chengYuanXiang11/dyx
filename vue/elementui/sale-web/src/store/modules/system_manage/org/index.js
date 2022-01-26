export default {
    state: {
        //初始化获取的数据列表
        tableListTree: [],
        tableList: [],
        //搜索获取的数据类别
        selectList: [],
        current: 1,  // 分页信息
        size: 20,
        total: 0,
        dialogType: "",
        dialogShow: false,
        dialogForm: {
            address: "",
            comment: "",
            parentId: "",
            status: "",
            name: "",
            type: "",
        },
        // 暂未使用
        // searchForm: {
        //     id: ""
        // },

    },
    getters: {
        getSelectList: (state) => {
            return state.selectList
        },
        getTableList: (state) => {
            return state.tableList
        },
        getDialogForm: (state) => {
            return state.dialogForm

        }
    },
    actions: {
        setTableListTree({ commit }, data) {
            commit("SET_TABLE_LIST", data)
        },
        setSelectList({ commit }, data) {
            commit("SET_SELECT_LIST", data)
        }
    },
    mutations: {
        SET_TABLE_LIST_TREE(state, data) {
            state.tableList = data;
        },
        SET_SELECT_LIST(state, data) {
            state.selectList = data;
        }
    }
}