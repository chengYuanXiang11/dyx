import { getDict } from '@/services/api';
import { IOption } from "@/types";
import { useEffect, useState } from "react";


export function useDictAsOption(code: string) {
  const [dictOptions, setDictOptions] = useState<IOption[]>([])
  useEffect(() => {
    getDict(code).then(res => {
      if (res?.success) {
        setDictOptions(res.data.map(item => ({ label: item.title, value: item.dcode })))
      }
    })
  }, [])
  return dictOptions;
}

export function useWindowsSize() {
  const [sizeObj, setSizeObj] = useState({ width: window.innerWidth, height: window.innerHeight })
  const onResize = () => {
    setSizeObj({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  })
  return sizeObj
}