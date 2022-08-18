#!/usr/bin/env zx

// const username = await question('What is your GitHub username? ')
// const token = await question('Do you have GitHub token in env? ', {
//   choices: Object.keys(process.env),
// })
// // xiaobailaile1
// let headers = {}
// if (process.env[token]) {
//   headers = {
//     Authorization: `token ${process.env[token]}`,
//   }
// }
// let res = await fetch(
//   `https://api.github.com/users/${username}/repos?per_page=1000`,
//   { headers }
// )
// const data = await res.json()
// const urls = data.map((x) =>
//   x.git_url.replace('git://github.com/', 'git@github.com:')
// )
// // git@gitee.com:a151125/da-yx.git
// await $`mkdir backups`
// cd('./backups')
// console.log(urls)

// for (const url of urls) {
//     console.log(urls)
//     console.log('----------------')

// //   await $`git clone ${url}`
//   await $`git clone ${url}`

// }

// // git@github.com:xiaobailaile1/ashangguigu.git
// await $`git clone https://gitee.com/a151125/da-yx.git`
// await $`git status`
// await $`git pull`
await $`git add .`
await $`git commit -m '测试ZX'`
await $`git push`




