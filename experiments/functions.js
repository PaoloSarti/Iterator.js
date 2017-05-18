const Iterator = require('../Iterator.js')

var rectify  = x=>x>0?x:0
var softplus = x=>Math.log(1+Math.exp(x))

var a = [5,-1,-45,2,34]

console.log(Iterator(a).map(rectify).toArray())
console.log(Iterator(a).map(softplus).toArray())
console.log(Iterator.random().take(1000).groupBy(i=>i>0.5, 'count'))

//Some functions that can be easily expressed with Iterators:
const factorials = ()=>Iter.range().skip(1).cumulate((a,b)=>a*b)

const factorial = n=>Iter.range(2,n+1).product()

const binomial = (n,k)=>Iter.range(1,k+1).map(i=>(n+1-i)/i).product()

const binomials = n=>Iter.range(0,n+1).map(i=>binomial(n,i)).toArray()

const binomialsPyramid = n=>Iter.range(0,n).map(binomials).toArray()