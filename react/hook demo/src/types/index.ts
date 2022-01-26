
export interface JsonResult<T = any> {
  code: number;
  success: boolean;
  msg: string;
  data: T
}

export interface IOption {
  label: string;
  value: string;
  [key: string]: any;
}