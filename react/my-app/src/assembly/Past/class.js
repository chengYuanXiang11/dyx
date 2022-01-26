// 类
class Person{
    // 构造器方法
    constructor(name,age){ 
        // 构造器中的this是 -- 类的实例对象
        this.name = name;
        this.age = age;
    }
    //一般方法 放在类的原型对象上(供实例使用)
    speak(){
        console.log('this')

        console.log(this)
        // 此时speak中的this指向Person实例
        console.log(`我叫${this.name},我的年龄是${this.age}`)
    }
}
class Dog extends Person{
    constructor(name,age,page){
        super(name,age,page)
        this.page = page
    }
       // 重写 speak
    speak(){
        console.log('this')

        console.log(this)

        // 重写
        console.log(`我叫${this.name},我的年龄是${this.age},我的年级是${this.page}`)
    }
}
const p1 =new Person('toy',18)
const p2 =new Dog('jerry',2,3)
p1.speak()
p2.speak()
