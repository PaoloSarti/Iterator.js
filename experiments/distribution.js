const Stream = require('../Stream.js')

/**
 * takes an object that maps his keys to probabilities
 * and returns a function that returns one of the keys 
 * with that discrete distribution
 */
function distribution(o){
    return function(){
        var p = 0
        var r = Math.random()
        for(let key in o){
            p+=o[key]
            if(r<p){
                return key
            }
        }
    }
}

/**
 * Takes an objects that maps keys to counts and returns a new object that maps keys to frequencies.
 * The sum of the values will be one
 */
function normalize(obj){
    var normalized = {}
    var sum = Stream.from(obj).map(e=>e.value).sum()
    for(let key in obj){
        normalized[key] = obj[key]/sum
    }
    return normalized
}

var d = {A:0.5,B:0.25,C:0.125,D:0.125}
console.log('Discrete distribution: '+JSON.stringify(d))

var s = Stream.generate(distribution(d))

console.log('Example stream: '+s.toArray(20))
var n = 1000000
console.log('n: '+n)
var counts = s.take(n).reduce((o,e)=>{
    var inc = {}
    inc[e]=o[e]+1
    return Object.assign(o,inc)
},{A:0,B:0,C:0,D:0})

console.log('Counts: '+JSON.stringify(counts))
console.log('Frequencies: '+JSON.stringify(normalize(counts)))

/**
 * A function that takes an encoding object (key=>value),
 * and returns a function that maps a key to that value
 */
function encodeFn(enc){
    return function(e){
        return enc[e]
    }
}

var naiveEncoding = {A:[0,0],B:[0,1],C:[1,0],D:[1,1]}
console.log('naiveEncoding: '+JSON.stringify(naiveEncoding))
console.log('Size of encoded stream from '+n+' symbols: '+s.map(encodeFn(naiveEncoding)).take(n).flatten().size())

var smartEncoding = {A:[0],B:[1,0],C:[1,1,0],D:[1,1,1]}
console.log('smartEncoding: '+JSON.stringify(smartEncoding))
console.log('Size of encoded stream from '+n+' symbols: '+s.map(encodeFn(smartEncoding)).take(n).flatten().size())