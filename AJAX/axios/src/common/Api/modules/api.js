import ajax from '../index'
//取消未完成的请求
export const sendSms = (url, data) => {
    return ajax({
        method: 'get',
        url: "./manifest.json2",
        data: {
            "name": 'cyx'
        },
    }).then(res=>{ return res.data})
        .catch(rej=>{
            console.log('请求失败')
            return Promise.reject(rej)  // 看这里
        })
    // return new Promise((resolve,reject)=>{
    //     ajax({
    //            method: 'get',
    //                url: "./manifest.json2",
    //                data: {
    //                    "name": 'cyx'
    //                },
    //     }).then(res=>{resolve(res.data)})
    //     .catch(rej=>{
    //         console.log('请求失败')
    //         reject(rej)
    //     })
    // })
}
export const sendSmspost = (url, data) => {
    return ajax({
        method: 'post',
        url: "./manifest.json",
        data: {
            "name": 'cyx'
        }
    })

}