// // 发布订阅

// 订阅者
class Subscribe {
  // 需求列表
  constructor(name) {
    this.name = name;
  }
  // 加需求
  addTask(name, task) {
    if (this.task[name]) {
      console.log("已经接过该任务了了");
      return false;
    }
    this.task[name] = task;
  }
  // 完成需求
  delTask(name) {
    if (this.task[name]) {
      Reflect.deleteProperty(this.task, name);
      console.log("完成任务了");
    } else {
      console.log("没这个任务");
    }
  }
}



// 配送中心
class Bus {
  // 人员集合
  observerList = {};
  // 需求集合
  TASK = {};
  // 注册
  addList(name, prop) {
    if (this.observerList[name]) {
      console.log("你已经注册过了");
      return false;
    }
    this.observerList[name] = prop;
  }
  // 发布任务
  updated(name) {
    if(this.TASK[name]){
        this.TASK[name].forEach(element => {
            element()
        });
    }
  }
  // 订阅任务
  subscribe(name,cb){
    if (!this.TASK[name]) {
        this.TASK[name]=[]
      }
      this.TASK[name].push(cb)
  }
  // 完成任务

}

// // 超市
// class Publish {

//   // 发布商品
//   updated(name, task) {
//     this.TASK[name] = task;

//     for (const [key, value] of Object.entries(this.observerList)) {
//       value.addTask(name, task);
//     }
//   }
//   // 注册
//   addList(name, prop) {
//     if (this.observerList[name]) {
//       console.log("已经注册了");
//       return false;
//     }
//     this.observerList[name] = prop;
//   }
// }

let EventBus = new Bus();

let d1 = new Subscribe('D1')

EventBus.addList('弟子一',d1)
EventBus.addList('弟子二',d1)
EventBus.addList('弟子三',d1)

EventBus.subscribe('任务二',()=>{
  console.log('弟子一的任务二已接收')
})
EventBus.subscribe('任务一',()=>{
  console.log('弟子三的任务一已接收')
})
EventBus.subscribe('任务一',()=>{
  console.log('弟子二的任务一已接收')
})

EventBus.updated('任务一')