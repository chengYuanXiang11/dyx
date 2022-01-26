//  deploy/index.js里面
const scpClient = require("scp2");
const ora = require("ora");
const chalk = require("chalk");
const server = require("./products");
const spinner = ora(
  "正在发布到" +
    (process.env.NODE_ENV === "prod" ? "生产" : "测试") +
    "服务器..."
);

var Client = require("ssh2").Client;

var conn = new Client();
conn
  .on("ready", function() {
    // rm 删除dist文件，n 是换行 换行执行 重启nginx命令 我这里是用docker重启nginx
    conn.exec(
      "rm -rf /var/www/yiqitong/public/theme/index/default/index/index.htmln rm -rf /var/www/yiqitong/public/h5-static",
      function(err, stream) {
        if (err) throw err;
        stream
          .on("close", function(code, signal) {
            // 在执行shell命令后，把开始上传部署项目代码放到这里面
            spinner.start();
            scpClient.scp(
              "dist/index.html",
              {
                host: server.host,
                port: server.port,
                username: server.username,
                password: server.password,
                path: server.indexpath
              },
              function(err) {
                if (err) {
                  console.log(chalk.red("发布失败.n"));
                  throw err;
                } else {
                  scpClient.scp(
                    "dist/h5-static/",
                    {
                      host: server.host,
                      port: server.port,
                      username: server.username,
                      password: server.password,
                      path: server.assetspath
                    },
                    function(err) {
                      spinner.stop();
                      if (err) {
                        console.log(chalk.red("发布失败.n"));
                        throw err;
                      } else {
                        console.log(
                          chalk.green(
                            "Success! 成功发布到" +
                              (process.env.NODE_ENV === "prod"
                                ? "生产"
                                : "测试") +
                              "服务器! n"
                          )
                        );
                      }
                    }
                  );
                }
              }
            );

            conn.end();
          })
          .on("data", function(data) {
            console.log("STDOUT: " + data);
          })
          .stderr.on("data", function(data) {
            console.log("STDERR: " + data);
          });
      }
    );
  })
  .connect({
    host: server.host,
    port: server.port,
    username: server.username,
    password: server.password
  });
