// #!/usr/bin/env node


const inquirer = require("inquirer");
inquirer.prompt([
    {
        type:"input",
        message:"请输入你的姓名：",
        name:"name",
        default:"大傻子"
    },
    {
        type:"number",
        message:"请输入你的年龄:",
        name:"age",
        default:18,
        // validate:(val)=>{
        //     if(val > 10 && val < 120){
        //         return val;
        //     }else{
        //         return "我猜你绝对不是一个正常人类";
        //     }
        // }
    },
    {
        type:"rawlist",
        name:"rmType",
        message:'请选择创建方式...',
        default:"whole",
        choices:["whole", new inquirer.Separator(),"current"]
    },
    {
        type:"checkbox",
        message:"选择一至多种颜色：",
        name:"color",
        choices:[
            "red",
            "blue",
            "green",
            "pink",
            "orange"
        ]
    },
]).then(answer=>{
    // 用户输入的结果最终会在这里输出
    console.log(answer);
});



