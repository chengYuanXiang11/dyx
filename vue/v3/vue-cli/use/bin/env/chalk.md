# Commander

## option

### no-x 参数(有 xx 时)

1. 不使用 cheese 时,cheese 为 true,无论是否有 no-cheese

```
  .option("-n, --name <number>", "试验name", "名字1")
  .option("--cheese <flavour>", "试验")
  .option("--no-cheese", "试验-no");

  c --name 23 ===> { version: '0.0.1', name: '23', cheese: true }


```

```
  .option("-n, --name <number>", "试验name", "名字1")
  .option("--cheese <flavour>", "试验")

  c --name 23 ===> { version: '0.0.1', name: '23', cheese: true }

```

2. 使用 cheese 时,看 no-cheee 和 cheese 谁在后面

```
  ** no-cheese在后面 **
  .option("-n, --name <number>", "试验name", "名字1")
  .option("--cheese <flavour>", "试验")
  .option("--no-cheese", "试验-no");

  c --no-cheese ===> { version: '0.0.1', name: '名字1', cheese: false }
```

```
   ** no-cheese在前面 **
   .option("-n, --name <number>", "试验name", "名字1")
   .option("--no-cheese", "试验-no");
   .option("--cheese <flavour>", "试验")

   c --no-cheese ===> { version: '0.0.1', name: '名字1', cheese: true }
```

### no-x 参数(只有 no-xx 时)

```
  .option("-n, --name <number>", "试验name", "名字1")
  .option("--no-cheese", "试验-no");
```

- 不使用 --no-cheese 时,cheese 为 true

```
  c --name 23 ===> { version: '0.0.1', name: '23', cheese: true }
```

- 使用 --no-cheese 时,cheese 为 false

```
  c --no-cheese ===> { version: '0.0.1', name: '名字1', cheese: false }
```

## command

```
// 创建文件

program
.command("createMkdit <dir...>")
.alias("mk")
.description('创建文件，不创建子文件')
.action(function (dir, rmdir) {
  dir.forEach((v) => {
    mkdir(v, function () {
      console.log("创建成功");
    });
  });
});

// 删除文件
program
  .command("Remake <dir...>")
  .alias("rm")
  .option("-w, --whole", "删除全部")
  .option("-c, --current", "删除当前一级")
  .action(function (dir,options) {
    console.log(dir,options.whole,options.current)
    dir.forEach((v) => {
    // fss.removeDirAndFile(v);
    });
  });


```
