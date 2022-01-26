//后端接口
const express = require("express");
//定义express实例
const app = express();

app.use(require("cors")());
app.use(express.json());

//图片等静态文件需要静态托管
app.use("/", express.static(__dirname + "/public"));

app.listen(3008, () => {
  console.log("http://localhost:3008/");
});
