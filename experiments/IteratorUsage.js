/**
 * Some usage examples
 */
var Iterator = require("../Iterator.js")

console.log('LINEAR CONGRUENTIAL GENERATOR')
var seed = 0
var a = 113
var b = 83
var m = 104723
var casual1 = Iterator.iterate(seed, i=>(a*i+b)%m)
console.log(casual1.limit(10).toArray())

//Infinite Iterator of 4 values
console.log('FOUR VALUES CIRCULAR Iterator')
var circular = Iterator.iterate(0,e=>(e+1)%4)
//A Iterator can be iterated with a normal for..of 
for(var e of circular.take(8)){
    console.log(e)
}

console.log('Iterator OF ARGUMENTS')
Iterator.of(1,2,3).log()

console.log('OBJECT Iterator')
Iterator.from({a:2,b:'hola'}).log()

console.log('SET Iterator')
var set = new Set()
set.add(23)
set.add('hi')
console.log(set)
Iterator.from(set).log()

console.log('MAP Iterator')
var map = new Map()
map.set('key1', 12)
map.set('key2',"hi")
console.log(map)
console.log(Iterator.from(map).toArray())

console.log('GROUP BY')
var s = Iterator.from('hi how are you?'.split(' '))
console.log(s.groupBy(s=>s[0]))

console.log('PARTITION')
var s = Iterator.from('hi how are you?'.split(' '))
console.log(s.partition(s=>s.length===3))

console.log('Iterator FROM ITERATOR (CREATED WITH A GENERATOR)')
var fibs = function*(){
    var a = 0
    var b = 1
    while(true){
        yield b
        var c = a + b
        a = b
        b = c
    }
}
//a Iterator is really just a wrapper of iterators, so the constructor takes iterators
var f = new Iterator(fibs())
//the first ten even fibonacci numbers
console.log(f.filter(i=>i%2==0).limit(10).toArray())

console.log('SORTED')
var s = Iterator.generate(()=>Math.floor(Math.random()*100))
//console.log(s.take(10).sorted().toArray())

console.log('SORTED BY PROPERTY')
console.log(Iterator.tabulate(i=>{ return {a:i,b:10-i};}).take(10).sorted('b').toArray())

console.log('REVERSED')
console.log(Iterator.of(3,2,1,4).reversed().toArray())

console.log('CONCAT')
console.log(Iterator.of(1,2,3,45,2,34).concat([64,325,4]).toArray())
console.log(Iterator.of(1,3,5412,53,2).concat(Iterator.of(4,2,3,5)).toArray())

console.log('NEXT')
var s = Iterator.of(4,2)
console.log(s.nextValue())
console.log(s.nextValue())
console.log(s.nextValue())

console.log('APPLYGENERATOR')
var smoothGen = function*(Iterator){
    var prev2 = Iterator.nextValue()
    var prev1 = Iterator.nextValue()
    for(var i of Iterator){
        yield (i+prev1+prev2)/3
        prev2=prev1
        prev1=i
    }
}
console.log(Iterator.of(1,5,2,4).applyGenerator(smoothGen).toArray())

console.log('APPLYOPERATOR')
var s1 = Iterator.iterate(1,s=>s+2)
var s2 = Iterator.iterate(1,s=>s+3)
console.log(s1.applyOperator((a,b)=>a+b, s2).take(5).toArray())

console.log('FLATMAP')
var s = Iterator.tabulate(i=>i).skip(1)
console.log(s.flatMap(s=>[s/4,s/2,3*s/4]).limit(10).toArray())

console.log('BUFFER')
var s = Iterator.range(1,21)
console.log(s.buffer(5).map(e=>e.reduce((a,b)=>a+b)).toArray())

console.log('APPEND')
var s = Iterator.of(2,1,4,3,2)
console.log(s.append(65,12,32).toArray())

console.log('ZIP')
var s1 = Iterator.range(0,10)
var s2 = Iterator.range(0,10).reversed()
console.log(s1.zip(s2).toArray())