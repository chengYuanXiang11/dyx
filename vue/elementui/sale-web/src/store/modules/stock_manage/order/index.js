export default {
    state: {
        tableList: [{
            id:0,
            Serial:"",
            name:"棉纱1",
            sendname:"发货机构",
            takename:"",
            unit:"吨",
            comment:"这是一大堆棉纱",
            icon:"https://image.so.com/view?q=%E6%A3%89%E7%BA%B1%E5%9B%BE&listsrc=sobox&listsign=edfed418d9db1fcc2b6d90745a9aa9ed&src=360pic_strong&correct=%E6%A3%89%E7%BA%B1%E5%9B%BE&ancestor=list&cmsid=691322c31775c596b4ff013c5f46acef&cmras=6&cn=0&gn=0&kn=0&crn=0&bxn=0&fsn=60&cuben=0&pornn=0&adstar=0&clw=246#id=853ad00fad2d36a8f50dd0f38af9b73e&currsn=0&ps=55&pc=55",
            price:30,
            Zprice:"",
            itemname:"D区01号",
            locked:0,
            parentId: "dd",
            phone:13717777798,
            number:20000,
            a:true,
            //发货时间
            deliverytime:'2020-09-01',
            consignor:'xxx公司xxx部门xxx人',
            //经过节点
            children:[
                {name:"仓库正在处理中",
                    receipttime:'2020-09-1'
               },
               {name:"已出库",
               receipttime:'2020-09-1'
          },
                {
                    name:'广东省',
                    nodes:'广东路径1公司',
                    receipttime:'2020-09-10'
                },{
                    name:'深圳市',
                    nodes:'深圳路径2公司',
                    receipttime:'2020-09-18'

                },{
                    name:'上海市',
                    nodes:'上海路径3公司',
                    receipttime:'2020-09-25'

                },
                {name:"配送中",
                receipttime:'2020-09-1'
           }, {name:"接收成功",
           nodes:"唐先生",
           receipttime:'2020-09-1'
      },
            ],
            // 预计到货时间
            receipttime:'2020-09-30',
            Consigne:'唐先生'
        },{
            id:1,
            Serial:"",
            name:"棉纱1",
            sendname:"发货机构",
            takename:"",
            unit:"吨",
            comment:"这是一大堆棉纱",
            icon:"https://image.so.com/view?q=%E6%A3%89%E7%BA%B1%E5%9B%BE&listsrc=sobox&listsign=edfed418d9db1fcc2b6d90745a9aa9ed&src=360pic_strong&correct=%E6%A3%89%E7%BA%B1%E5%9B%BE&ancestor=list&cmsid=691322c31775c596b4ff013c5f46acef&cmras=6&cn=0&gn=0&kn=0&crn=0&bxn=0&fsn=60&cuben=0&pornn=0&adstar=0&clw=246#id=853ad00fad2d36a8f50dd0f38af9b73e&currsn=0&ps=55&pc=55",
            price:30,
            Zprice:"",
            itemname:"D区01号",
            Aavailable:19852,
            locked:12574,
            parentId: "dd",
            phone:13717777798,
            number:2000000,
            a:false

        }],
        selectList: [],
        dialogType: "add",
        dialogShow: false,
        searchForm: {}, 
        cascader:"",
        dialogData: {
            id: "",   // (integer, optional): 主键id ,
            name: "",   // (string, optional): 商品名称 ,
            parentId: "",   // (string, optional): 说明,
            icon: "",
            menuRoute: "",
            resType: 0,
            url: "",
            serial: "",
            locked:""
        }
    }
}