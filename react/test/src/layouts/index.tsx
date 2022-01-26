// import type {
//   BasicLayoutProps as ProLayoutProps,
//   MenuDataItem,
//   Settings,
// } from '@ant-design/pro-layout';
// import router from '../../config/routes'
// import ProLayout from '@ant-design/pro-layout';
// import React from 'react';
// import type { Dispatch } from 'umi';
// import { connect, history, Link, useDispatch } from 'umi';

// export type BasicLayoutProps = {
//   breadcrumbNameMap: Record<string, MenuDataItem>;
//   route: ProLayoutProps['route'];
//   settings: Settings;
//   dispatch: Dispatch;
// } & ProLayoutProps;
// export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
//   breadcrumbNameMap: Record<string, MenuDataItem>;
// };



// const loopMenus: (menus: any[], pid?: number) => MenuDataItem[] = (menus, pid) => {
//   return menus
//     // .filter((item) => item.parentId === pid)
//     // .sort((a, b) => a.sortNumber - b.sortNumber)
//     .map((item) => {
//       console.log(item)
//       return ({
//       ...item,
//       key: item.path,
//       // auth: item.code,
//       children:item.routes,
//     })}
//     );
// };


// const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
//   const {
//     children,
//     settings,
//     location = {
//       pathname: '/',
//     },
//   } = props;
//   const dispatch: Dispatch = useDispatch();


//   const handleMenuCollapse = (payload: boolean): void => {
//     dispatch({
//       type: 'global/changeLayoutCollapsed',
//       payload,
//     });
//   };

//   return (
//     <>
//       <ProLayout
//         {...props}
//         {...settings}
//         onCollapse={handleMenuCollapse}
//         onMenuHeaderClick={() => history.push('/')}
//         headerHeight={60}
//         headerRender={() => (
//           <div
//             className="flexBetweenBox"
//             style={{ height: '100%', background: '#fff', boxShadow: '0 1px 4px rgb(0 21 41 / 8%)' }}
//           >
//             <div style={{ flex: 1 }}>
//               {/* <div className="flexCenterBox">
//                 <Button type="primary">
//                   <Link to="/map">地图数据</Link>
//                 </Button>
//               </div> */}
//             </div>
//             <div style={{ width: 140 }}>
//               RightContent
//             </div>
//           </div>
//         )}
//         menuItemRender={loopMenus(router)}
//         itemRender={(route, params, routes) => {
//           const first = routes.indexOf(route) === 0;
//           return first ? (
//             <span>{route.breadcrumbName}</span>
//           ) : (
//             <Link to={route.path}>{route.breadcrumbName}</Link>
//           );
//         }}
//         iconfontUrl="//at.alicdn.com/t/font_2422045_fjwdgx6qdhl.js"
//         // menuDataRender={menuDataRender}
//         rightContentRender={() => (<>RightContent</>)}
//       >
//         {/* <Authorized {...props}>{children}</Authorized> */}
//       </ProLayout>
//       {/* <SettingDrawer
//        settings={settings}
//        onSettingChange={(setting) => {
//          dispatch({
//            type: 'global/changeSetting',
//            payload: setting,
//          });
//        }}
//       /> */}
//     </>
//   );
// };

// // export default connect(({ global }: ConnectState) => ({
// //   collapsed: global.collapsed,
// //   settings: global.settings,
// // }))(BasicLayout);
// export default BasicLayout
import React from "react";
import { connect, history, Link, useDispatch } from 'umi';
import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import defaultProps from "../../config/routes";
import defaultProps2 from "./_defaultProps";
import RightContent from '@/components/RightContent'
// console.log(defaultProps)
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import route from "mock/route";


// console.log(defaultProps2)



export default (props: any) => {
  // const {
  //   route = {
  //     routes: [],
  //   },
  // } = props;
  // const { routes = [] } = route;

  const {
    children,
    route={
      routes: [],
    },
    location = {
      pathname: '',
    }
  } = props;
  const { routes = [] } = route;

  const { breadcrumb } = getMenuData(routes);

  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    // ...props,
  });
  console.log(props)

  return (
    <div
      style={{
        height: "100vh"
      }}
    >
      {/* {title} */}
      {/* <title>{title}</title> */}
      <ProLayout
        {...props}
        // {...settings}
        // {...{route:{path:'/',routes:defaultProps}}}
        menu={
          {
            defaultOpenAll: false,
            // loading:false
          }
        }

        //   breadcrumbRender={(route)=>{
        //   console.log(route)
        //   return 123
        // } }
        breadcrumbProps={
          {
            separator:'>'
          }
        }
        // 面包屑配置
        breadcrumbRender={(route = []) => {

          return[
                {
                  path: '/',
                  breadcrumbName: '主页',
                  separator:">"
                },
                ...route,
              ]
          // return [
          //   {
          //     path: '/',
          //     breadcrumbName: '主页',
          //     separator:">"
          //   },
          //   {
          //   ...breadcrumb[location.pathname],
          //   breadcrumbName:location.pathname // 面包削多个斜杠是因为这里
          // }]

        }}
        // 重写面包屑
        itemRender={(route, params, routes) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <span>{route.breadcrumbName}</span>
          ) : (
            <Link to={route.path}>{route.breadcrumbName}</Link>
          );
        }}
        //  有这个设置才能有跳转功能
        menuItemRender={(item, dom) => {
          if (item.isUrl || item.children) {
            return dom;
          }
          return <Link to={item.path}>{dom}</Link>;
        }}
        subMenuItemRender={(_, dom) => <div>123{dom}</div>}
        // headerHeight={60}
        headerRender={() => {
          if(location.pathname.indexOf('Charts')>0){
            return false
          }
          return(
            <div
            className="flexBetweenBox"
            style={{ height: '100%', display: 'flex', color: '#fff', boxShadow: '0 1px 4px rgb(0 21 41 / 8%)' }}
          >
            <div style={{ flex: 1 }}>
              {/* <div className="flexCenterBox">
                <Button type="primary">
                  <Link to="/map">地图数据</Link>
                </Button>
              </div> */}
            </div>
            <div style={{ width: 140 }}>
              <div>
                <RightContent />

              </div>
            </div>
          </div>
          )
        }
         
        }
        title="Remax"
        logo="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*1NHAQYduQiQAAAAAAAAAAABkARQnAQ"
      // menuHeaderRender={(logo, title) => (
      //   <div
      //     id="customize_menu_header"
      //     onClick={() => {
      //       console.log('2323')
      //       window.open("https://remaxjs.org/");
      //     }}
      //   >
      //     {logo}
      //     {title}
      //   </div>
      // )}
      // location={{
      //   pathname: "/welcome"
      // }}
      >
        {/* <div>{title}</div> */}
        {/* <PageContainer content="欢迎使用"></PageContainer> */}
        {children}
      </ProLayout>
    </div>

  );

};
