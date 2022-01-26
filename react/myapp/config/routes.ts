import access from "@/access";

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        access: 'canAdmin',
        component: './Welcome',
      },
      {
        path: '/admin/sub-2',
        name: 'sub-page2',
        icon: 'smile',
        access: 'canAdmin',
        component: './NewComponents',
        // parentKeys: ['/admin/sub-page'],同时高亮菜单1
      }
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    access:'canUser',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];