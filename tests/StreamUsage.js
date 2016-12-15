/**
 * Some usage examples
 */
var Stream = require("../Stream.js")

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

console.log('STREAM OF ARGUMENTS')
Stream.of(1,2,3).log()

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

console.log('GROUP BY')
var s = Stream.from('hi how are you?'.split(' '))
console.log(s.groupBy(s=>s[0]))

console.log('PARTITION')
var s = Stream.from('hi how are you?'.split(' '))
console.log(s.partition(s=>s.length===3))

console.log('STREAM FROM ITERATOR (CREATED WITH A GENERATOR)')
var fibs = function*(){
    var a = 0
    var b = 1
    yield a
    yield b
    while(true){
        var c = a + b
        a = b
        b = c
        yield b
    }
}
//a Stream is really just a wrapper of iterators, so the constructor only takes iterators
var f = new Stream(fibs())
//the first ten even fibonacci numbers
console.log(f.filter(i=>i%2==0).limit(10).toArray())

console.log('SORTED')
var s = Stream.generate(()=>Math.floor(Math.random()*100))
//console.log(s.take(10).sorted().toArray())

console.log('SORTED BY PROPERTY')
console.log(Stream.tabulate(i=>{ return {a:i,b:10-i};}).take(10).sorted('b').toArray())

console.log('REVERSED')
console.log(Stream.of(3,2,1,4).reversed().toArray())

console.log('CONCAT')
console.log(Stream.of(1,2,3,45,2,34).concat([64,325,4]).toArray())
console.log(Stream.of(1,3,5412,53,2).concat(Stream.of(4,2,3,5)).toArray())

console.log('NEXT')
var s = Stream.of(4,2)
console.log(s.nextValue())
console.log(s.nextValue())
console.log(s.nextValue())

console.log('APPLYGENERATOR')
var smoothGen = function*(stream){
    var prev2 = stream.nextValue()
    var prev1 = stream.nextValue()
    for(var i of stream){
        yield (i+prev1+prev2)/3
        prev2=prev1
        prev1=i
    }
}
console.log(Stream.of(1,5,2,4).applyGenerator(smoothGen).toArray())