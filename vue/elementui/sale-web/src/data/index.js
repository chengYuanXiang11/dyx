
export const menuList = [
    {id: 1, name: "系统管理", url: "/systemManage", menuRoute: "#", resType: "menu", parentId: -1, children: [
        {id: 2, name: "机构管理", url: "/org", menuRoute: "system_manage/org/index", resType: "menu", parentId: 1, children: []},
        {id: 3, name: "角色管理", url: "/role", menuRoute: "system_manage/role/index", resType: "menu", parentId: 1, children: []},
        {id: 4, name: "用户管理", url: "/user", menuRoute: "system_manage/user/index", resType: "menu", parentId: 1, children: []},
        {id: 5, name: "菜单管理", url: "/menu", menuRoute: "system_manage/menu/index", resType: "menu", parentId: 1, children: []},
        {id: 6, name: "日志管理", url: "/log", menuRoute: "system_manage/log/index", resType: "menu", parentId: 1, children: []},
    ]},
    {id: 101, name: "订单管理", url: "/orderManage", menuRoute: "#", resType: "menu", parentId: -1, children: [
        {id: 102, name: "产品管理", url: "/product", menuRoute: "order_manage/product/index", resType: "menu", parentId: 101, children: []},
        {id: 103, name: "订单管理", url: "/order", menuRoute: "order_manage/order/index", resType: "menu", parentId: 101, children: []},
        {id: 104, name: "合同管理", url: "/agreement", menuRoute: "order_manage/agreement/index", resType: "menu", parentId: 101, children: []}
    ]},
    {id: 201, name: "库存管理", url: "/stackManage", menuRoute: "#", resType: "menu", parentId: -1, children: [
        {id: 202, name: "订单管理", url: "/stockOrder", menuRoute: "stock_manage/order/index", resType: "menu", parentId: 201, children: []},
        {id: 203, name: "库存管理", url: "/stock", menuRoute: "stock_manage/stock/index", resType: "menu", parentId: 201, children: []},
        {id: 204, name: "资金管理", url: "/fund", menuRoute: "stock_manage/fund/index", resType: "menu", parentId: 201, children: []}
    ]}
]