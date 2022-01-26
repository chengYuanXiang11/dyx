#!/usr/bin/env node

// 必须加上此处才会当作node文件去执行

// npm link 添加软链
// bin => node xx.js

const chalk = require("chalk");
const inquirer = require("inquirer");

const { Command } = require("commander"); // include commander in git clone of commander repo
const program = new Command();

// const fss = require("../../fs/fs");
const fs = require("fs");
const path = require("path");

function collect(value, previous) {
  console.log(chalk.blue(value, previous));
  return previous.concat([value]);
}

const collectProt = (value, previous) => {
  console.log(value, previous);
};

function fatal(message) {
  console.error(message);
  process.exit(1);
}

console.log(process.argv)

function mkdir(outputDir, callback) {
  fs.mkdir(outputDir, function (err) {
    if (err) {
      switch (err.code) {
        // 不存在路径
        case "ENOENT":
          return mkdir(path.join(outputDir, ".."), function () {
            mkdir(outputDir, callback);
          });
        // 已存在
        case "EEXIST":
          break;
        default:
          fatal("Cannot create directory " + outputDir + "\n" + err.message);
      }
    }
    callback();
  });
}

// function removedir(outputDir) {
//   fs.rmdir(outputDir, function (err) {
//     if (err) {
//       switch (err.code) {
//         // 不存在路径
//         case "ENOENT":
//           break;
//         // 目录不为空
//         case "ENOTEMPTY":
//           fs.readdir(outputDir, (err, file) => {
//             if (err) throw err;
//             file.forEach((v) => {
//               var newPath = outputDir + "/" + v;
//               fs.stat(newPath, (err, file) => {
//                 if (!err) {
//                   if (file.isDirectory()) {
//                     removedir(newPath);
//                   } else {
//                     fs.unlink(newPath,(err,)=>{
//                       if(!err){
//                         console.log('删除成功')
//                       }
//                     });
//                   }
//                 }
//               });
//             });

//           });
//           setTimeout(()=>{
//             fs.rmdirSync(outputDir)
//           },100)
//           break;
//         default:
//           fatal("Cannot create directory " + outputDir + "\n" + err.message);
//       }
//     }
//   });
//   // removedir(outputDir)
// }

// program
//     .arguments


program
  .version("0.0.1", "-v --version") // 设置版本 node -V -v --version
  .option("-n, --name <numbers...>", "试验name", collect, [])
  .option("-ch, --cheese [flavours...]", "试验")
  .option("-no-ch, --no-cheese", "试验-no")
  .option("-p, --prot [prots...]", "设置端口", collectProt, [80]);

// 创建文件
program
  .command("createMkdit <dir...>")
  .alias("mk")                     // 别名
  // .arguments("<username> <password>")  //快速设置多个参数
  .description("创建文件，不创建子文件")
  .action(function (dir, rmdir) {
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "rmType",
          message: "请选择创建方式...(w:创建在当前,c:删除在指定一级)",
          default: "whole",
          choices: ["whole", new inquirer.Separator(), "current"],
        },
      ])
      .then((answer) => {
        console.log(dir,answer);
        // 用户输入的结果最终会在这里输出
        dir.forEach((v) => {
          // 获取当前执行脚本文件的地址
          v = path.resolve(process.cwd(),v)
          mkdir(v, function () {
            console.log(chalk.blue.reset("创建成功"));
            console.log(chalk.bold.dim("创建成功"));
            console.log(chalk.cyan("创建成功"));
            console.log(chalk.green("创建成功"));
            console.log(chalk.bgRed("创建成功"));
            console.log(chalk.rgb(4, 156, 219).underline("创建成功"));
            console.log(chalk.hex("#049CDB").bold("创建成功"));
            console.log(chalk.bgHex("#049CDB").bold("创建成功"));
          });
        });
      });
  });

// 删除文件
program
  .command("Remake <dir...>")
  .alias("rm")
  .option("-w, --whole", "删除全部")
  .option("-c, --current", "删除当前一级")
  .action(function (dir, options) {
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "rmType",
          message: "请选择删除方式...(w:删除全部,c:删除当前一级)",
          default: "whole",
          choices: ["whole", new inquirer.Separator(), "current"],
        },
      ])
      .then((answer) => {
        // 用户输入的结果最终会在这里输出
        console.log(answer);
      });

    console.log(dir, options.whole, options.current);
    dir.forEach((v) => {
      // fss.removeDirAndFile(v);
    });
  });

// .arguments('<dirs...>')

// 先处理参数才会接收到opts中
// 增加help的提示
program.on("--help", function () {
  console.log("");
  console.log("Examples:");
  console.log("  $ custom-help --help");
  console.log("  $ custom-help -h");
});

console.log(path.resolve(process.cwd()))


program.parse(process.argv);

// const options = program.opts();
// console.log(options);
