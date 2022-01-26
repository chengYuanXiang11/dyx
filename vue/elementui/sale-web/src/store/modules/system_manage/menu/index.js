export default {
    state: {
        listRoot: [{id: "0", name: "根节点", children: []}],  //树形根节点
        tableList: [],
        selectList: [],
        dialogType: "add",
        dialogShow: false,
        searchForm: {}, 
        cascader:"",
        dialogData: {
            id: "",   // (integer, optional): 主键id ,
            name: "",   // (string, optional): 角色名称 ,
            parentId: "",   // (string, optional): 说明,
            icon: "",
            menuRoute: "",
            resType: 0,
            url: "",
            serial: "",
        }
    }
}