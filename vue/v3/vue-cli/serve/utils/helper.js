// #!/usr/bin/env node

const inquirer = require("inquirer");
const helper = (value) => {
  return new Promise((resolve, reject) => {
    let data = value.map((v) => {
      return {
        value: v,
      };
    });
    let name = value.map((v) => v.name);
    inquirer.prompt([
      {
        type: "rawlist",
        name: "name",
        message: "请选择要上传的服务器",
        default: "whole",
        choices: name,
      },
    ]).then((answer)=>{
        // console.log(answer,data)
        resolve(data[0])
    })
  });
};

// inquirer
//   .prompt([
//     {
//       type: "rawlist",
//       name: "rmType",
//       message: "请选择要上传的服务器",
//       default: "whole",
//       choices: ["whole", new inquirer.Separator(), "current"],
//     },
//   ])
//   .then((answer) => {
//     // 用户输入的结果最终会在这里输出
//     console.log(answer);
//   });

module.exports = helper;
