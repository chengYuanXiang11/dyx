// 观察者模式

// 观察者
class Observer {
  // 任务列表
  task = {};
  constructor(name) {
    this.name = name;
  }
  // 接任务
  addTask(name, task) {
    if (this.task[name]) {
      console.log("已经接过该任务了了");
      return false;
    }
    this.task[name] = task;
  }
  // 完成任务
  delTask(name) {
    if (this.task[name]) {
      Reflect.deleteProperty(this.task,name);
      console.log("完成任务了");
    } else {
      console.log("没这个任务");
    }
  }
}




// 订阅者
class subscriber {
  // 一个存放观察者的集合
  observerList = {};

  // 任务集合
  TASK = [];
  // 发布任务
  updated(name, task) {
    this.TASK[name] = task;

    for (const [key, value] of Object.entries(this.observerList)) {
        value.addTask(name, task);
      }
  }
  // 注册
  addList(name,prop) {
    if (this.observerList[name]) {
        console.log("已经注册了");
        return false;
      }
      this.observerList[name] = prop;
  }
}

let sub = new subscriber();
let ob1 = new Observer();
let ob2 = new Observer();
let ob3 = new Observer();

sub.addList("ob1", ob1);
sub.addList("ob2", ob2);
sub.addList("ob3", ob3);
sub.addList("ob3", ob3);

sub.updated("任务一", () => {
  console.log("任务是任务一");
});
console.log(ob1,ob2,ob3)
ob1.delTask('任务一')
ob1.delTask('任务一1')
