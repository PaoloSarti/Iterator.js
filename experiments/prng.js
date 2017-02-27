const Iterator = require("../Iterator.js")

//Linear congruential generator
const lcg = (seed, m, a, c)=>Iterator.iterate(seed, x=>(a*x+c)%m)

console.log(lcg(1,9,2,0).toArray(10))

function period(prng){
    var s = prng.nextValue()
    return prng.takeWhile(i=>i!==s).count()+1
}

console.log("Period: "+period(lcg(1,9,2,0)))

console.log("Period: "+period(lcg(0,9,4,1)))

console.log("Period: "+period(lcg(1,23,7,1)))

var javaRandom = seed => lcg(seed, Math.floor(Math.pow(2,48)), 25214903917,11)

console.log("Java random: "+javaRandom(43).toArray(20))

//Pseudo random bit generator
var prbg = prng=>prng.map(i=>i%2)

var javaRandomBg = seed => prbg(javaRandom(seed))

console.log(javaRandomBg(43).take(100000).avg())