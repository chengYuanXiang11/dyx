import { Request, Response } from 'express';

type MockData = Record<string, Item[]>

interface Item {
  title: string;
  dcode: string;
}

const mockData: MockData = {
  tags: [
    { title: '前端', dcode: 'front' },
    { title: '后端', dcode: 'backend' }
  ],
  brand: [
    { title: '华为', dcode: 'huiwei' },
    { title: '苹果', dcode: 'apple' },
    { title: '三星', dcode: 'samsung' },
  ]
}

const Result = {
  success(data: any) {
    return {
      code: 0,
      success: true,
      msg: 'OK',
      data
    }
  },
  error(msg: string) {
    return {
      code: -1,
      success: false,
      msg
    }
  }
}


export default {

  '/api/hero': (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const data = [
      { id: 1, name: '疾风剑豪', price: 6300 },
      { id: 2, name: '影流之主', price: 6300 },
      { id: 3, name: '赏金猎人', price: 3150 },
      { id: 4, name: '无极剑圣', price: 450 },
    ]
    setTimeout(() => {
      res.send(Result.success(data))

    }, 1000)
  },

  '/api/dict': (req: Request, res: Response) => {
    const { code } = req.query as { code: string }
    // 数据库查数据...
    if (!code) {
      res.send(Result.error('参数错误'))
    }
    if (Reflect.has(mockData, code)) {
      res.send(Result.success(mockData[code]))
      return
    }
    res.send(Result.success([]))
  }

}