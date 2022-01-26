import React from 'react';
import { Button } from 'antd';
import { useRequest } from 'umi';
import { login } from '@/services/ant-design-pro/api';

async function Lgoin(){
   const data = await login({
        username:"admin"
    })
    console.log(data)
    return data
}

const NewComponents: React.FC = () => {
    const { data, run,loading,cancel} = useRequest(Lgoin,{
        manual:true,
        formatResult:x=>x,
        pollingInterval:2000,
        pollingWhenHidden:false
    })
    console.log(data)

    return (
        <div>
            <Button type="primary" onClick={()=>{run()}} loading={loading !== false}>
                Primary
            </Button>
            <Button type="primary" onClick={()=>{cancel()}} >
                停止轮询
            </Button>
        </div>
    )


}


export default NewComponents;
