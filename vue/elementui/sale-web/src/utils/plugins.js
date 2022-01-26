import moment from 'moment'
export default {
  // 时间转换
  changeDate(param, type, wk) {
    // alert(new Date(param + ""), type);
    if ((param == null || param < 0) && param !== 0) {
      return ''
    }
    if (new Date(param) == 'Invalid Date') {
      param = param
        .replace(/-/g, '/')
        .replace('T', ' ')
        .replace('.000+0000', '')
    }
    let result = ''

    let year = new Date(param).getFullYear()

    let month = new Date(param).getMonth() + 1
    month = month > 9 ? month : '0' + month
    let day = new Date(param).getDate()
    day = day > 9 ? day : '0' + day

    let hour = new Date(param).getHours()
    hour = hour > 9 ? hour : '0' + hour
    let minute = new Date(param).getMinutes()
    minute = minute > 9 ? minute : '0' + minute
    let second = new Date(param).getSeconds()
    second = second > 9 ? second : '0' + second

    let milliSecond = new Date(param).getMilliseconds()
    milliSecond = milliSecond > 9 ? milliSecond : '00' + milliSecond
    milliSecond =
      Number(milliSecond) < 99 && Number(milliSecond) > 9
        ? '0' + milliSecond
        : milliSecond

    let week = new Date(param).getDay()
    switch (week) {
      case 1:
        week = '星期一'
        break
      case 2:
        week = '星期二'
        break
      case 3:
        week = '星期三'
        break
      case 4:
        week = '星期四'
        break
      case 5:
        week = '星期五'
        break
      case 6:
        week = '星期六'
        break
      case 0:
        week = '星期天'
        break
    }

    switch (type) {
      case 'yymmdd':
        result = year + '/' + month + '/' + day
        break
      case 'yymmddhhmmss':
        result =
          year +
          '/' +
          month +
          '/' +
          day +
          ' ' +
          hour +
          ':' +
          minute +
          ':' +
          second
        break
      case 'yymmddhhmmssSSS':
        result =
          year +
          '/' +
          month +
          '/' +
          day +
          ' ' +
          hour +
          ':' +
          minute +
          ':' +
          second +
          ':' +
          milliSecond
        break
      default:
        break
    }
    if (wk) {
      return result + ' ' + week
    }
    return result
  },
  // 设置以前日期不可选
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7
    }
  },
  // 上传
  uploadApi(axios) {
    return axios.create({
      baseURL: process.env.BASE_URL + '/zuul/',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: sessionStorage.getItem('xcloud-token')
      }
    })
  },
  forbiddenStatus(type) {
    return type ? '启用' : '禁用'
  },
  /**
   *
   * @param {*} button 判断权限的权值
   * @param {*} judgeList 权限列表结合
   */
  isPermission(button, judgeList) {
    var show = false
    var buttonList = JSON.parse(sessionStorage.getItem('buttonList')) || []
    if (buttonList.length == 0) show = true
    for (let item of buttonList) {
      if (item.url == button) {
        show = true
        break
      }
    }
    if (!judgeList || judgeList.length == 0) return show
    for (let item of judgeList) {
      if (!item) continue
      if (!item.includes(button)) {
        return false
      }
    }
    return show
  },
  //判断数组长度为1
  judgeEqualLength(arr) {
    return arr.length == 1 ? true : false
  },
  judgeArrNoEmpty(arr) {
    return arr.length > 0 ? true : false
  },
  // 深拷贝
  deepFullCopy(data) {
    return JSON.parse(JSON.stringify(data))
  },
  //  部分拷贝
  deepPartCopy(originData, data) {
    if (Object.keys(originData).length == 0 || Object.keys(data).length == 0)
      return
    if (Object.keys(originData).length < Object.keys(data).length) {
      for (let item in originData) {
        originData[item] = data[item]
      }
    } else {
      for (let item in data) {
        originData[item] = data[item]
      }
    }
  },
  // 多选/下拉输入框只读转换
  changeMultipleValue(originData, data) {
    if (!originData || !data || originData.length == 0 || data.length == 0)
      return ''
    var obj = {},
      txt = ''
    for (let item of originData) {
      obj[item.dataCode || item.id] =
        item.dataName || item.displayName || item.custContacterAndCustPosition
    }
    for (let item of data) {
      txt += obj[item] + '; '
    }
    return txt != 'undefined; ' ? txt.slice(0, -2) : ''
  },
  changeMultipleValueOther(originData, data) {
    if (!originData || originData.length == 0) return ''
    for (let item of originData) {
      if (item.dataCode != data) continue
      return item.exchangeRate
    }
    return ''
  },
  //获取数组最后一个元素
  getArrayLastItem(arr) {
    if (
      Array.prototype.isPrototypeOf(arr) &&
      Array.isArray(arr) &&
      arr instanceof Array &&
      arr.length > 0
    ) {
      return this.deepFullCopy(arr).pop()
    } else {
      return false
    }
  },
  // 重置对象的值
  resetObjectValue(obj) {
    var valueToNumber0 = ['isDirectConsignment', 'isEmergency', 'isPacked'],
      valueToNumber1 = [],
      valueToNull = ['approveFlow', 'search']
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = []
      } else if (typeof obj[key] == 'boolean') {
        obj[key] = true
      } else if (typeof obj[key] == 'object') {
        this.resetObjectValue(obj[key])
      } else if (valueToNumber0.includes(key)) {
        obj[key] = 0
      } else if (valueToNumber1.includes(key)) {
        obj[key] = 1
      } else if (valueToNull.includes(key)) {
        obj[key] = null
      } else if (key == 'status' && obj[key] == '1') {
        obj[key] = ''
      } else if (key == 'status' && obj[key] == '0') {
        obj[key] = ''
      } else {
        obj[key] = ''
      }
    }
  },
  // 设置筛选输入框
  initAutoCompletetSelect(dom, placeholder, disabled, list, value) {
    // console.log("aaa", dom, placeholder, disabled, list, value)
    if (!dom || list.length == 0) return
    var obj = {}
    for (let item of list) {
      item.value = item.name || item.dataName || item.label || 'ceshi'
      item.label = item.dataCode || item.id || item.value
      // console.log(item.label, value)
      if (item.label == value) obj = item
    }
    dom.originData = { placeholder, disabled, list }
    if (Object.keys(obj).length > 0) dom.selectValue = obj
  },
  //判断表格列或搜索区域单位是否展示
  judgeTrendInfoStatus(data, value, type) {
    if (data.length == 0) return !(type == 'disabled') ? true : false
    for (let item of data) {
      if (item.fieldName == value) {
        if (type == 'disabled') {
          return item.disabled
        }
        return !item.hidden
      }
    }
    return !(type == 'disabled')
  },
  //判断新增也是否可用
  judgeAddTrendInfoStatus(data, value, type) {
    if (data.length == 0) return true
    for (let item of data) {
      if (item.fieldName == value) {
        if (type == 'disabled') {
          return item.disabled
        }
        return !item.hidden
      }
    }
    return type == 'disabled'
  },
  // 行合并单元格
  /**
   * 表格绑定   span-method="mergeSpanMethod"
   * 调用示例：mergeSpanMethod({ row, column, rowIndex, columnIndex }) { return this.plugins.cellMerge(this.tableData, { row, column, rowIndex }, ['name', 'age']); }
   * @param {*} data 元数据
   * @param {*} param  mergeSpanMethod带的参数
   * @param {*} types 需要合并的列的集合
   */
  cellMerge(data, param, types) {
    var obj = {},
      property = param.column.property
    if (types.includes(property)) {
      for (let i = 0; i < data.length; i++) {
        if (Object.keys(obj).includes(data[i][property])) {
          obj[data[i][property]].push(i)
        } else {
          obj[data[i][property]] = [i]
        }
      }
      return {
        rowspan:
          param.rowIndex == obj[param.row[property]][0]
            ? obj[param.row[property]].length
            : 0,
        colspan: 1
      }
    }
  },
  /**
   * 获取合并单元格的行组合，解决悬浮时只高亮第一行的bug
   * @param {*} data 元数据
   * @param {*} row 当前行
   * @param {*} type 和并列的标识
   */
  getCellMergeGroup(data, row, type) {
    var arr = []
    for (let i = 0; i < data.length; i++) {
      if (data[i][type] == row[type]) {
        arr.push(i)
      }
    }
    return arr
  },
  cellTargetDome: '',
  cellTargetClass: '',
  /**
   * 表格操作列单元格相关事件
   * @param {*} _$
   * @param {*} event
   * @param {*} label
   * @param {*} show
   * @param {*} type
   * @param {*} className
   */
  cellEnterOrOut(_$, event, label, show, type, className) {
    return
    if (label == type) {
      switch (show) {
        case 1:
          this.cellTarget = _$(event.target)
            .children()
            .children(className)
          this.cellTargetClass = className
          _$(event.target)
            .children()
            .children(className)
            .addClass('displayShow')
          break
        case 2:
          _$(event.target)
            .children()
            .children(className)
            .removeClass('displayShow')
          break
        case 3:
          _$(this.cellTargetClass).removeClass('displayActive')
          this.cellTarget.addClass('displayActive')
          break
      }
    }
  },

  //判断客户等级
  judgeCustomerLevel(level) {
    switch (level) {
      case '1':
        return '临时客户'
        break
      case '2':
        return '普通客户'
        break
      case '3':
        return '优质客户'
        break
      default:
        return '黑名单客户'
        break
    }
  },
  // 判断客户相关类型
  judgeAboutType(data, type) {
    if (!data || data.length == 0) return type
    for (let item of data) {
      if (item.dataCode == type) {
        return item.dataName
      }
    }
  },
  judgeEnableStatus(status) {
    switch (status) {
      case '0':
        return '禁用'
        break
      case '1':
        return '启用'
        break
      default:
        return '禁用'
        break
    }
  },
  findNameByCode(dropDownList, params) {
    let obj = dropDownList.find(ele => ele.dataCode === params)
    return obj ? obj.dataName : params
  },
  findNameById(dropDownList, params) {
    let obj = dropDownList.find(ele => ele.id === params)
    return obj ? obj.dataName || obj.name : params
  },
  formatTime(time, mode, isHour) {
    if (time === 'undefined' || time === null) {
      return ''
    }
    return moment(time).format(
      `YYYY${mode}MM${mode}DD ${isHour ? `HH:mm:ss` : ``}`
    )
  },
  base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)))
  },
  exportXlt(data, title) {
    let str = '<tr>'
    //拼接表头
    for (let i = 0; i < title.length; i++) {
      str += `<td>${title[i]}</td>`
    }
    str += '</tr>'
    //拼接表体
    for (let i = 0; i < data.length; i++) {
      str += '<tr>'
      for (let item of title) {
        str += `<td>${data[i][item] + '\t'}</td>`
      }
      str += '</tr>'
    }
    // console.log(str)
    let worksheet = 'Sheet1'
    let uri = 'data:application/vnd.ms-excel;base64,'
    //下载的表格模板数据
    let template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>${worksheet}</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook>
            </xml>
          <![endif]-->
        </head>
        <body>
          <table>${str}</table>
        </body>
      </html>`
    // 下载
    this.changeDownloadFile(uri + this.base64(template))
  },
  // 导入excel
  importExcel(file, keys, cb) {
    this.hasReadAsBinaryString()
    // 定义自己需要的返回值
    var resultData = []
    // 定义读取文件对象
    var fileReader = new FileReader()
    fileReader.onload = function(ev) {
      var originData = ev ? ev.target.result : this.content,
        workbook = XLSX.read(originData, {
          type: 'binary'
        }),
        persons = []
      for (var sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          persons = persons.concat(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
          )
        }
      }
      // 转换格式
      for (var i = 0; i < persons.length; i++) {
        var obj = {}
        for (let item in persons[i]) {
          obj[keys[item]] = persons[i][item]
        }
        resultData.push(obj)
      }
      cb(resultData)
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file)
  },
  // 调整导出兼容性
  changeDownloadFile(base64Info) {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      var bstr = atob(base64Info.split(',')[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      var blob = new Blob([u8arr])
      window.navigator.msSaveOrOpenBlob(blob, 'download.xlsx')
    } else {
      let link = document.createElement('a')
      link.href = base64Info
      link.target = '_blank'
      link.download = 'download.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  // 调整导入兼容性
  hasReadAsBinaryString() {
    if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(fileData) {
        var reader = new FileReader()
        var binary = ''
        var pt = this
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          //pt.result  - readonly so assign binary
          pt.content = binary
          $(pt).trigger('onload')
        }
        reader.readAsArrayBuffer(fileData)
      }
    }
  }
}
