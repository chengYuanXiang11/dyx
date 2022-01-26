import React, { Fragment, useState, useMemo, memo, useCallback, useEffect, useLayoutEffect, useRef, createRef, forwardRef, useImperativeHandle } from 'react'
// 产品名称列表
import './index.css'

const nameList = ['apple', 'peer', 'banana', 'lemon']
const Example = (props) => {
    // 产品名称、价格
    const [price, setPrice] = useState(0)
    const [name, setName] = useState('apple');
    const refPrice = useRef(null)
    const [values, setValues] = useState({
        name: 'values', age: 'afaf', chlredn: {
            name: 'fwf'
        }
    }) //这是不会触发子更新，只有直接const才会
    const value24356 = useMemo(() => ({ name }), [name])
    const chilrdRef = useRef()
    // 假设有一个业务函数  获取产品的名字
    // function getProductName() {
    //     console.log('getProductName触发')
    //     return name
    // }
    // 缓存数据
    let opacitys = useRef(false);
    // console.log('opacitys1',opacitys.current)
    // opacitys.current = !opacitys.current
    // console.log('opacitys2',opacitys.current)

    useLayoutEffect(() => {
        console.log('useLayoutEffect', price);
        return () => {
        };
    }, []);
    useEffect(() => {
        console.log('price', price)
        return {

        }
    }, [])
    console.log('父更新')
    const getProductName = useMemo(
        () => {
            console.log('price2', price)

            // setPrice(price+1)
            setPrice((price) => { console.log(price); return price + 1 })
            console.log('getProductName触发')
            return () => name
        },
        [name]
    )
    const getProductName24 = useCallback(
        () => {
            console.log('24')
            console.log(chilrdRef)

            return '()=>name'
        }, [])

    // const names = useMemo(()=>values,[values])
    return (
        <Fragment>
            <div ref={refPrice} className="show" onClick={() => { opacitys.current = !opacitys.current }}>{name}</div>
            <p>{price}</p>
            <p>{getProductName()}</p>
            <button onClick={() => setPrice(price + 1)}>价钱+1</button>
            <Chi ref={chilrdRef} name={name} getProductName24={getProductName24} info={value24356}></Chi>

            <button onClick={() => setName(nameList[Math.random() * nameList.length << 0])}>修改名字</button>
        </Fragment>
    )
}

const Chi = memo(forwardRef((props, ref) => {
    console.log('子组件更新')
    const [from, setFrom] = useState([0, 2, 3])
    // 暴露组件的方法
    useImperativeHandle(ref, () => ({
        getForm: () => {
            return 'form'
        }
    }))
    const AudioDesNode=()=>{
        const arr = [...from];
        arr.splice(1,0,'1')
        console.group(arr);
        setFrom(arr)
    }
    return (
        <>
            <div ref={ref} onClick={() => { props.getProductName24(); }}>getProductName24</div>
            chil___
            <div>
            {/* 为何不使用index作为key的解释 */}
                 {
                from.map((v) => (
                        <div key={v}>
                            <hr />
                            <input type="checkbox" />
                            <span>{v}</span>
                        </div>
                ))
            }
            </div>
           
            {props.name}
            {props.info.name}
            <button onClick={() => {AudioDesNode() }}>24242423532</button>
        </>
    )
}))

export default Example