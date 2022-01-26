// EventBus
class Bus {
    constructor() {
        this.clalBack = {}
    }
    $on(name, fn) {
        if (!this.clalBack[name]) {
            this.clalBack[name] = [];
        }
        this.clalBack[name].push(fn)

    }
    $emit(name, data) {
        if (this.clalBack[name]) {
            this.clalBack[name].forEach((fn) => {
                fn(data)
            })
        }
    }

    $off(name, fn) {
        if (fn === undefined) {
            Reflect.deleteProperty(this.clalBack,name)
        } else {
            this.clalBack[name] = this.clalBack[name].filter((v, k) => {
                return fn.toString() !== v.toString()
            })
            console.log()
        }
    }
}
const bus = new Bus();

function name(data) {
    console.log(data + '15')

}
export default bus
// bus.$on('clikc', function (data2) {
//     console.log(data2)
// })
// bus.$on('clikc', function (data2) {
//     console.log(data2 + '24124')
// })
// bus.$on('clikc', name)

// bus.$emit('clikc', '123');
// bus.$off('clikc', name);
// bus.$emit('clikc', '123');
// bus.$off('clikc');
// bus.$emit('clikc', '123');
