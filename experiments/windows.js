const Iter = require("../Iterator.js")

// much faster than dot :(
function imperativeDot(l1,l2){
    var acc = 0;
    for(var i=0; i<l1.length; i++){
        acc += l1[i]*l2[i]
    }
    return acc
}

// dot product between vectors
var dot = (l1,l2)=>Iter(l1).zip(Iter(l2)).reduce((acc,cur)=>acc+cur[0]*cur[1],0)

// 1D convolution, returns an iterator for further calculations
var convIter = (l,kern)=>Iter(l).window(kern.length).map(e=>imperativeDot(e,kern.reverse()))

// 1D convolution, returns an array
var conv = (l,kern)=>convIter(l,kern).toArray()

// 1D correlation
var corr = (l,kern)=>Iter(l).window(kern.length).map(e=>imperativeDot(e,kern)).toArray()

// Differences
var differencesIter = l=>Iter(l).window(2).map(i=>i[1]-i[0])

var differences = l=>differencesIter(l).toArray()