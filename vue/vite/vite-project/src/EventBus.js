 class Bus{
     constructor(){
         this.callBus={}
     }

     $on(event,fn){
         if(!this.callBus[event]){
             this.callBus[event]=[]
         }
         this.callBus[event].push(fn)
     }

     $emit(name,data){
         if(this.callBus[name]){
             this.callBus[name].forEach(element => {
                 element(data)
             });
         }
     }

     $off(name,fn){
         if(fn === undefined){
             Reflect.deleteProperty(this.callBus,name)
         }else{
            this.callBus[name] = this.callBus[name].filter(v=>v.toString()!==fn.toString())
         }
     }
 }
 const bus = new Bus();

function name(data) {
    console.log(data + '15')

}
// export default bus
bus.$on('clikc', function (data2) {
    console.log(data2)
})
bus.$on('clikc', function (data2) {
    console.log(data2 + '24124')
})
bus.$on('clikc', name)

// bus.$emit('clikc', '123');
bus.$off('clikc', name);
// bus.$emit('clikc', '123');
// bus.$off('clikc');
bus.$emit('clikc', '123');
