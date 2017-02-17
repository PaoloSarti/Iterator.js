const Iterator = require("../Iterator.js")

//Functional programming style
const fibs = ()=>Iterator.iterate([0,1],i=>[i[1], i[0] + i[1]]).map(1)

console.log(fibs().toArray(10))

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