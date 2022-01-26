import React, { useContext } from 'react'
import SearchImg from './SearchImg'
import { TestContext } from './index'
export default function SaerchLis(props) {
    const data = useContext(TestContext)
    if (Array.isArray(data) && data.length === 0) {
        return (
            <>未发起请求</>)
    }
    if (!Array.isArray(data)) {
        return (
            <>{data}</>)
    }
    else {
        return (
            <>

                {
                    data.map((value) => {
                        return <SearchImg data={value} key={value.id} />
                    })
                }

            </>
        )
    }

}
