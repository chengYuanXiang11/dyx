/**
 * 输入框验证选项
 */

 import rooStore from '../store/index'
// 非空验证
var NO_EMPTY_VALIDATE  = ( rule, value, callback ) => {
    // console.log(value)
    if(!value && value !== 0){
    callback(new Error("此处不能为空"));
  }
  else{callback();}
}
var MULTIPLE_VALIDATE = (rule, value, callback) => {
    if (value.length === 0) {
      callback(new Error('此处不能为空'))
    } else {
        callback()
    }
}
var NUMACHARA_VALIDATE = ( rule, value, callback ) => {
  if(!/^[a-zA-Z0-9_-]{20}$/.test(value)){
    callback(new Error("请输入有效信用代码"));
  }else{callback();}
}
// 身份证正则
var IDENTIFICATION_CAR = ( rule, value, callback ) => {
  if(!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)){
    callback(new Error("请输入有效身份证信息"));
  }
  else{callback();}
}
// 必填联系方式验证
var MOBILE_VALIDATE = ( rule, value, callback ) => {
  if(value==110 || value==120 || value==119 || value==114 || value==112 || value ==122){callback();}
  else if((!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0-9])|(18[0,5-9]))\d{8}$/.test(value) && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{4,14}$/.test(value))){
    callback(new Error("请输入有效联系方式"));
  }
  else{callback();}
}
// 非必填必填联系方式验证
var MOBILE_VALIDATE_EMPTY = ( rule, value, callback ) => {
  if(value==110 || value==120 || value==119 || value==114 || value==112 || value ==122){callback();}
  else if((!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0-9])|(18[0,5-9]))\d{8}$/.test(value) && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{4,14}$/.test(value)) && value ){
    callback(new Error("请输入有效联系方式"));
  }
  else{callback();}
}
// 必填邮箱验证
var EMAIL_VALIDATE = ( rule, value, callback ) => {
  if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/.test(value)){
    callback(new Error("请输入有效邮箱"));
  }
  else{callback();}
}
// 非必填邮箱验证
var EMAIL_VALIDATE_EMPTY = ( rule, value, callback ) => {
  if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/.test(value) && value){
    callback(new Error("请输入有效邮箱"));
  }
  else{callback();}
}
// 密码验证
var PSD_VALIDATE = ( rule, value, callback ) => {
  if(!/^[a-zA-Z\d_]{6,12}$/.test(value)){
    callback(new Error("密码的长度为6 ~ 12位数字或字母"));
  }
  else{callback();}
}
var PSD_AGAIN_VALIDATE = ( rule, value, callback ) => {
  if(value !== rooStore.state.userManager.addData.loginPwd){
    callback(new Error("两次输入的密码不一致"));
  }
  else{callback();}
}
var PWD_AGAIN_VALIDATE = ( rule, value, callback ) => {
  if(value !== rooStore.state.Base.pwdData.newPwd){
    callback(new Error("两次输入的密码不一致"));
  }
  else{callback();}
}
// 不带小数点的非负数验证
var NUMBER_VALIDATE_NONNEGATIVE_UDOT = ( rule, value, callback ) => {
  if(value){
    let space = value.toString();
    if(space.indexOf(" ")!=-1){
      callback(new Error("数字中包含了空格"));
    }else if(space.indexOf("-")!=-1){
      callback(new Error("此处只能输入大于或等于0的整数"));
    }else if(!/^[\d]+([\.][\d]+[Ee][+-]?[\d]+)?$/.test(value) && value){
      callback(new Error("此处只能输入大于或等于0的整数"));
    }else{
      callback();
    }
  }
  else{callback();}
}
// 正小数
var NUMBER_VALIDATE_NONNEGATIVE_DOT_PRC = ( rule, value, callback ) => {
  if(value){
    if(isNaN(value)){
      callback(new Error("请输入数字"));
    }else if(Number(value)< 0 || Number(value)>1){
      callback(new Error("请输入0 ~ 1之间的数字"));
    }else{
      callback();
    }
  }else{callback();}
}
// 带小数点的非负数验证
var NUMBER_VALIDATE_NONNEGATIVE_DOT = ( rule, value, callback ) => {
  if(value){
    let space = value.toString();
    if(space.indexOf(" ")!=-1){
      callback(new Error("数字中包含了空格"));
    }else if(space.indexOf("-")!=-1){
      callback(new Error("此处只能输入大于或等于0的数字"));
    }else if(!/^[\d]+([\.][\d]+)?([Ee][+-]?[\d]+)?$/.test(value) && value){
      callback(new Error("此处只能输入大于或等于0的数字"));
    }else{
      callback();
    }
  }
  else{callback();}
}
// 不带小数点的数字验证
var NUMBER_VALIDATE_UDOT = ( rule, value, callback ) => {
  if(value){
    let space = value.toString();
    if(space.indexOf(" ")!=-1){
      callback(new Error("数字中包含了空格"));
    }else if(space.lastIndexOf("-")>0){
      callback(new Error("'-'应位于第一位"));
    }else if(!/^[\+\-]?[\d]+([\.][\d]+[Ee][+-]?[\d]+)?$/.test(value)  && value){
      callback(new Error("此处只能输入整数"));
    }else{
      callback();
    }
  }
  else{callback();}
}
// 带小数点的数字验证
var NUMBER_VALIDATE_DOT = ( rule, value, callback ) => {
  if(value){
    let space = value.toString();
    if(space.indexOf(" ")!=-1){
      callback(new Error("数字中包含了空格"));
    }else if(space.lastIndexOf("-")>0){
      callback(new Error("'-'应位于第一位"));
    }else if(!/^[\d]+([\.][\d]+)?([Ee][+-]?[\d]+)?$/.test(value)  && value){
      callback(new Error("此处只能输入数字"));
    }else{
      callback();
    }
  }
  else{callback();}
}

// 汉字验证
var CHINESE_VALIDATE = ( rule, value, callback ) => {
  if(!/[\u4e00-\u9fa5]/.test(value)){
    callback(new Error("此处只能输入汉字"));
  }
  else{callback();}
}
// 字母数字混合
var USERNAME_VALIDATE = ( rule, value, callback ) => {
  if(!/^[a-zA-Z0-9_-]{2,16}$/.test(value)){
    callback(new Error("请输入数字、字母或下划线组合"));
  }else{callback();}
}
//汉字/字母/数字/字母
var CHINESE_NUMBER_CHAR_VALIDATE = ( rule, value, callback )=>{
  if(!/^[\u4e00-\u9fa5_\-a-zA-Z0-9]+$/.test(value)){
    callback(new Error("请输入汉字、数字、字母或下划线组合"));
  }
  else{callback();}
}
//非法字符验证1
var CHECK1_VALIDATE = ( rule, value, callback ) => {
  if(/[\#\%\&\'\"\,\;\:\=\!\^]+/g.test(value)){
    callback(new Error("您输入的有非法字符"));
  }
  else{callback();}
}
var CHECK2_VALIDATE = ( rule, value, callback ) => {
  if(/\{\}\(\)\<\>\+\-\*\!\%\#]+/g.test(value)){
    callback(new Error("您输入的有非法字符"));
  }
  else{callback();}
}
// 小数点前n后m
var FRONT_POINTER_BRHIND = ( rule, value, callback ) => {
  if(/^([\d]+){0,10}([\.][\d]+){0,5}/g.test(value)){
    callback(new Error("您输入的有非法字符"));
  }
  else{callback();}
}



// 其他
var EFFICIENCY_MIN =  ( rule, value, callback ) => {
  if(Number(value)>Number(rooStore.state.boilerModel.addData.maxEfficiency) && rooStore.state.boilerModel.addData.maxEfficiency){
    callback(new Error("最小设计功率应小于或等于最大设计功率"));
  }
  else{callback();}
}
var EFFICIENCY_MAX =  ( rule, value, callback ) => {
  if(Number(value)<Number(rooStore.state.boilerModel.addData.minEfficiency) && rooStore.state.boilerModel.addData.minEfficiency){
    callback(new Error("最大设计功率应大于或等于最小设计功率"));
  }
  else{callback();}
}
var VAP_MIN =  ( rule, value, callback ) => {
  if(Number(value)>Number(rooStore.state.boilerModel.addData.maxVap) && rooStore.state.boilerModel.addData.maxVap){
    callback(new Error("最小蒸发量应小于或等于最大蒸发量"));
  }
  else{callback();}
}
var VAP_MAX =  ( rule, value, callback ) => {
  if(Number(value)<Number(rooStore.state.boilerModel.addData.minVap) && rooStore.state.boilerModel.addData.minVap){
    callback(new Error("最大蒸发量应大于或等于最小蒸发量"));
  }
  else{callback();}
}

var SET_MIN = ( rule, value, callback ) => {
  if(Number(value)>Number(rooStore.state.setManager.addData.maxNum) && rooStore.state.setManager.addData.maxNum){
    callback(new Error("下限阈值应小于或等于上限阈值"));
  }
  else{callback();}
}
var SET_MAX = ( rule, value, callback ) => {
  if(Number(value)<Number(rooStore.state.setManager.addData.minNum) && rooStore.state.setManager.addData.minNum){
    callback(new Error("下限阈值应小于或等于上限阈值"));
  }
  else{callback();}
}

/**
 * 输入框验证
 */
export default {
  ROLE_RULE:{
    name: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],   
    type : [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }]
  },
  USER_ROLE: {
    orgId: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    roleList: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    name: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    account: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }]
  },
  MATERIAL_RULE: {
    mateCategory: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    type: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    mateBrand: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }]
  },
  SUPPLIERMANAGER_RULE:{
    sn: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    position: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    name: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    sn: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    type : [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    level: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    email: [{ trigger: 'blur', validator: EMAIL_VALIDATE_EMPTY}]
  },
  purchaseSupplierInquiry:{
    supId: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    supContacter: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
  },
  MENUMANAGER_RULE:{
    parentId: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    name: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    serial: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    resType: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    menuRoute: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    url: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    // icon: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
  },
  LOGIN_RULE: { //登录页验证
    userName:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    password:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }]
  },
  // 客户询价单
  CUST_INQUIRY_ORDER:{
    priority:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    currency:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    expiredDate: [{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    expQuoteDate:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    expPurchaseDate:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    transMode:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    tradeTerms:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    tradeTermsPlace:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
    paymentTerms:[{ required: true, trigger: 'change', validator: NO_EMPTY_VALIDATE }],
    status:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }]
  },
  // email
  EMAIL_TEMPALTE:{
    name:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
  },
  // message
  MESSAGE_TEMPALTE:{
    name:[{ required: true, trigger: 'blur', validator: NO_EMPTY_VALIDATE }],
  },
  // 小数点校验
  DOT_RULE: [{ message: '小数点前10位后5位', trigger: 'blur', pattern:/^\d{0,10}(\.\d{1,5})?$/}]
}
