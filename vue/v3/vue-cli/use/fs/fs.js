const fs = require("fs");
const open = () => {
  var fd = fs.openSync("./log.txt", "r+");
  console.log(fd);
};

const dataAsync = async () => {
  // 同步方法
  // const data = await fs.readFileSync('./log.txt')  //此时读取出来的是buffer，二进制数据
  // console.log(data.toString())

  const data = await fs.readFileSync("./log.txt", {
    flag: "r",
    encoding: "utf-8",
  });
  //flag:"r"默认是r,即使读取
  // encoding:指定文件名的返回的字符编码,此时不需要toString  默认值: 'utf8' ?默认值有问题?
  console.log(data);
};

function data(path) {
  return new Promise(
    (res, rej) => {
      fs.readFile(path, { encoding: "utf-8" }, (err, prevent) => {
        if (err) {
          rej(err);
        } else {
          res(prevent);
        }
      });
    }

    //flag:"r"默认是r,即使读取
    // encoding:指定文件名的返回的字符编码,此时不需要toString  默认值: null
  );
}
// 同步方法改成Promise
// const { promisify } = require('util');
// const readFile = promisify(fs.readFile)
// // readFile(__filename).then(data =>{
// //     console.log(prevent.toString())
// // })

// const data = async () => {
//     // 读写
//     //异步方法
//     // 地址,写入数据,回调  node错误优先
//     fs.writeFile('./log.txt', '写入成功', (err, data) => {
//         if (err) { return } else { console.log('创建成功') }
//     })
//     const data  = await readFile(__dirname+'../log.txt')
//     console.log(__dirname)
// }

const wFile = (path, font) => {
  return new Promise((res, rej) => {
    // flag  a插入 w写入(覆盖) r读取
    fs.writeFile(path, font, { flag: "a", encoding: "utf-8" }, function (err) {
      if (err) {
        console.log(err);
      } else {
        res();
      }
    });
  });
};

const ulink = (path) => {
  return new Promise((res, rej) => {
    fs.unlink(path, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
};

// 读文件夹
const Readdirs = (path) => {
  return new Promise((res, rej) => {
    fs.readdir(path, (err, file) => {
      if (err) {
        rej(err);
      } else {
        res(file); //该文件夹下的所有文件(数组形式)
      }
    });
  });
};
// 文件夹(目录)删除 回收站找不到的
// 重试次数,递归删除,重试间隔 node14有效
// {maxRetries :5,recursive:true,retryDelay:1000}

// 设置为 recursive 为 true 会导致行为类似于 Unix 命令 rm -rf：不存在的路径不会引发错误，表示文件的路径会被删除。
// recursive 选项的宽容行为已弃用，未来会抛出 ENOTDIR 和 ENOENT。
const removedir = (path) => {
  return new Promise((res, rej) => {
    fs.rmdir(path, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
};

// 查看是否文件还是文件夹
const sta = (path) => {
  return new Promise((res, rej) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        rej(err);
      } else {
        res(stats);
      }
    });
  });
};
// 文件合并
const merge = async (path) => {
  const file = await Readdirs(path);
  for (let i = 0; i < file.length; i++) {
    const a = await data(path + "/" + file[i]);
    await wFile(path + "/test.txt", a);
  }
};

//写入流
const createWrite = async (path) => {
  return new Promise(() => {
    let ws = fs.createWriteStream(path, { flags: "a", encoding: "utf-8" });
    //监听
    // 写入准备事件
    ws.on("ready", function () {
      console.log("准备完成");
    });
    // 打开
    ws.on("open", function () {
      console.log("打开");
    });

    // 关闭
    ws.on("close", function () {
      console.log("关闭");
    });

    ws.write("111122233", function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("内容写入完成");
      }
    });
    ws.end(function () {
      console.log("写入流关闭");
    });
  });
};

//读取流
const createRead = async (path) => {
  return new Promise(
    () => {
      let rs = fs.createReadStream(path, { flags: "r" });
      //监听
      // 打开
      rs.on("open", function () {
        console.log("打开");
      });
      // 准备事件
      rs.on("ready", function () {
        console.log("准备完成");
      });

      // 数据监听
      rs.on("data", (chunk) => {
        console.log(chunk);
      });
      // 关闭
      rs.on("close", function () {
        console.log("关闭");
      });

      // ws.write('111122233', function (err) {
      //     if (err) { console.log(err) } else {
      //         console.log('内容写入完成')
      //     }
      // })
    }

    // rs.resume() 恢复读取
    // rs.pause()  暂停读取
  );
};

//删除文件夹以及文件夹下的所有文件
const removeDirAndFile = async (path) => {
  try {
    const r = await Readdirs(path);
    console.log(r);
    // 先删除子文件夹下的所有
    for (let i = 0; i < r.length; i++) {
      if ((await sta(path + "/" + r[i])).isFile()) {
        //是文件直接删除
        await ulink(path + "/" + r[i]);
      } else {
        if ((await Readdirs(path + "/" + r[i])).length === 0) {
          await removedir(path + "/" + r[i]);
        } else {
          await removeDirAndFile(path + "/" + r[i]);
        }
      }
    }
    //删除所有子后删除文件夹
    await removedir(path);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  data,
  dataAsync,
  open,
  wFile,
  ulink,
  Readdirs,
  removedir,
  sta,
  merge,
  createWrite,
  createRead,
  removeDirAndFile,
};
