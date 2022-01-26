const data = {
    businesstrip: [{
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
            disabled: true,
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
export default data
