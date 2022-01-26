export default {
    state: {
        tableList: [],
        selectList: [],
        dialogType: "add",
        dialogShow: false,
        searchForm: {
            name: ""
        },
        dialogData: {
            id: "",   // (integer, optional): 主键id ,
            name: "",   // (string, optional): 角色名称 ,
            type: 1, // 1:甲方公司 2：经销商
            comment: "",   // (string, optional): 说明 
        }
    }
}