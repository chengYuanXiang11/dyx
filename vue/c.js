// 梳理表数据
// cardingTableData(){
//                     // 当数据库里没有数据时
//                     if(this.tableData === undefined){
//                         // 没有数据时候
//                             this.tableData=[]
//                                 let shiftsArr = [];
//                                     for (let i = 0; i < 31; i++) {
//                                         shiftsArr.push({
//                                             date: i + 1,
//                                             working_shift_name:"",
//                                             id:"",
//                                             name:''
//                                         });
//                                     }
//                         // 获取用户id
//                         getGroupList(this.$route.params.id).then(res=>{
//                             this.wattendance_user =  res.data.wattendance_user
//                             res.data.wattendance_user.forEach(v=>{
//                                 this.tableData.push({
//                                     "userName":v.user_name,
//                                     "userId":v.user_id,
//                                     "shift":JSON.parse(JSON.stringify(shiftsArr))
//                                 })
//                             })
//                             this.tableData2 = JSON.parse(JSON.stringify(this.tableData))

//                        })
//                         .catch(err=>{
//                             this.tableData.push({
//                                     "userName":undefined,
//                                     "userId":undefined,
//                                     "shift":JSON.parse(JSON.stringify(shiftsArr))
//                                 })
//                          this.tableData2 = JSON.parse(JSON.stringify(this.tableData))
//                                 })

//                     }else{

//                         // 当有数据时
//                     this.tableData.map(v=>{
//                             v.shift=v.shift.map(vArr=>{
//                                 if(vArr.id ===""){
//                                     return vArr
//                                 }else{
//                                     let index=this.scheduling.existingShift.findIndex(value=>{
//                                         return value.id === vArr.id
//                                     })
//                                     return Object.assign(vArr,this.scheduling.existingShift[index])
//                                 }
//                             })
//                         })
//         this.tableData2 = JSON.parse(JSON.stringify(this.tableData))

//                         getGroupList(this.$route.query.id).then(res=>{
//                             this.wattendance_user =  res.data.wattendance_user

//                             }
//                             )

//                     }

// },

// 初始化(对数据)
//   initialization(){
//     let refForm = { }
//       editList(this.$route.query.id,"2021-10").then(res=>{
//         let data = res.data.results[0];
//         this.tableData = data.scheduling_time.userInfo;
//         this.$store.commit("scheduling/setExistingShift", JSON.parse(data.attendance_shift));
//         refForm =JSON.parse(res.data.results[0].period_info)
//     })
//     // 标签数据处理
//         let arr=[];
//       getshiftList().then(res=>{
//             arr=res.data.results.filter(v=>{
//             return this.scheduling.existingShift.includes(v.id)
//          })
//          arr.push({
//                 id: -1,
//                 working_shift_name: "休息",
//                 color: "#d9d9d9",
//                 first_working_time: "休息",
//             })
//         this.$store.commit("scheduling/setExistingShift", arr);
//         this.$store.commit("scheduling/processingData", refForm);
//         this.cardingTableData()

//         })
// },

// 初始化排班表
// const years = 2020,month = 4;
// var dayNum = this.getMonthDays(years, month);
// var dayArr = [];
// for (let i = 0; i < dayNum; i++) {
//      var item = {
//         day: i + 1,
//         week: this.getWeekByDay(years, month, i),
//         };
//     dayArr.push(item);
//     }
// this.headers = dayArr;

// 选择班次打开时时多选选中
// hanlerMultipleTable() {
//     this.tableData.forEach((v) => {
//         if (
//             // dom已存在,并且数据在临时数组或者以在确定数组中存在
//             this.$refs.multipleTable &&
//             (this.scheduling.existingShift.data.findIndex(
//                 (value) => value.id === v.id
//             ) !== -1 ||
//                 this.Shifts.data.findIndex(
//                     (value) => value.id === v.id
//                 ) !== -1)
//         ) {
//             // 解决源码内部多次相同事件会优化合并为同一事件
//             setTimeout(() => {
//                 this.$refs.multipleTable.toggleRowSelection(v, true);
//             }, 0);
//         } else {
//             setTimeout(() => {
//                 this.$refs.multipleTable.toggleRowSelection(v, false);
//             }, 0);
//         }
//     });
//     // this.showMapDrawer = false
// },

let arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
  { id: 11, name: "部门1", pid: 10 },
  { id: 12, name: "部门2", pid: 11 },
  { id: 13, name: "部门3", pid: 11 },
  { id: 14, name: "部门4", pid: 13 },
  { id: 15, name: "部门5", pid: 14 },
  
];
// for (let index = 0; index < 12; index++) {
//   arr =[...arr,...arr]
// }

// 数据转树形
function tree(arr) {
  let trees = [];
  const itemMap = {};
  arr.forEach((v) => {
    const id = v.id;
    const pid = v.pid;
    if (!itemMap[pid]) {
      itemMap[pid] = {
        id: pid,
        children: [],
      };
    }
    if (!itemMap[id]) {
      itemMap[id] = {
        ...v,
        children: [],
      };
    }
    const treeItem = itemMap[id];
    if (itemMap[pid].pid == undefined) {
      trees.push(itemMap[pid]);
    }
    itemMap[pid].children.push(treeItem);
  });

  console.log(trees,itemMap);
}
tree(arr);


// 计算时间重合
let time = ['2021-12-02 17:00','2021-12-10 08:30'];
let timeset = []