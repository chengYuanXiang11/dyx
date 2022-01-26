export default {
    state: {
        tableList: [],
        selectList: [],
        dialogType: "add",
        dialogShow: false,
        activeName: "1",  // 激活的tab页
        searchForm: {
            name: ""
        },
        dialogData: {
            id: "",   // (integer, optional): 主键id ,
            orgId: "",
            roleList: [],
            name: "",
            account: "",
            mobile: "",
            password: "",
            passwordNew: "",
            email: "",
            address : ""
        }
    }
}