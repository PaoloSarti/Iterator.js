const Iterator = require("../Iterator.js")

/**
 * 
 */
function Generator(it,pipeline){
    if(typeof it[Symbol.iterator] === 'function'){
        var genIt = function*(){
            for(var i of it){
                yield i
            }
        }
        this.generator = genIt
    }
    else if (typeof it === 'function'){
        this.generator = it
    }
    if(pipeline===undefined) {
        this.pipeline = []
    }
    else {
        this.pipeline = pipeline
    }
}

Generator.prototype[Symbol.iterator] = function(){
    return this.generator()
}

Generator.prototype.iterator = function(){
    var it = new Iterator(this.generator())
    for(var [fn,args] of this.pipeline){
        it = fn.call(it,...args)
    }
    return it
}

Generator.prototype.map = function(fn){
    var newPipeline = this.pipeline.slice()
    var it = Iterator.empty()
    newPipeline.push([it.map,[fn]])
    return new Generator(this.generator,newPipeline)
}

Generator.prototype.log = function(){
    this.iterator().log()
}


var g = new Generator([7,5,2])

g.map(i=>i+1).log()

for(var i of g){
    console.log(i)
}