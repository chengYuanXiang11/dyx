import axios from 'axios'
export const generteCancelToken=()=>{
    let cancel=null;
    const cancelToken = new axios.CancelToken(c=>{
        cancel=c
    });
    return{
        cancel,
        cancelToken
    }
}
