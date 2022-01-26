import ajax from '../util/ajax'

export const shuJu=(data: Record<string | number | symbol, any>)=>{
    return ajax({
        url:'/api/get',
        method:'get',
        data
    })
}