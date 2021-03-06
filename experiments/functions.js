const Iterator = require('../Iterator.js')

var rectify  = x=>x>0?x:0
var softplus = x=>Math.log(1+Math.exp(x))

var a = [5,-1,-45,2,34]

console.log(Iterator(a).map(rectify).toArray())
console.log(Iterator(a).map(softplus).toArray())
console.log(Iterator.random().take(1000).groupBy(i=>i>0.5, 'count'))

function prodN(){
    return Array.from(arguments).reduce((a,b)=>a*b, 1)
}

var Iter = Iterator

var factorials = ()=>Iter.range().skip(1).cumulate(prodN)

const factorial = n=>Iter.range(2,n+1).product()

const binomial = (n,k)=>Iter.range(1,k+1).map(i=>(n+1-i)/i).product()

const binomials = n=>Iter.range(0,n+1).map(i=>binomial(n,i)).toArray()

const binomialsPyramid = n=>Iter.range(0,n).map(binomials).toArray()

var dot = (l1,l2) => Iter(l1).zip(Iter(l2)).reduce((acc,e)=>acc+e[0]*e[1],0)

var norm = l => Math.sqrt(Iter(l).reduce((acc,e)=>acc+e*e,0))

var ssd = (l1,l2)=>Iter(l1).zip(Iter(l2)).reduce((acc,e)=>acc+(e[1]-e[0])*(e[1]-e[0]),0)

var cosine = (l1,l2) => {
    let n1 = norm(l1)
    let n2 = norm(l2)
    return dot(l1,l2)/(n1*n2)
}
