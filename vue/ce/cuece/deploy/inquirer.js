const inquirer = require("inquirer");
inquirer
  .prompt([
    {
      type: "input",
      name: "test",
      message: "1?",
      default: true,
    },
    {
      type: "input",
      name: "test",
      message: "2?",
      default: true,
    },
  ])
  .then((answers) => {
    console.log("结果为:");
    console.log(answers);
  });
