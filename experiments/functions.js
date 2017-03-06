const Iterator = require('../Iterator.js')

var rectify  = x=>x>0?x:0
var softplus = x=>Math.log(1+Math.exp(x))

var a = [5,-1,-45,2,34]

console.log(Iterator(a).map(rectify).toArray())
console.log(Iterator(a).map(softplus).toArray())
console.log(Iterator.random().take(1000).groupBy(i=>i>0.5, 'count'))