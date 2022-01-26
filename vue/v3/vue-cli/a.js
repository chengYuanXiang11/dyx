function arrA(a,b){

    let arr=[...a].filter((item) => {
        if (!b.includes(item)) {
          return item;
        }
      })
      let arr2=[...b].filter((item) => {
        if (!a.includes(item)) {
          return item;
        }
      })
      return [...new Set([...arr,...arr2])]
}
console.log(arrA([102, 101, 98],[101, 100]))