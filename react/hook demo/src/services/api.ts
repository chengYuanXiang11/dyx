import { JsonResult } from '@/types'
import { request } from 'umi'
import { IDict, IHero } from './entity'

export const getDict = (code: string) => {
  return request<JsonResult<IDict[]>>('/api/dict', { params: { code } })
}

export const getHeroList = () => {
  return request<JsonResult<IHero[]>>('/api/hero')
}