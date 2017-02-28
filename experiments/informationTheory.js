const Iterator = require('../Iterator.js')

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
    var sum = Iterator.values(obj).sum()
    for(let key in obj){
        normalized[key] = obj[key]/sum
    }
    return normalized
}

var d = {A:0.5,B:0.25,C:0.125,D:0.125}
console.log('Discrete distribution: '+JSON.stringify(d))

var s = Iterator.generate(distribution(d))

console.log('Example Iterator: '+s.toArray(20))
var n = 100000
console.log('n: '+n)
var counts = s.take(n).reduce((o,e)=>{
    var inc = {}
    inc[e]=o[e]+1
    return Object.assign(o,inc)
},{A:0,B:0,C:0,D:0})

console.log('Counts: '+JSON.stringify(counts))
var normalized = normalize(counts)
console.log('Frequencies: '+JSON.stringify(normalized)+'\n')

/**
 * Calculates the entropy of a distribution object or of a normalized array (sum of values = 1)
 * -sum_j(p_j*log2(p_j))
 */
function entropy(obj){
    return -Iterator.values(obj)
                    .map(p=>p*Math.log2(p))
                    .sum()
}

/**
 * Calculates the gini index of a distribution object or of a normalized array (sum of values = 1)
 * 1-sum_j(p_j^2)
 */
function giniIndex(obj){
    return 1-Iterator.values(obj)
                    .map(p=>p*p)
                    .sum()
}

/**
 * Calculates the misclassification error of a distribution object or of a normalized array (sum of values = 1)
 */
function misclassificationError(obj){
    return 1-Iterator.values(obj).max()
}

var uniform = {A:0.25,B:0.25,C:0.25,D:0.25}

console.log('Entropy of '+JSON.stringify(uniform)+": "+entropy(uniform))
console.log('Theoretiacal entropy of '+JSON.stringify(d)+': '+entropy(d))
console.log('Tested entropy: '+entropy(normalized)+'\n')


console.log('Gini index of '+JSON.stringify(uniform)+": "+giniIndex(uniform))
console.log('Theoretiacal Gini index of '+JSON.stringify(d)+': '+giniIndex(d))
console.log('Tested Gini index: '+giniIndex(normalized)+'\n')

console.log('misclassification error of '+JSON.stringify(uniform)+": "+misclassificationError(uniform))
console.log('Theoretiacal misclassification error of '+JSON.stringify(d)+': '+misclassificationError(d))
console.log('Tested misclassification error: '+misclassificationError(normalized)+'\n')

var distr = distribution(d)
/*console.log(s.map(e=>e===distr()?1:0).take(n).reduce((a,b)=>{
    var o = Object.assign({},a)
    o.s+=b
    o.n++
    return o
},{s:0,n:0}))*/
console.log('Success rate of a random classifier: '+s.map(e=>e===distr()?1:0).take(n).avg())
console.log('It should be 1-giniIndex: '+(1-giniIndex(d)))

/**
 * A function that takes an encoding object (key=>value),
 * and returns a function that maps a key to that value
 */
function encodeFn(enc){
    return function(e){
        return enc[e]
    }
}
console.log('Encoding Test of '+JSON.stringify(d)+'\n')

var naiveEncoding = {A:[0,0],B:[0,1],C:[1,0],D:[1,1]}
console.log('naiveEncoding: '+JSON.stringify(naiveEncoding))
console.log('Size of encoded Iterator from '+n+' symbols: '+s.map(encodeFn(naiveEncoding)).take(n).flatten().size())

var smartEncoding = {A:[0],B:[1,0],C:[1,1,0],D:[1,1,1]}
console.log('smartEncoding: '+JSON.stringify(smartEncoding))
console.log('Size of encoded Iterator from '+n+' symbols: '+s.map(encodeFn(smartEncoding)).take(n).flatten().size()+'\n')

/**
 * From {A:[0,0],B:[0,1],C:[1,0],D:[1,1]}, gives {"00":"A","01":"B","10":C,"11":D}
 */
function decodeObj(obj){
    return Iterator.from(obj)
        .map(e=>{
            var o = {}
            var joined = e[1].join('')
            o[joined]=e[0]
            return o })
        .reduce(Object.assign,{})
}

var decoded = decodeObj(naiveEncoding)
console.log('Decode '+JSON.stringify(naiveEncoding)+': '+JSON.stringify(decoded))

/**
 * returns a Iterator, decoded with decObj, assuming a fixed encoding length
 */
function decodeNaive(Iterator,decObj){
    var l
    for(var key in decObj){
        l = key.length
        break
    }
    return Iterator.buffer(l).map(e=>decObj[e.join('')])
}

var decodedIterator = decodeNaive(s.map(encodeFn(naiveEncoding)).flatten(),decoded)
console.log('Decoded naive: '+decodedIterator.take(10).toArray())
