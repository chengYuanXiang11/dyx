let unique = (() => {
    let unique = 1;
    return () => `unique_${unique++}`
  })()

const  rulef = [
    {
        type: "input",
        field: unique(),
        title: "简介 (自定义!只能填写 a-z",
        validate: [
            {
                validator: (rule, val, d) => {
                    console.log(this)
                    val && !/^[a-z]+$/.test(val) ? d(true) : d();
                },
                message: "只能填写 a-z",
            },
        ],
    },
    {
        type: "input",
        field: unique(),
        title: "商品名称 (必填!3-8个字)",
        validate: [
            { required: true, type: "string", message: "必填" },
            { type: "string", min: 3, message: "最少3个字" },
            { type: "string", max: 8, message: "最多8个字" },
        ],
    },
    {
        type: "input",
        field: unique(),
        title: "关键字 (非必填!必须填4个字",
        validate: [
            { type: "string", len: 4, message: "必须填4个字" },
        ],
    },
    {
        type: "datepicker",
        field: unique(),
        title: "添加时间",
        validate: [
            {
                required: true,
                type: "date",
                message: "请选择添加时间",
            },
        ],
    },
    {
        type: "datepicker",
        field: unique(),
        title: "时间区间",
        props: {
            type: "datetimerange",
        },
        validate: [
            {
                required: true,
                type: "array",
                len: 2,
                message: "请选择添加时间",
                fields: {
                    0: { type: "date", message: "请选择起始日期" },
                    1: { type: "date", message: "请选择结束日期" },
                },
            },
        ],
    },
]
export default rulef
