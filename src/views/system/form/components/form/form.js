const data = {
    leave: {
        name: "请假申请",
        formData: {
            formRef: "elForm",
            formModel: "formData",
            fields: [{
                    label: '请假类型',
                    vModel: "leaveType",
                    tag: 'holiday-types',
                    default: '',
                    placeholder: '请选择请假类型',
                    required: true,
                    conditions: true
                },
                {
                    label: '请假时间',
                    vModel: "leaveTime",
                    tag: 'datetimerange',
                    default: '',
                    placeholder: '请选择请假时间',
                    required: true,
                    conditions: false
                },
                {
                    label: '请假时长',
                    vModel: "leaveDuration",
                    tag: 'input',
                    default: '',
                    placeholder: '',
                    disabled:true,
                    required: true,
                    conditions: true
                },
                {
                    label: '请假事由',
                    vModel: "leaveReason",
                    tag: 'textarea',
                    default: '',
                    placeholder: '请输入请假事由',
                    required: true,
                    conditions: false
                }
            ]
        }
    },
    makeup: {
        name: "补卡申请",
        formData: {
            formRef: "elForm",
            formModel: "formData",
            fields: [{
                    label: '原打卡时间',
                    vModel: "originalPunchTime",
                    tag: 'punchTime-select',
                    default: '',
                    placeholder: '请选择原打卡时间',
                    required: true,
                    conditions: false
                },
                {
                    label: '补卡时间',
                    vModel: "cardTime",
                    tag: 'datetime',
                    default: '',
                    placeholder: '请选择补卡时间',
                    required: true,
                    conditions: false
                },
                {
                    label: '补卡事由',
                    vModel: "cardFor",
                    tag: 'textarea',
                    default: '',
                    placeholder: '请输入请假事由',
                    required: true,
                    conditions: false
                }
            ]
        }
    },
    overtime: {
        name: "加班申请",
        formData: {
            formRef: "elForm",
            formModel: "formData",
            fields: [{
                    label: '加班时间',
                    vModel: "overtime",
                    tag: 'time-duration',
                    default: '',
                    placeholder: '请选择加班时间',
                    required: true,
                    conditions: true
                },
                {
                    label: '发放方式',
                    vModel: "issueType",
                    tag: 'dict-select',
                    dictCode: 'issuingmethod',
                    default: '',
                    placeholder: '请选择发放方式',
                    required: true,
                    conditions: false
                },
                {
                    label: '加班事由',
                    vModel: "overtimeReason",
                    tag: 'textarea',
                    default: '',
                    placeholder: '请输入加班事由',
                    required: true,
                    conditions: false
                }
            ]
        }
    },
    businesstrip: {
        name: "出差申请",
        formData: {
            fields:[{
                type: 'block',
                title: "行程1",
                sub: [{
                        label: '开始时间',
                        type: 'date',
                        default: '',
                        placeholder: '请选择开始时间',
                        required: true
                    },
                    {
                        label: '结束时间',
                        type: 'date',
                        default: '',
                        placeholder: '请选择结束时间',
                        required: true
                    },
                    {
                        label: '出差时长（天）',
                        type: 'input',
                        default: '',
                        placeholder: ''
                    },
                    {
                        label: '出发城市',
                        type: 'select',
                        default: '',
                        placeholder: '请选择出发城市',
                        required: true
                    },
                    {
                        label: '目的城市',
                        type: 'select',
                        default: '',
                        placeholder: '请选择目的城市',
                        required: true
                    },
                    {
                        label: '交通工具',
                        type: 'radio',
                        default: '火车',
                        placeholder: '请选择交通工具',
                        required: true,
                        radioList: ['火车', '飞机', '汽车', '其他']
                    },
                    {
                        label: '单程往返',
                        type: 'radio',
                        default: '单程',
                        placeholder: '请选择单程往返',
                        required: true,
                        radioList: ['单程', '往返']
                    },
                ]
            },
            {
                type: 'button',
                text: '添加',
            }, {
                label: '出差总时长',
                type: 'input',
                default: '',
                placeholder: '',
                required: false
            }, {
                label: '同行人',
                type: 'addUser',
            },
            {
                label: '出差事由',
                type: 'textarea',
                default: '',
                placeholder: '请输入加班事由',
                required: true
            },
        ]
        }
    },
    // goout: {
    //     name: "外出申请",
    //     form: [{
    //             label: '开始时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择开始时间',
    //             required: true
    //         },
    //         {
    //             label: '结束时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择结束时间',
    //             required: true
    //         }, {
    //             label: '外出时长',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: false
    //         },
    //         {
    //             label: '外出事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入加班事由',
    //             required: true
    //         },
    //         {
    //             label: '图片',
    //             type: 'uploadImg'
    //         },
    //     ]
    // },
    // changeshift: {
    //     name: "调班申请",
    //     form: [{
    //             label: '替班人',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择替班人',
    //             required: true
    //         }, {
    //             label: '替班时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择替班时间',
    //             required: true
    //         },
    //         {
    //             label: '还班时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择还班时间',
    //         },
    //         {
    //             label: '调班原因',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入调班原因',
    //             required: true
    //         },
    //     ]
    // },
    // dimission: {
    //     name: "离职申请",
    //     form: [{
    //             label: '最后工作日',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择最后工作日',
    //             required: true
    //         },
    //         {
    //             label: '离职原因',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入离职原因',
    //             required: true
    //         },
    //     ]
    // },
    // budget: {
    //     name: "预算申请",
    //     form: [{
    //             label: '名称',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入名称',
    //             required: true
    //         },
    //         {
    //             label: '申请部门',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择申请部门',
    //             required: true
    //         },
    //         {
    //             label: '申请事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入申请事由',
    //             required: true
    //         }, {
    //             label: '开始时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择开始时间',
    //             required: true
    //         }, {
    //             label: '结束时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择结束时间',
    //             required: true
    //         }, {
    //             type: 'block',
    //             title: "项目1",
    //             sub: [{
    //                     label: '申请项目',
    //                     type: 'select',
    //                     default: '',
    //                     placeholder: '请选择申请项目',
    //                     required: true
    //                 },
    //                 {
    //                     label: '金额（元）',
    //                     type: 'input',
    //                     default: '',
    //                     placeholder: '请输入金额',
    //                     required: true
    //                 },
    //             ]
    //         }, {
    //             type: 'button',
    //             text: '添加',
    //         }, {
    //             label: '总金额',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: true
    //         }, {
    //             label: '附件',
    //             type: 'uploadFile'
    //         }
    //     ]
    // },
    // budgetchange: {
    //     name: "预算调整",
    //     form: [{
    //             label: '申请部门',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择申请部门',
    //             required: true
    //         },
    //         {
    //             label: '申请事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入申请事由',
    //             required: true
    //         }, {
    //             label: '调整明细',
    //             type: 'block-small',
    //             title: "明细1",
    //             required: true,
    //             sub: [{
    //                     label: '调出项',
    //                     type: 'select',
    //                     default: '',
    //                     placeholder: '请选择调出项',
    //                     required: true
    //                 }, {
    //                     label: '调入项',
    //                     type: 'select',
    //                     default: '',
    //                     placeholder: '请选择调入项',
    //                     required: true
    //                 },
    //                 {
    //                     label: '调整金额',
    //                     type: 'input',
    //                     default: '',
    //                     placeholder: '请输入金额',
    //                     required: true
    //                 },
    //             ]
    //         }, {
    //             type: 'button',
    //             text: '添加',
    //         },
    //     ]
    // },
    // petty: {
    //     name: "备用金申请",
    //     form: [{
    //         label: '申请事由',
    //         type: 'textarea',
    //         default: '',
    //         placeholder: '请输入申请事由',
    //         required: true
    //     }, {
    //         label: '申请金额(元)',
    //         type: 'input',
    //         default: '',
    //         placeholder: '请输入申请金额',
    //         required: true
    //     }, {
    //         label: '归还时间',
    //         type: 'select',
    //         default: '',
    //         placeholder: '请选择归还时间',
    //         required: true
    //     }, {
    //         label: '收款人',
    //         type: 'select',
    //         default: '',
    //         placeholder: '请选择收款人',
    //         required: false
    //     }, {
    //         label: '银行账户',
    //         type: 'input',
    //         default: '',
    //         placeholder: '请输入银行账户',
    //         required: false
    //     }]
    // },
    // apply: {
    //     name: "报销申请",
    //     form: [{
    //             label: '报销事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入申请事由',
    //             required: true
    //         }, {
    //             type: 'block',
    //             title: "费用明细",
    //             sub: [{
    //                     label: '报销类型',
    //                     type: 'select',
    //                     default: '',
    //                     placeholder: '请选择报销类型',
    //                     required: true
    //                 }, {
    //                     label: '日期',
    //                     type: 'select',
    //                     default: '',
    //                     placeholder: '请选择日期',
    //                     required: true
    //                 },
    //                 {
    //                     label: '金额（元）',
    //                     type: 'input',
    //                     default: '',
    //                     placeholder: '请输入金额',
    //                     required: true
    //                 },
    //             ]
    //         }, {
    //             type: 'button',
    //             text: '添加',
    //         },
    //         {
    //             label: '总金额（元）',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: false
    //         }, {
    //             label: '附件',
    //             type: 'uploadFile'
    //         },
    //         {
    //             label: '待归还备用金',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: false
    //         },
    //         {
    //             label: '实际报销金额',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: false
    //         },
    //         {
    //             label: '收款人',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择收款人',
    //             required: false
    //         },
    //         {
    //             label: '银行账户',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入银行账户',
    //             required: false
    //         },
    //     ]
    // },
    // pay: {
    //     name: "付款申请",
    //     form: [{
    //             label: '付款类型',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择付款类型',
    //             required: true
    //         },
    //         {
    //             label: '付款事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入申请事由',
    //             required: true
    //         },
    //         {
    //             label: '收款人（单位）',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入收款人',
    //             required: true
    //         },
    //         {
    //             label: '银行账户',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入银行账户',
    //             required: true
    //         },
    //         {
    //             label: '付款金额（元）',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入付款金额',
    //             required: true
    //         },
    //         {
    //             label: '付款日期',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择付款日期',
    //             required: true
    //         }, {
    //             label: '附件',
    //             type: 'uploadFile'
    //         },
    //     ]
    // },
    // fitment: {
    //     name: "装修申请",
    //     form: [{
    //             label: '装修位置',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择装修位置',
    //             required: true
    //         },
    //         {
    //             label: '装修项目(可多选)',
    //             type: 'table',
    //             required: true,
    //             checked: true,
    //             tableHeader: [{
    //                     label: '项目名称',
    //                     prop: 'name'
    //                 },
    //                 {
    //                     label: '规格',
    //                     prop: 'scpe'
    //                 },
    //                 {
    //                     label: '价格（元）',
    //                     prop: 'price'
    //                 },
    //                 {
    //                     label: '是否可退款',
    //                     prop: 'refund'
    //                 },
    //                 {
    //                     label: '备注',
    //                     prop: 'remark'
    //                 }
    //             ],
    //             tableData: [{
    //                 name: '档口围栏',
    //                 scpe: "灰色",
    //                 price: 5000,
    //                 refund: '可退款',
    //                 remark: "备注"
    //             }, {
    //                 name: '店铺招牌',
    //                 scpe: "宽度： 1.2米；  高度： 底边离地6米",
    //                 price: 5000,
    //                 refund: '可退款',
    //                 remark: "备注"
    //             }, {
    //                 name: '冷库增容',
    //                 scpe: "长5米×宽4米×高3米，功率： ≤4KW",
    //                 price: 4100,
    //                 refund: '可退款',
    //                 remark: "备注"
    //             }, {
    //                 name: '冷库顶部板房（防火）',
    //                 scpe: "长5米×宽4米×高2.6米",
    //                 price: 5000,
    //                 refund: '不可退款',
    //                 remark: "备注"
    //             }, {
    //                 name: '收费亭',
    //                 scpe: "长2米×宽3.5米， 总面积≤7㎡，浅灰色",
    //                 price: 5000,
    //                 refund: '不可退款',
    //                 remark: "备注"
    //             }, {
    //                 name: '建设费',
    //                 scpe: "无",
    //                 price: 5000,
    //                 refund: '不可退款',
    //                 remark: "备注"
    //             }, ]
    //         },
    //         {
    //             label: '合计金额',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: false
    //         },
    //         {
    //             label: '开始时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择开始时间',
    //             required: true
    //         },
    //         {
    //             label: '结束时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择结束时间',
    //             required: true
    //         },
    //         {
    //             label: '施工单位名称',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入施工单位名称',
    //         },
    //         {
    //             label: '施工负责人',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入施工负责人',
    //         },
    //         {
    //             label: '电话',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入电话',
    //         },
    //         {
    //             label: '施工人员数量',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入施工人员数量',
    //             slot: "人"
    //         },
    //         {
    //             label: '申请人签名',
    //             type: 'img',
    //             slotText: "签名图片"
    //         },
    //     ]
    // },
    // seal: {
    //     name: "用章申请",
    //     form: [{
    //             label: '用章事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入用章事由',
    //             required: true
    //         }, {
    //             label: '用章方式',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择用章方式',
    //             required: true
    //         },
    //         {
    //             label: '用章时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择付款日期',
    //             required: true
    //         },
    //         {
    //             label: '归还时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择归还日期',
    //             required: true
    //         }, {
    //             label: '用章类型',
    //             type: 'select',
    //             default: '',
    //             placeholder: '请选择用章类型',
    //             required: true
    //         },
    //         {
    //             label: '文件名称',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入文件名称',
    //             required: true
    //         },
    //         {
    //             label: '文件份数',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入文件份数',
    //             required: true
    //         },
    //     ]
    // },
    // rentcar: {
    //     name: "用车申请",
    //     form: [{
    //             label: '用车事由',
    //             type: 'textarea',
    //             default: '',
    //             placeholder: '请输入用车事由',
    //             required: true
    //         },
    //         {
    //             label: '开始时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择开始时间',
    //             required: true
    //         },
    //         {
    //             label: '结束时间',
    //             type: 'date',
    //             default: '',
    //             placeholder: '请选择结束时间',
    //             required: true
    //         }, {
    //             label: '时长',
    //             type: 'input',
    //             default: '',
    //             placeholder: '',
    //             required: true
    //         },
    //         {
    //             label: '目的地',
    //             type: 'input',
    //             default: '',
    //             placeholder: '请输入目的地',
    //             required: true
    //         }, {
    //             type: 'block',
    //             title: "车辆明细(1)",
    //             sub: [{
    //                     label: '车辆类型',
    //                     type: 'select',
    //                     default: '',
    //                     placeholder: '请选择车辆类型',
    //                     required: true
    //                 },
    //                 {
    //                     label: '数量(辆)',
    //                     type: 'input',
    //                     default: '',
    //                     placeholder: '请输入数量',
    //                     required: true
    //                 },
    //                 {
    //                     label: '其他要求',
    //                     type: 'input',
    //                     default: '',
    //                     placeholder: '请输入其他要求',
    //                     required: false
    //                 },
    //             ]
    //         }, {
    //             type: 'button',
    //             text: '增加车辆',
    //         },
    //     ]
    // },
}
export default data
