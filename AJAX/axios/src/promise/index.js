// const  fn = new Fn() //Fn是构造函数,new返回的是实例对象,fn是实例对象的引用
// Fn.prototype //Fn是函数对象
// 点的左边:对象
// ()的左边函数
// 即Fn为函数对象

// res 成功 函数类型的数据 将promise状态改为成功
// rej 失败 函数类型的数据 将promise状态改为失败

// try catch 捕获错误
// throw err 抛出错误

// [[PromiseState]] promise实例对象中的一个属性,表达promise的状态
//pendding=>fulfilled
//pending=>rejected
// 状态只能改变一次

// [[PromiseResult]] promise实例对象中的一个属性,表达promise对象成功或者失败的结果
const p =function(){
    return  new Promise((res, req) => {
        setTimeout(() => {
    res(3)
        }, 1000);
})
}


const p2 = Promise.resolve(123) 
// 如果传入参数为Promise,则promise参数的结果决定了resolve的结果
const p3 = Promise.resolve(new Promise((res, rej) => {
    rej(222)
}))
// p3.then((value) => { //此时因为p3为失败状态，所以要执行cuowu1
//     console.log("then1")
// }, (reason) => { console.log('cuowu1') }) //这个.then加上错误回调返回 cuowu1 2 3 then2
//                                             //不加则返回 2 3 cuowu2  因为如果不加错误回调,
//                                             // 则错误状态下自动加上 rej => throw rej(即返回一个失败的promise)

// .then((res) => { //此时返回then2，即正确,因为p3.then返回的undefined，默认为成功
//                 // 状态看前一个promise返回的状态，而不是一直看第一个promise
//     console.log("then2")
// }, (reason) => { console.log('cuowu2') })
// p3.then((res) => {
//     console.log("then3")
// })
// p3.catch((rej) => {
//     console.log("2")
// })
// p3.catch((rej) => {
//     console.log("3")
// })


const rej1 = Promise.resolve(123)
// resolve无论参数,Promise的结果必定是失败的
// 如果传入参数为Promise,则rej2结果是promise参数对象，rej2的状态必定为失败
const rej2 = Promise.resolve(new Promise((res, rej) => {
    res(222)
}))
// 也可以用throw抛出错误来改变promiseo为失败

// const p4 = new Promise((res, rej) => {
//     res(2)
// }).then((value) => {
//     return new Promise((res, rej) => {
//         setTimeout(() => {
//             res(value)
//         }, 1000);
//     })
// }).then((res) => {
//     console.log(res)
// })

// 返回一个等待状态的promise,即可中断promise链
//  return new Promise(()=>{})


// async函数的返回值为promise对象

async function fn4() {
    const a = await p();
    console.log(`ok${a}`);
    const b = await p();
    console.log(b)
  }
fn4()
  console.log('async ok')
export { p, p2, p3, rej1, rej2 }
