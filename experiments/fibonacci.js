const Iterator = require("../Iterator.js")

//Imperative version that returns an array
//I have to decide the dimension right away, otherwise it explodes :)
function fibsImperative(n){
    var a = 0
    var b = 1
    var array = []
    for(var i=0; i<n; i++){
        array[i] = b
        var c = a
        a = b
        b = b + c
    }
    return array
}

//From generator
const fibsGen = function*(){
    var a = 0
    var b = 1
    while(true){
        yield b
        var c = a
        a = b
        b = b + c
    }
}

const fibsG = ()=>Iterator.from(fibsGen())
console.log(fibsG().toArray(10))

//Functional programming style
const fibs = ()=>Iterator.iterate([1,1],i=>[i[1], i[0] + i[1]]).map(0)
console.log(fibs().toArray(10))

//Performance test
const millis = action=>{
    var start = Date.now()
    action()
    console.log("Elapsed millis: "+(Date.now()-start))
}

const N = 1475

millis(()=>{
    console.log(fibsG().takeWhile(i=>i<Infinity).last())
})

millis(()=>{
    var f = fibsImperative(N+1)
    console.log(f[N])
})

millis(()=>{
    console.log(fibs().takeWhile(i=>i<Infinity).last())
})