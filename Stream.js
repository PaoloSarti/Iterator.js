/**
 * 
 * A Stream is an iterable object that provides some functional operators to initiate or manipulate its
 * elements.
 *
 * Most of its methods return a new Stream, but they don't execute any operation until explicitly requested.
 * E.g. by iterating with a for..of, or by calling the toArray or other methods that consume the Stream, so that it can't be iterated again.
 * This is because the functions are executed lazily.
 * 
 * Thanks to the laziness of the execution (achieved through generators), infinite streams can be manipulated.
 */
Stream = function(iter){

    /**
     * iterator
     */
    this[Symbol.iterator] = ()=>iter
    
    /**
     * returns a new Stream that can iterate only on the first n elements (or less) of the stream
     */
    this.take = function(n){
        var takeGen = function*(){
            for(var i=0; i<n; i++){
                var next = iter.next()
                if(next.done === false)
                    yield next.value
            }
        }
        return new Stream(takeGen())
    }

    /**
     * take alias
     */
    this.limit = this.take

    /**
     * returns a new Stream that skips the first n elements. Notice that this method actually iterates over 
     * the stream immediatly to reach the new starting position.
     */
    this.skip = function(n){
        var ended = false
        for(var i=0; (i<n)&&(!ended); i++){
            var next = iter.next()
            ended = next.done
        }
        var skipGen = function*(){
            if(!ended){
                for(var j of iter){
                    yield j
                }
            }
        }
        return new Stream(skipGen())
    }

    /**
     * maps every element of the stream to another element applying the given function.
     * A new Stream is returned
     */
    this.map = function(f){
        var mapGen = function*(){
            for(var i of iter){
                yield f(i)
            }
        }
        return new Stream(mapGen())
    }

    /**
     * Filters every element, if the function f returns true, the element will be present also in the new Stream.
     */
    this.filter = function(f){
        var filterGen = function*(){
            for(var i of iter){
                if(typeof f === 'function'){
                    if(f(i)===true){
                        yield i
                    }
                }
                else if(typeof f === 'object'){
                    var allMatch = true
                    for(var name in f){
                        if(i[name] !== f[name]){
                            allMatch = false
                        }
                    }
                    if(allMatch){
                        yield i
                    }
                }
            }
        }
        return new Stream(filterGen())
    }

    /**
     * Takes all the elements while they satisfy the f condition.
     * A new Stream is returned
     */
    this.takeWhile = function(f){
        var takeWhileGen = function*(){
            for(var i of iter){
                if(f(i)){
                    yield i
                }
                else break
            }
        }
        return new Stream(takeWhileGen())
    }


    //HEAVY METHODS
    //THEY USE A SUPPORT ARRAY AND THUS CAN ONLY OPERATE ON A FINITE STREAM!!
    /**
     * Returns a sorted version of the stream, according to natural ordering or accarding to a compare function
     */
    this.sorted = function(){
        var array = this.toArray()

        if(arguments.length === 0){
            array.sort()
        }else{
            array.sort(arguments[0])
        }

        var arrayGen = function*(){
            for(var e of array){
                yield e
            }
        }

        return new Stream(arrayGen())
    }

    /**
     * alias
     */
    this.sort = this.sorted

    /**
     * distinct
     */
    this.distinct = function(){
        var distinctGen = function*(){
            var s = new Set()
            for(var e of iter){
                if(!s.has(e)){
                    s.add(e)
                    yield e
                }
            }
        }
        return new Stream(distinctGen())
    }

    //EAGER METHODS
    //THEY CONSUME THE STREAM!

    /**
     * Executes f(e) for every element e of the stream
     */
    this.forEach = function(f){
        for(var i of iter){
            f(i)
        }
    }

    /**
     * process(n,f)
     * process n elements with the function f
     * Like forEach, but only for the first n elements, then returns the rest of the Stream
     */
    this.process = function(n, f){
        var ended = false
        for(var i=0; i<n && !ended; i++){
            var e = iter.next()
            if(e.done){
                ended = true
            }
            else{
                f(e.value)
            }
        }
        return this
    }

    /**
     * equivalent to s.forEach(console.log)
     */
    this.log = function(){
        this.forEach(console.log)
    }

    /**
     * Finds the first occurence of an element e that satisfies f(e) and returns it
     */
    this.find = function(f){
        for(var i of iter){
            if(f(i)===true){
                return i
            }
        }
        return undefined
    }

    /**
     * Groups the elements of the Stream using as key the result of function f applied to every element
     */
    this.groupBy = function(f){
        var obj = {}
        this.forEach(e=>{
            var key  = f(e)
            if(obj[key]===undefined){
                obj[key]=[e]
            }
            else {
                obj[key].push(e)
            }
        })
        return obj
    }

    /**
     * Partitions the elements of a Stream 
     */
    this.partition = this.groupBy
    this.partitionBy = this.groupBy

    /**
     * Applies f on an accumulator (initiated with start) and every element of the Stream.
     * Returns a single value
     */
    this.reduce = function(f,start){
        var acc = start
        for(var i of iter){
            acc = f(acc, i)
        }
        return acc
    }

    /**
     * Counts the elements of the stream
     */
    this.count = function(){
        var acc = 0
        for(var i of iter){
            acc+=1
        }
        return acc
    }

    /**
     * count alias
     */
    this.size = this.count

    /**
     * Returns the first element
     */
    this.first = function(){
        for(var i of iter){
            return i
        }
    }

    /**
     * Returns the last element
     */
    this.last = function(){
        var l
        for(var i of iter){
            l=i
        }
        return l
    }

    /**
     * Sums all the elements of the stream
     */
    this.sum = function(){
        var acc = 0
        for(var i of iter){
            acc+=i
        }
        return acc
    }

    /**
     * Creates a new array with the stream elements
     */
    this.toArray = function(){
        var a = []
        var next = iter.next()
        while(next.done === false){
            a.push(next.value)
            next = iter.next()
        }
        return a
    }
}

/**
 * Stream composed of the given arguments
 */
Stream.of = function(){
    var args = arguments
    var ofGen = function*(){
        for(var a of args){
            yield a
        }
    }
    return new Stream(ofGen())
}

/**
 * Infinite stream of values obtained by applying the function f from the start value
 */
Stream.iterate = function(start, f){
    var lazyStream = function*() {
        var cur = start
        while(true){
            yield cur
            cur = f(cur)
        }
    }
    return new Stream(lazyStream())
}

/**
 * Infinite stream of values obtained by applying the function f to the index (starting from 0)
 */
Stream.tabulate = function(f){
    var tabGen = function*(){
        for(var i=0; ;i++){
            yield f(i)
        }
    }
    return new Stream(tabGen())
}

/** 
 * Limited Stream of integers, from startInclusive to endExclusive
 */
Stream.range = function(startInclusive, endExclusive, step){
    if(step===undefined)
        step=1

    var ranGen = function*(){
        for(var i= startInclusive; i<endExclusive; i+=step){
            yield i
        }
    }
    return new Stream(ranGen())
}

/**
 * infinite stream composed of the results of the function f
 */
Stream.generate = function(f){
    var genGen = function*(){
        while(true){
            yield f()
        }
    }
    return new Stream(genGen())
}

/**
 * infinite stream composed of only the element e
 */
Stream.fill = function(e){
    var fillGen = function*(){
        while(true){
            yield e
        }
    }
    return new Stream(fillGen())
}

/**
 * An empty stream
 */
Stream.empty = function(){
    var emptyGen = function*(){
    }
    return new Stream(emptyGen())
}

/**
 * Creates a stream from an array, object, Set, Map.
 * With a Map, it creates a stream of {key:<key>, value:<value>} objects
 * With an object, it creates a stream of {name:<name>, value:<value>} objects
 * 
 */
Stream.from = function(a){
    //if null
    if(a === null || a === undefined)
        return Stream.empty()
    
    //if array or Set
    if(a.constructor === Array || a.constructor === Set || typeof a === 'string')
        return new Stream(a[Symbol.iterator]())

    //if Map
    if(a.constructor === Map){
        var mapGen = function*(){
            for(var e of a){
                yield {
                    key: e[0],
                    value: e[1]
                }
            }
        }
        return new Stream(mapGen())
    }

    //if object
    if(typeof a === 'object'){
        var objGen = function*(){
            for(var e in a){
                yield {
                    name:e,
                    value:a[e]
                }
            }
        }
        return new Stream(objGen())
    }

    //if something else, call Stream.of
    return Stream.of(a)
}

module.exports = Stream