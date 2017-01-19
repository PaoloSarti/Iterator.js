const Stream = require("../Stream.js")

function hotpo(n){
    return n%2==0?n/2:3*n+1
}

function collatzStream(n){
    return Stream.iterate(n,hotpo).takeWhile(e=>e>1).append(1)
}


console.log(collatzStream(14).toArray())