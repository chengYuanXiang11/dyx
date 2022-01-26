const koa = require("koa");
const app = new koa();
var cors = require("koa-cors");

app.use(cors());
function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds);
  });
}

app.use(async (ctx, next) => {
  if (ctx.url === "/test") {
    await sleep(1000);
    const n = Math.random();
    // 随机挂掉接口
    if (n > 0.4) {
      ctx.body = n;
    } else {
      ctx.status = 404;
      ctx.body = "";
    }
      next();
  }
});

app.listen(3000, "127.0.0.1", () => console.log("listening on 127.0.0.1:3000"));
