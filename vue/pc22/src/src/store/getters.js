const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    form_fields: state => {
        let default_conditions = [{
            conditions: true,
            value: "",
            title: "发起人",
            type: "select-initiator",
            field: "initiator",
        }]
        let arr = state.flow.form_fields.concat(default_conditions);
        return arr.filter(item => {
            if (item.conditions) {
                return item;
            }
        })
    },
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    unread_msg_count: state => state.user.unread_msg_count,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
    permission_routes: state => state.permission.routes,
    sidebarRouters: state => state.permission.sidebarRouters,
    ruleForm:state => state.scheduling.ruleForm,
    existingShift:state => state.scheduling.existingShift,
    color:state => state.scheduling.color
};
export default getters;
