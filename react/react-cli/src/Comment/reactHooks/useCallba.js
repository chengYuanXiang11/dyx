import React, { memo, 
  // useCallback, 
  useContext,useRef,forwardRef,useImperativeHandle } from "react";
import { ThemeContext } from "./index";
// forwardRef有props和ref两个参数
const  useCallba=(props,parentRef)=>{
    const theme = useContext(ThemeContext);
    const inputRef2 = useRef(null);

  //   useContext
  console.log("useCall");
  const a = { name: "a" };
  const SetU = (e) => {
    console.log("SetU2",e.target.value);
    props.SetU({ ...props.E, name: e.target.value });
  };
//   useImperativeHandle(使得父组件操作多个子组件的ref)
useImperativeHandle(parentRef,()=>({
    inputRef2,
        name:'计数器',
        changeText(text){
            console.log('changeText执行')
            inputRef2.current.value = text;
        }
}))
  
  return (
    //  ref={parentRef}
    <div>
      {a.name}
      {theme}
      <input type="text" value={props.U.name} onChange={(e) => SetU(e)} ref={inputRef2} />
    </div>
);
}
//forwardRef(使父组件可以操作子组件ref)
export default  memo(forwardRef(useCallba));


