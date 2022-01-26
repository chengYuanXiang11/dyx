const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  sidebarRouters: state => state.permission.sidebarRouters,
  errorLogs: state => state.errorLog.logs,
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
}
export default getters
