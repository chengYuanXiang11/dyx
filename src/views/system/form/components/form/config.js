const data = {
    businesstrip: [
        {
          "type": "datePicker",
          "field": "businesstripTime",
          "title": "开始时间 :",
          "info": "",
          "props": {
            "type": "datetime",
            "prefixIcon": "el-icon-date",
            "placeholder": "请选择出差时间"
          },
          "_fc_drag_tag": "datePicker",
          "hidden": false,
          "display": true,
          "value": null,
          "validate": [
            {
              "type": "string",
              "trigger": "change",
              "mode": "required",
              "message": "请选择出差时间",
              "required": true
            }
          ],
          "emit": [
            "change"
          ]
        },
        {
          "type": "datePicker",
          "field": "businesstripEndTime",
          "title": "结束时间 :",
          "info": "",
          "props": {
            "type": "datetime",
            "prefixIcon": "el-icon-date",
            "placeholder": "请选择出差结束时间"
          },
          "_fc_drag_tag": "datePicker",
          "hidden": false,
          "display": true,
          "value": null,
          "validate": [
            {
              "type": "string",
              "trigger": "change",
              "mode": "required",
              "message": "请选择出差结束时间",
              "required": true
            }
          ],
          "emit": [
            "change"
          ]
        },
        {
          "type": "input",
          "field": "businesstripDuration",
          "title": "出差时长 :",
          "info": "",
          "value": "",
          "props": {
            "disabled": true,
            "type": "text",
            "placeholder": ""
          },
          "_fc_drag_tag": "input",
          "hidden": false,
          "display": true,
          "validate": [
            {
              "trigger": "change",
              "mode": "required",
              "message": "",
              "required": true,
              "type": "string"
            }
          ],
          "conditions": true
        },
        {
          "type": "Province",
          "field": "businesstripBecity",
          "title": "出发城市 :",
          "info": "",
          "hidden": false,
          "display": true,
          "validate": [
            {
              "trigger": "change",
              "message": "请选择",
              "required": true
            }
          ],
          "options": [],
          "effect": {
            "selectData": "businesstripBecity"
          },
          "conditions": true
        },
        {
          "type": "Province",
          "field": "businesstripDestination",
          "title": "目的城市 :",
          "info": "",
          "hidden": false,
          "display": true,
          "validate": [
            {
              "trigger": "change",
              "message": "请选择",
              "required": true
            }
          ],
          "options": [],
          "effect": {
            "selectData": "businesstripDestination"
          },
          "conditions": true
        },
        {
          "type": "radio",
          "field": "businesstripVehicle",
          "title": "交通工具",
          "info": "",
          "hidden": false,
          "display": true,
          "options": [
            {
              "value": "1",
              "label": "飞机"
            },
            {
              "value": "2",
              "label": "火车"
            },
            {
              "value": "3",
              "label": "汽车"
            },
            {
              "value": "4",
              "label": "其他"
            }
          ],
          "validate": [
            {
              "trigger": "change",
              "message": "不能为空",
              "required": true
            }
          ],
          "conditions": true
        },
        {
          "type": "radio",
          "field": "businesstripRoundtrip",
          "title": "单程/往返",
          "info": "",
          "hidden": false,
          "display": true,
          "options": [
            {
              "value": "1",
              "label": "单程"
            },
            {
              "value": "2",
              "label": "往返"
            }
          ],
          "validate": [
            {
              "trigger": "change",
              "message": "不能为空",
              "required": true
            }
          ],
          "conditions": true
        },
        {
          "type": "input",
          "field": "businesstripReason",
          "title": "出差事由 :",
          "info": "",
          "props": {
            "type": "textarea",
            "readonly": false,
            "placeholder": "请输入内容"
          },
          "_fc_drag_tag": "input",
          "hidden": false,
          "display": true,
          "value": "",
          "validate": [
            {
              "type": "string",
              "trigger": "change",
              "mode": "required",
              "message": "请输入出差事由",
              "required": true
            }
          ]
        }
      ]
}
export default data
