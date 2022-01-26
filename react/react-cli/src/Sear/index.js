import React, { useState, useCallback } from "react";
import SearchHader from "./SaerchHeader";
import SearchList from "./SaerchLis";
export const TestContext = React.createContext();
export default function Hook() {
  const [condition, changeCondition] = useState(1); //输入框
  const [data, changeData] = useState([]); //数据
  const changeValue = useCallback((code) => {
    changeCondition(code);
  }, []);
  // const changeImg = useCallback((code) => {
  //   changeData(code);
  // }, []);
  const changeImg = (code) => {
    changeData(code);
  };
  console.log("这是hoom组件");
  return (
    <>
      <TestContext.Provider value={data}>
        <a href="http://localhost:3000/" target="_blank" rel="noreferrer">
          点击
        </a>
        <SearchHader
          searchValue={condition}
          changeValue={changeValue}
          changeImg={changeImg}
        ></SearchHader>

        <SearchList searchData={data} changeImg={changeImg} />
      </TestContext.Provider>{" "}
    </>
  );
}
