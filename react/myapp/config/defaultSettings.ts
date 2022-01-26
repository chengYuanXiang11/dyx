import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  // 主题,光和暗(白天黑夜主题效果)'light' | 'dark'| 'realDark' | undefined
  navTheme: 'dark',
  // 主色,拂晓蓝(颜色随意)
  primaryColor: '#1890ff',
  // 布局方式(边side|上top|混合mix(需要设置splitMenus: true))
  // 当使用 mix 模式后，点击一级菜单，并不会直接定位到第一个子级菜单页面，而是会呈现空白页面，需要于配置中设置一下 redirect 的地址
  layout: 'mix',
  splitMenus: true,
  //头部主题(优先级比navTheme高)
  headerTheme:'light',
  //头部宽度
  // headerHeight:200,
  // 内容宽度 (流体Fluid|固定Fixed)仅在布局为top时有用,但没发现有啥不同?
  contentWidth: 'Fluid',
  //固定头部?
  fixedHeader: false,
  //固定侧边栏?
  fixSiderbar: true,
  // 全局增加滤镜
  colorWeak: false,
   // 设置标题的 title
  title: 'AntDesign 标题',
  pwa: false,
  // 修改右上角的 logo
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  // 路由菜单要使用图表必须使用该链接
  iconfontUrl: '//at.alicdn.com/t/font_1266539_d2jqk1q16kg.js',
};

export default Settings;
