function multiRequest(urls = [], maxNum, params) {
  const cache = new Map();
  if (!urls.length) {
    throw "不是数组";
  }
  let runing = 0;
  let results = [];
  const len = urls.length;

  return new Promise((resolve, reject) => {
    const next = () => {
      let cacheCfg = cache.get(params);
      let current = runing++;
      if (current >= len) {
        console.log(results);
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !results.includes(false) && resolve(results);
        return;
      }
      if (cacheCfg) {
        results[current] = cacheCfg;
        return next();
      }
      const url = urls[runing];
      url().then((res) => {
        if (res.status == 200) {
          cache.set(params, res);
        }
        results[current] = res;
        if (runing < len) {
          next();
        }
      });
      //   .catch((err) => {
      //     console.log(err);
      //     return;
      //   });
    };
    while (runing < maxNum) {
      next();
    }
  });
}
const a = () => {
  return fetch("http://127.0.0.1:3000/test");
};

multiRequest([a, a, a, a, a, a, a, a, a, a, a, a, a], 5, 2);
