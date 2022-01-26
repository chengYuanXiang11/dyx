// export default [
//   {
//     path: '/user',
//     layout: false,
//     routes: [
//       {
//         path: '/user',
//         routes: [
//           {
//             name: 'login',
//             path: '/user/login',
//             component: './user/Login',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: '/welcome',
//     name: 'welcome',
//     icon: 'smile',
//     component: './Welcome',
//   },
//   {
//     path: '/admin',
//     name: 'admin',
//     icon: 'crown',
//     access: 'canAdmin',
//     component: './Admin',
//     routes: [
//       {
//         path: '/admin/sub-page',
//         name: 'sub-page',
//         icon: 'smile',
//         component: './Welcome',
//       },
//     ],
//   },
//   {
//     name: 'list.table-list',
//     icon: 'table',
//     path: '/list',
//     component: './TableList',
//   },
//   {
//     name: 'charts',
//     icon: 'AreaChart',
//     path: '/charts',
//     component: './Charts',
//   },
//   {
//     path: '/',
//     redirect: '/welcome',
//   },
//   {
//     component: './404',
//   },
// ];
export default [
  // {
    // path: '/',
    // name: '首页',
    // // redirect: '/layouts/index',
    // component: '@/layouts/BlankLayout',
    // routes: [
      {
        path: '/',
        name: 'Index',
        // icon: 'smile',
        component: '@/layouts/index',
        routes: [
            {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/Charts',
            name: 'Charts',
            headerRender: false,
            icon: 'smile',
            component: './Charts',
            // routes:[
            //   {
            //     path: '/welcome',
            //     name: 'welcome2',
            //     // icon: 'smile',
            //     component: './Welcome',
            //   },
            // ]
          },
          {
            path: '/form',
            name: 'Form',
            icon: 'smile',
            component: './Form',
          },
        ]
      },


  // },
  {
    component: './404',
  },
];
















// export default [
//   {
//     path:'/',
//     component:'@/layouts/index',
//     routes:[
//       {
//         path: '/user',
//         layout: false,
//         routes: [
//           {
//             path: '/user',
//             routes: [
//               {
//                 name: 'login',
//                 path: '/user/login',
//                 component: './user/Login',
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/welcome',
//         name: 'welcome',
//         icon: 'smile',
//         component: './Welcome',
//       },
//       {
//         path: '/admin',
//         name: 'admin',
//         icon: 'crown',
//         access: 'canAdmin',
//         component: './Admin',
//         routes: [
//           {
//             path: '/admin/sub-page',
//             name: 'sub-page',
//             icon: 'smile',
//             component: './Welcome',
//           },
//         ],
//       },
//       {
//         name: 'list.table-list',
//         icon: 'table',
//         path: '/list',
//         component: './TableList',
//       },
//       {
//         component: './404',
//       },
//     ]
//   }
// ];
