import ajax from '../index2'

export const sendSmsbaidu = (url,data)=>{
    return ajax({
        method:'get',
        url:'https://api.wrdan.com/ip'
    })
} 