/**
 * 
 * An Iterator is a wrapper to JavaScript's iterators that adds functional operators such as map, reduce.
 *
 * Most of its methods return a new Iterator, but they don't execute any operation until explicitly requested.
 * This is because the functions are executed lazily.
 * E.g. by iterating with a for..of, or by calling the toArray or other methods that consume the Iterator, so that it can't be safely iterated again.
 * 
 * Thanks to the laziness of the execution (achieved through generators), infinite Iterators can be manipulated.
 * 
 */
"use strict";

(function(){
    var root = this
    var previous_Iterator = root.Iterator

    function Iterator(it){
        var iter = {}

        var iterator
        if(isIterable(it)){
            iterator = it[Symbol.iterator]()
        }
        else if(isIterator(it)){
            iterator=it
        }
        else if(typeof it === 'function')
            return generate(it)

        /**
         * iterator
         */
        iter[Symbol.iterator] = ()=>iterator  

        /**
         * It is an iterator ititer
         */
        iter.next = ()=>iterator.next()
        iter.nextValue = ()=>iterator.next().value

        /**
         * returns a new Iterator that can iterate only on the first n elements (or less) of the Iterator
         */
        iter.take = function(n){
            var takeGen = function*(){
                for(var i=0; i<n; i++){
                    var next = iterator.next()
                    if(next.done === false)
                        yield next.value
                }
            }
            return Iterator(takeGen())
        }

        /**
         * take alias
         */
        iter.limit = iter.take

        /**
         * returns a new Iterator that skips the first n elements.
         */
        iter.skip = function(n){
            var skipGen = function*(){
                var ended = false
                for(var i=0; (i<n)&&(!ended); i++){
                    var next = iterator.next()
                    ended = next.done
                }
                if(!ended){
                    for(var j of iterator){
                        yield j
                    }
                }
            }
            return Iterator(skipGen())
        }

        /**
         * skips every elements until a predicate returns true, then it returns the remaining elements of the Iterator
         */
        iter.dropWhile = function(predicate){
            var dropWhileGen = function*(){
                var next = iterator.next()
                while((!next.done) && predicate(next.value)){
                    next = iterator.next()
                    //just skip these
                }
                if(!next.done){
                    yield next.value
                    for(let i of iterator){
                        yield i
                    }
                }
            }
            return Iterator(dropWhileGen())
        }

        /**
         * dropWhile alias
         */
        iter.skipWhile = iter.dropWhile

        /**
         * Skip alias
         */
        iter.drop = iter.skip

        /**
         * Applies f if it's a function.
         * If a string is provided, then it will map the object property with that name.
         * If a number is provided, then it will map the array element with that index
         */
        function mapElement(e,f){
            if(typeof f === 'string' || typeof f === 'number'){
                return e[f]
            }
            else if(typeof f === 'function'){
                return f(e)
            }
        }

        /**
         * maps every element of the Iterator to another element applying the given function.
         * If a string is provided, then it will map the object property with that name.
         * If a number is provided, then it will map the array element with that index
         * A new Iterator is returned.
         */
        iter.map = function(f){
            var mapGen = function*(){
                for(var i of iterator){
                    yield mapElement(i,f)
                }
            }
            return Iterator(mapGen())
        }

        /**
         * Maps the elements to a list of elements, each one yielded in the new Iterator.
         * If a string is provided, then it will flatmap the object property with that name (it has to be an iterable tough).
         */
        iter.flatMap = function(f){
            var flatMapGen = function*(){
                for(var i of iterator){
                    var l = mapElement(i,f)
                    for(var j of l){
                        yield j
                    }
                }
            }
            return Iterator(flatMapGen())
        }

        /**
         * Flattens a Iterator of iterables into a Iterator of the elements of each iterable
         */
        iter.flatten = ()=>iter.flatMap(i=>i)


        /**
         * check an element e. f can be a predicate, an object, or a regular expression. If it is an object, checks if the element has the same property values as the given objects
         */
        function check(e,f){
            if(typeof f === 'function'){
                return f(e)
            }
            else if(f.constructor === RegExp){
                return e.search(f) !== -1
            }
            else if(typeof f === 'object'){
                for(var name in f){
                    if(e[name] !== f[name]){
                        return false
                    }
                }
                return true
            }
        }

        /**
         * Filters every element with a function or an object, if the function f returns true, or the element has the property values given by the object,
         * or matches the given RegExp, the element will be present in the returned Iterator.
         */
        iter.filter = function(f){
            var filterGen = function*(){
                for(var i of iterator){
                    if(check(i,f)){
                        yield i
                    }
                }
            }
            return Iterator(filterGen())
        }

        /**
         * Takes all the elements while they satisfy the f condition.
         * A new Iterator is returned
         */
        iter.takeWhile = function(f){
            var takeWhileGen = function*(){
                for(var i of iterator){
                    if(f(i)){
                        yield i
                    }
                    else break
                }
            }
            return Iterator(takeWhileGen())
        }
        
        /**
         * Concats any iterable lazily. Returns a new Iterator
         */
        iter.concat = function(s){
            var concatGen = function*(){
                for(var i of iterator){
                    yield i
                }
                for(var i of s){
                    yield i
                }
            }
            return Iterator(concatGen())
        }

        /**
         * Produces a Iterator of couples from two Iterators
         */
        iter.zip = function(s){
            var zipGen = function*(){
                var next1 = iterator.next()
                var next2 = s.next()
                while((!next1.done)&&(!next2.done)){
                    yield [next1.value,next2.value]
                    next1 = iterator.next()
                    next2 = s.next()
                }
            }
            return Iterator(zipGen())
        }

        /**
         * returns a Iterator of couples in which the first element is an index (staring from 0)
         * and the second is the element of the Iterator
         */
        iter.zipWithIndex = function(){
            var zipWithIndexGen = function*(){
                var i=0
                for(var e of iterator){
                    yield [i,e]
                    i++
                }
            }
            return Iterator(zipWithIndexGen())
        }

        /**
         * zipWithIndex alias
         */
        iter.enumerate = iter.zipWithIndex

        /**
         * Filter by providing a predicate on the index (starting from 0 from the current item)
         */
        iter.filterByIndex = function(f){
            return iter.zipWithIndex().filter(e=>f(e[0])).map(e=>e[1])
        }


        /**
         * Append one or more argument to the Iterator lazily
         */
        iter.append = function(){
            var args = arguments
            var appendGen = function*(){
                for(var i of iterator){
                    yield i
                }
                for(var a of args){
                    yield a
                }
            }
            return Iterator(appendGen())
        }

        /**
         * Generates a new Iterator, in which every element is an Iterator of n elements of the original Iterator
         */
        iter.buffer = function(n){
            var bufGen = function*(){
                var j = 0
                var a = []
                for(var i of iterator){
                    if(j<n){
                        a.push(i)
                        j++
                    }
                    else{
                        j = 1
                        yield Iterator(a)
                        a = [i]
                    }
                }
                if(a.length>0)
                    yield Iterator(a)
            }
            return Iterator(bufGen())
        }

        /**
         * Returns a Iterator that is made of partial sums of every previous element of the Iterator
         */
        iter.cumulate = function(){
            var cumulateGen = function*(){
                var a = 0
                for(var i of iterator){
                    a = a + i
                    yield a
                }
            }
            return Iterator(cumulateGen())
        }

        /**
         * Apply a custom generator on the Iterator.
         * The generator should accept the Iterator as a parameter, and yield the elements of the new Iterator
         */
        iter.applyGenerator = function(gen){
            return Iterator(gen(iter))
        }

        /**
         * Takes an operator (a mapping function that takes two values and maps them into one value)
         * and another Iterator, and applies the operator to each couple of elements of the two Iterators to produce another Iterator.
         */
        iter.applyOperator = function(operator, iter){
            var applyOpGen = function*(){
                for(var i of iterator){
                    var n = iter.next() 
                    if(n.done===true)
                        break

                    yield operator(i,n.value)
                }
            }
            return Iterator(applyOpGen())
        }

        //HEAVY METHODS
        //THEY USE A SUPPORT ARRAY AND THUS CAN ONLY OPERATE ON A FINITE Iterator!!
        /**
         * Returns a sorted version of the Iterator, according to natural ordering or according to a compare function, or by natural ordering of a property
         */
        iter.sorted = function(){
            var args = arguments
            var arrayGen = function*(){
                var array = iter.toArray()
                if(args.length === 0){
                    array.sort()
                }else if(typeof args[0] === 'string'){
                    var name = args[0]
                    array.sort((a,b)=>{
                        if(a[name]<b[name])
                            return -1
                        else if(a[name]>b[name])
                            return 1
                        else
                            return 0
                    })
                } else if(typeof args[0] === 'function'){
                    var fn = args[0]
                    array.sort(fn)
                }
                for(var e of array){
                    yield e
                }
            }

            return Iterator(arrayGen())
        }

        /**
         * sorted alias
         */
        iter.sort = iter.sorted

        /**
         * Returns a new Iterator without repeated elements
         */
        iter.distinct = function(){
            var distinctGen = function*(){
                var s = new Set()
                for(var e of iterator){
                    if(!s.has(e)){
                        s.add(e)
                        yield e
                    }
                }
            }
            return Iterator(distinctGen())
        }

        /**
         * Returns a reversed version of the Iterator
         */
        iter.reversed = function(){
            var revGen = function*(){
                var array = iter.toArray().reverse()
                for(var e of array){
                    yield e
                }
            }
            return Iterator(revGen())
        }

        iter.reverse = iter.reversed

        //EAGER METHODS
        //THEY CONSUME THE Iterator!

        /**
         * Executes f(e) for every element e of the Iterator
         */
        iter.forEach = function(f){
            for(var i of iterator){
                f(i)
            }
        }

        /**
         * process(n,f)
         * process n elements with the function f
         * Like forEach, but only for the first n elements, then returns the rest of the Iterator
         */
        iter.process = function(n, f){
            var ended = false
            for(var i=0; i<n && !ended; i++){
                var e = iterator.next()
                if(e.done){
                    ended = true
                }
                else{
                    f(e.value)
                }
            }
            return iter
        }

        /**
         * equivalent to s.forEach(console.log)
         */
        iter.log = function(){
            iter.forEach(console.log)
        }

        /**
         * Finds the first occurence of an element e that satisfies f(e) and returns it
         */
        iter.find = function(f){
            for(var i of iterator){
                if(f(i)===true){
                    return i
                }
            }
            return undefined
        }

        /**
         * Groups the elements of the Iterator using as key the result of function f applied to every element.
         * Or, if you pass a String, groups by that property (in an Iterator of objects).
         * A second optional argument can be passed, to apply a terminal function to the grouped collections
         */
        iter.groupBy = function(f){
            var obj = {}
            iter.forEach(e=>{
                var key
                if(typeof f === 'function'){
                    key  = f(e)
                }
                else if(typeof f === 'string'){
                    key = e[f]
                }

                if(obj[key]===undefined){
                    obj[key]=[e]
                }
                else {
                    obj[key].push(e)
                }
            })

            
            if(arguments.length === 2){
                var termFuncString = arguments[1]
                var iterOb = iteratorsObject(obj)
                var aggregatedObj = {}
                for(var key in iterOb){
                    if(iterOb[key].constructor === Iterator)
                        aggregatedObj[key]=iterOb[key][termFuncString]()
                }
                return aggregatedObj
            }

            return obj
        }

        /**
         * Partitions the elements of a Iterator 
         */
        iter.partition = iter.groupBy
        iter.partitionBy = iter.groupBy

        /**
         * Applies f on an accumulator (initiated with start) and every element of the Iterator.
         * Returns a single value
         */
        iter.reduce = function(f,start){
            var acc
            if(start===undefined){
                acc = iterator.next().value
            }
            else {
                acc = start
            }
            for(var i of iterator){
                acc = f(acc, i)
            }
            return acc
        }

        /**
         * Counts the elements of the Iterator that satisfy a predicate / matches a regexp / contains all the values specified by an object.
         * If no argument is specified, counts every element
         */
        iter.count = function(f){
            var acc = 0
            var p = f === undefined ? ()=>true: f
            for(var i of iterator){
                if(check(i,p))
                    acc+=1
            }
            return acc
        }

        /**
         * count alias
         */
        iter.size = iter.count

        /**
         * Returns the first element
         */
        iter.first = function(){
            for(var i of iterator){
                return i
            }
        }

        /**
         * returns true if every element satisfies the predicate / matches a regexp / contains all the values specified by an object, false otherwise
         */
        iter.every = function(p){
            for(var i of iterator){
                if(!check(i,p)){
                    return false
                }
            }
            return true
        }

        /**
         * Returns true if some elements statisfy the predicate  / matches a regexp / contains all the values specified by an object, false if none satisfies
         */
         iter.some = function(p){
             for(var i of iterator){
                 if(check(i,p)){
                     return true
                 }
             }
             return false
         }

        /**
         * Returns true if the iterator included the argument (tests with the === operator)
         */
         iter.includes = function(element){
             return iter.some(x=>x===element)
         }

        /**
         * Returns the last element
         */
        iter.last = function(){
            var l
            for(var i of iterator){
                l=i
            }
            return l
        }

        /**
         * Minimum numeric value of the Iterator (if empty = Number.MAX_VALUE)
         */
        iter.min = function(){
            var m = Number.MAX_VALUE
            for(var i of iterator){
                m = m>i ? i : m
            }
            return m
        }

        /**
         * Maximum numeric value of the Iterator (if empty = Number.MAX_VALUE)
         */
        iter.max = function(){
            var m = Number.MIN_VALUE
            for(var i of iterator){
                m = m<i ? i : m
            }
            return m
        }

        /**
         * Sums all the elements of the Iterator
         */
        iter.sum = function(){
            var acc = 0
            for(var i of iterator){
                acc+=i
            }
            return acc
        }

        /**
         * Multiplies all the elements of the Iterator
         * If the Iterator is empty, returns 1
         */
        iter.product = function(){
            var acc = 1
            for(var i of iterator){
                acc *= i
            }
            return acc
        }

        /**
         * Average
         */
        iter.avg = function(){
            var array = iter.toArray()
            var sum = array.reduce((a,b)=>a+b)
            var count = array.length
            return sum / count
        }

        /**
         * Creates a new array with the Iterator elements.
         * If you provide a parameter,
         * only n elements (or less) will be consumed and pushed into the array
         */
        iter.toArray = function(n){
            if(n===undefined){
                var a = []
                var next = iterator.next()
                while(next.done === false){
                    a.push(next.value)
                    next = iterator.next()
                }
                return a
            }
            else {
                return iter.take(n).toArray()
            }
        }

        /**
         * Shortcut to toArray().join()
         */
        iter.join = function(sep){
            return iter.toArray().join(sep)
        }

        return iter
    }

    /**
     * Iterator composed of the given arguments
     */
    Iterator.of = function(){
        var args = arguments
        var ofGen = function*(){
            for(var a of args){
                yield a
            }
        }
        return Iterator(ofGen())
    }

    /**
     * Infinite Iterator of values obtained by applying the function f from the start value
     */
    Iterator.iterate = function(start, f){
        var lazyIterator = function*() {
            var cur = start
            while(true){
                yield cur
                cur = f(cur)
            }
        }
        return Iterator(lazyIterator())
    }

    /**
     * Infinite Iterator of values obtained by applying the function f to the index (starting from 0)
     */
    Iterator.tabulate = function(f){
        var tabGen = function*(){
            for(var i=0; ;i++){
                yield f(i)
            }
        }
        return Iterator(tabGen())
    }


    /** 
     * Iterator of numbers, from startInclusive to endExclusive, with step.
     * With no arguments, it's just an infinite Iterator of integers starting from zero.
     */
    Iterator.range = function(startInclusive, endExclusive, step){
        if(step===undefined)
            step=1

        if(endExclusive === undefined)
            endExclusive = Number.MAX_VALUE

        if(startInclusive === undefined)
            startInclusive = 0

        var ranGen = function*(){
            for(var i= startInclusive; i<endExclusive; i+=step){
                yield i
            }
        }
        return Iterator(ranGen())
    }

    /**
     * Like range, but the second parameter is included. The third parameter is NOT supported here
     */
    Iterator.rangeInclusive = function(startInclusive, endInclusive){
        return Iterator.range(startInclusive,endExclusive+1)
    }

    function generate(f){
        var genGen = function*(){
            while(true){
                yield f()
            }
        }
        return Iterator(genGen())
    }

    /**
     * infinite Iterator composed of the results of the function f
     */
    Iterator.generate = generate

    /**
     * generate alias
     */
    Iterator.continually = Iterator.generate

    /**
     * Infinite Iterator of random values between 0 (inclusive) and 1 (exclusive)
     */
    Iterator.random = ()=>Iterator.generate(Math.random)

    /**
     * infinite Iterator composed of only the element e
     */
    Iterator.fill = function(e){
        var fillGen = function*(){
            while(true){
                yield e
            }
        }
        return Iterator(fillGen())
    }

    /**
     * An empty Iterator
     */
    Iterator.empty = function(){
        var emptyGen = function*(){}
        return Iterator(emptyGen())
    }

    /**
     * Creates a Iterator from an array, object, Set, Map.
     * With a Map, it creates a Iterator of [<key>, <value>]
     * With an object, it creates a Iterator of [<name>, <value>]
     */
    Iterator.from = function(a){
        //if null
        if(a === null || a === undefined)
            return Iterator.empty()
        
        //if Iterable or Iterator
        if(isIterable(a) || isIterator(a)){
            return new Iterator(a)
        }
        //if object
        if(typeof a === 'object'){
            var objGen = function*(){
                for(var e in a){
                    yield [e,a[e]]
                }
            }
            return Iterator(objGen())
        }

        //if something else, call Iterator.of
        return Iterator.of(a)
    }

    /**
     * Like Iterator.from, but, in case of objects or Maps, returns a Iterator of values instead of a Iterator of pairs
     */
    Iterator.values = function(a){
        var s = Iterator.from(a)
        if(a.constructor === Map || (typeof a !== 'string' && a.constructor !== Set && a.constructor !== Array)){
            return s.map(1)
        }
        return s
    }

    /**
     * Infinite iterator that cycles the elements of an iterable
     */
    Iterator.cycle = function(iterable){
        var cycleGen = function*(){
            while(true){
                for(var i of iterable){
                    yield i
                }
            }
        }
        return Iterator(cycleGen())
    }

    /**
     * Augments the Array prototype with the "iterator" function,
     * that returns a new Iterator over that array
     */
    Iterator.augmentArrays = function(){
        Array.prototype.iterator = function(){
            return Iterator(this)
        }
    }

    /**
     * Remove the type augmentation
     */
    Iterator.removeArraysAugmentation = function(){
        if(Array.prototype.iterator!==undefined)
            delete Array.prototype.iterator
    }

    /**
     * augments the arrays before executing the block, then removes the augmentation
     */
    Iterator.augmented = function(block){
        Iterator.augmentArrays()
        block()
        Iterator.removeArraysAugmentation()
    }

    Iterator.noConflict = function() {
        root.Iterator = previous_Iterator
        return Iterator
    }

    function isIterator(i){
        return i.next !== undefined && typeof i.next === 'function'
    }

    function isIterable(i){
        return i!==undefined && i[Symbol.iterator] !== undefined && isIterator(i[Symbol.iterator]())
    }

    Iterator.isIterable = i=>isIterable(i)

    function iteratorsObject(){
        var iterOb = {}

        if(arguments.length===1){
            let o = arguments[0]
            for(var key in o){
                if(o[key].constructor === Array){
                    iterOb[key] = Iterator.from(o[key])
                }
                else {
                    iterOb[key] = o[key]
                }
            }
        }

        iterOb["toArraysObject"] = function(){
            var obj = {}
            for(var key in iterOb){
                if(iterOb[key].constructor === Iterator){
                    obj[key] = iterOb[key].toArray()
                }
            }
            return obj
        }
        return iterOb
    }

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = Iterator
        }
        exports.Iterator = Iterator
    } 
    else {
        root.Iterator = Iterator
    }

}.call(this))
