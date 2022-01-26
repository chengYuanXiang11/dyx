// 封装fetch
function abortableFetch(request, opts) {
    const controller = new AbortController();
    const signal = controller.signal;
  
    return {
      abort: () => controller.abort(),
      ready:()=>{
          return fetch(request, { ...opts, signal })
      } 
     
    };
  }

  export default abortableFetch