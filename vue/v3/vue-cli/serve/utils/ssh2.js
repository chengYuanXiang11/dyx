// const { readFileSync } = require("fs");
// const { Client } = require("ssh2");
// const server = new Client();

// server.on("ready",()=>{
//     console.log('开始链接服务器');
//     server
// })

// 启用node 子进程
const ChildProcess = require("child_process");

// 打包项目 && 将 ./docs/.vitepress/dist 文件夹添加到 assets.tar.gz 压缩包里
let buildProject = ChildProcess.exec(
  // "yarn run build:dev",
  "pwd",{cwd:'./'},

  //   'npm run build:dev',
  (err, stdout, stderr) => {
    if (!err) {
      ChildProcess.exec("node ../app.js",['--version'], (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
      });
    } else {
      console.log("stderr2", stderr);
    }
  }
);

// buildProject.stdout.pipe(process.stdout);
buildProject.on("exit", () => {

});
