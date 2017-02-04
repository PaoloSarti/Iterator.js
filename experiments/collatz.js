const Iterator = require("../Iterator.js")

function hotpo(n){
    return n%2==0?n/2:3*n+1
}

function collatzIterator(n){
    return Iterator.iterate(n,hotpo).takeWhile(e=>e>1).append(1)
}


console.log(collatzIterator(14).toArray())