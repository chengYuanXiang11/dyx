import React, { useEffect, useState } from 'react';
// import ajax from './common/Api/index'
// import axios from "axios"
// import * as promises from './promise'
import Hook from './hooks/hook'

import  * as sendS from './common/Api/modules/api' 
// import * as sendS2 from './common/Api/modules/api2'
function App() {
  const [data, changdata] = useState(null);
  // let source = axios.CancelToken.source()
  useEffect(() => {
    const d = 1;
    changdata(d)
    return  () => {
      // sendS.sendSms()
 
    }
  }, [data])
  const todis = async() => {
    // console.log(cacel)
    await sendS.sendSms().then(res => {
      console.log('then:', res)
  }).catch(e => {
    console.log('4324324')   // 不会执行

      console.log('catch:', e)   // 不会执行
  })
  }
  return (
    <div >
           <Hook/>
      <button onClick={() => { todis() }}>点击</button>
    </div>
  );
}

export default App;
