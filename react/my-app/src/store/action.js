export const setTitle = (data)=>{
    return{
        type:'setTitle',
        data:'data'
    }
}
export const setName = (data)=>{
    return{
        type:'setName',
        data:'data'
    }
}
export const asyncSetTitle = (data,time=1000)=>{
    return (dispatch)=>{
        setTimeout(() => {
            dispatch(setTitle(data))
        }, time);
    }
}
export const asyncSetName = (data,time=1000)=>{
    return (dispatch)=>{
        setTimeout(() => {
            dispatch(setTitle(data))
        }, time);
    }
}