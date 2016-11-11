/**
 * Some usage examples
 */
var Stream = require("./Stream.js")

console.log('LINEAR CONGRUENTIAL GENERATOR')
var seed = 0
var a = 113
var b = 83
var m = 104723
var casual1 = Stream.iterate(seed, i=>(a*i+b)%m)
console.log(casual1.limit(10).toArray())

//Infinite stream of 4 values
console.log('FOUR VALUES CIRCULAR STREAM')
var circular = Stream.iterate(0,e=>(e+1)%4)
//A Stream can be iterated with a normal for..of 
for(var e of circular.take(8)){
    console.log(e)
}

console.log('OBJECT STREAM')
Stream.from({a:2,b:'hola'}).log()

console.log('SET STREAM')
var set = new Set()
set.add(23)
set.add('hi')
console.log(set)
Stream.from(set).log()

console.log('MAP STREAM')
var map = new Map()
map.set('key1', 12)
map.set('key2',"hi")
console.log(map)
console.log(Stream.from(map).toArray())