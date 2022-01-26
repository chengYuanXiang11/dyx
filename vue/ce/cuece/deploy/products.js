/*
 *读取env环境变量
 */
 const SERVER_ID = process.env.NODE_ENV === "prod" ? 0 : 1;

 /*
  *定义多个服务器账号 及 根据 SERVER_ID 导出当前环境服务器账号
  */
 const SERVER_LIST = [
   {
     id: 0,
     name: "A-生产环境",
     domain: "xxx.xxx.xxx", // 域名
     host: "118.31.245.118",
     port: 22,
     username: "root",
     password: "Yrkj1234",
     indexpath: "/var/www/yiqitong/public/theme/index/default/index/",
     assetspath: "/var/www/yiqitong/public/h5-static/"
   },
   {
     id: 1,
     name: "B-测试环境",
     domain: "chengyx.top",
     host: "1.15.110.27",
     port: 22,
     username: "root",
     password: "chengYuanXiang@qq.com",
     indexpath: "/var/www/yiqitong/public/theme/index/default/index/",
     assetspath: "/var/www/yiqitong/public/h5-static/"
   }
 ];
 
 module.exports = SERVER_LIST[SERVER_ID];
