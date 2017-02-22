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
        var self = this

        var iterator
        if(isIterable(it)){
            iterator = it[Symbol.iterator]()
        }
        else if(isIterator(it)){
            iterator=it
        }

        /**
         * iterator
         */
        this[Symbol.iterator] = ()=>iterator  

        /**
         * It is an iterator itself
         */
        this.next = ()=>iterator.next()
        this.nextValue = ()=>iterator.next().value

        /**
         * returns a new Iterator that can iterate only on the first n elements (or less) of the Iterator
         */
        this.take = function(n){
            var takeGen = function*(){
                for(var i=0; i<n; i++){
                    var next = iterator.next()
                    if(next.done === false)
                        yield next.value
                }
            }
            return new Iterator(takeGen())
        }

        /**
         * take alias
         */
        this.limit = this.take

        /**
         * returns a new Iterator that skips the first n elements.
         */
        this.skip = function(n){
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
            return new Iterator(skipGen())
        }

        /**
         * skips every elements until a predicate returns true, then it returns the remaining elements of the Iterator
         */
        this.dropWhile = function(predicate){
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
            return new Iterator(dropWhileGen())
        }

        /**
         * Skip alias
         */
        this.drop = this.skip

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
        this.map = function(f){
            var mapGen = function*(){
                for(var i of iterator){
                    yield mapElement(i,f)
                }
            }
            return new Iterator(mapGen())
        }

        /**
         * Maps the elements to a list of elements, each one yielded in the new Iterator.
         * If a string is provided, then it will flatmap the object property with that name (it has to be an iterable tough).
         */
        this.flatMap = function(f){
            var flatMapGen = function*(){
                for(var i of iterator){
                    var l = mapElement(i,f)
                    for(var j of l){
                        yield j
                    }
                }
            }
            return new Iterator(flatMapGen())
        }

        /**
         * Flattens a Iterator of iterables into a Iterator of the elements of each iterable
         */
        this.flatten = ()=>this.flatMap(i=>i)


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
        this.filter = function(f){
            var filterGen = function*(){
                for(var i of iterator){
                    if(check(i,f)){
                        yield i
                    }
                }
            }
            return new Iterator(filterGen())
        }

        /**
         * Takes all the elements while they satisfy the f condition.
         * A new Iterator is returned
         */
        this.takeWhile = function(f){
            var takeWhileGen = function*(){
                for(var i of iterator){
                    if(f(i)){
                        yield i
                    }
                    else break
                }
            }
            return new Iterator(takeWhileGen())
        }
        
        /**
         * Concats any iterable lazily. Returns a new Iterator
         */
        this.concat = function(s){
            var concatGen = function*(){
                for(var i of iterator){
                    yield i
                }
                for(var i of s){
                    yield i
                }
            }
            return new Iterator(concatGen())
        }

        /**
         * Produces a Iterator of couples from two Iterators
         */
        this.zip = function(s){
            var zipGen = function*(){
                var next1 = iterator.next()
                var next2 = s.next()
                while((!next1.done)&&(!next2.done)){
                    yield [next1.value,next2.value]
                    next1 = iterator.next()
                    next2 = s.next()
                }
            }
            return new Iterator(zipGen())
        }

        /**
         * returns a Iterator of couples in which the first element is an index (staring from 0)
         * and the second is the element of the Iterator
         */
        this.zipWithIndex = function(){
            var zipWithIndexGen = function*(){
                var i=0
                for(var e of iterator){
                    yield [i,e]
                    i++
                }
            }
            return new Iterator(zipWithIndexGen())
        }

        /**
         * Filter by providing a predicate on the index (starting from 0 from the current item)
         */
        this.filterByIndex = function(f){
            return self.zipWithIndex().filter(e=>f(e[0])).map(e=>e[1])
        }


        /**
         * Append one or more argument to the Iterator lazily
         */
        this.append = function(){
            var args = arguments
            var appendGen = function*(){
                for(var i of iterator){
                    yield i
                }
                for(var a of args){
                    yield a
                }
            }
            return new Iterator(appendGen())
        }

        /**
         * Generates a new Iterator, in which every element is an array of n elements of the original Iterator
         */
        this.buffer = function(n){
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
                        yield a
                        a = [i]
                    }
                }
                if(a.length>0)
                    yield a
            }
            return new Iterator(bufGen())
        }

        /**
         * Returns a Iterator that is made of partial sums of every previous element of the Iterator
         */
        this.cumulate = function(){
            var cumulateGen = function*(){
                var a = 0
                for(var i of iterator){
                    a = a + i
                    yield a
                }
            }
            return new Iterator(cumulateGen())
        }

        /**
         * Apply a custom generator on the Iterator.
         * The generator should accept the Iterator as a parameter, and yield the elements of the new Iterator
         */
        this.applyGenerator = function(gen){
            return new Iterator(gen(this))
        }

        /**
         * Takes an operator (a mapping function that takes two values and maps them into one value)
         * and another Iterator, and applies the operator to each couple of elements of the two Iterators to produce another Iterator.
         */
        this.applyOperator = function(operator, iter){
            var applyOpGen = function*(){
                for(var i of iterator){
                    var n = iter.next() 
                    if(n.done===true)
                        break

                    yield operator(i,n.value)
                }
            }
            return new Iterator(applyOpGen())
        }

        //HEAVY METHODS
        //THEY USE A SUPPORT ARRAY AND THUS CAN ONLY OPERATE ON A FINITE Iterator!!
        /**
         * Returns a sorted version of the Iterator, according to natural ordering or according to a compare function, or by natural ordering of a property
         */
        this.sorted = function(){
            var args = arguments
            var arrayGen = function*(){
                var array = self.toArray()
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

            return new Iterator(arrayGen())
        }

        /**
         * sorted alias
         */
        this.sort = this.sorted

        /**
         * Returns a new Iterator without repeated elements
         */
        this.distinct = function(){
            var distinctGen = function*(){
                var s = new Set()
                for(var e of iterator){
                    if(!s.has(e)){
                        s.add(e)
                        yield e
                    }
                }
            }
            return new Iterator(distinctGen())
        }

        /**
         * Returns a reversed version of the Iterator
         */
        this.reversed = function(){
            var thisInstance = this
            var revGen = function*(){
                var array = thisInstance.toArray().reverse()
                for(var e of array){
                    yield e
                }
            }
            return new Iterator(revGen())
        }

        this.reverse = this.reversed

        //EAGER METHODS
        //THEY CONSUME THE Iterator!

        /**
         * Executes f(e) for every element e of the Iterator
         */
        this.forEach = function(f){
            for(var i of iterator){
                f(i)
            }
        }

        /**
         * process(n,f)
         * process n elements with the function f
         * Like forEach, but only for the first n elements, then returns the rest of the Iterator
         */
        this.process = function(n, f){
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
            for(var i of iterator){
                if(f(i)===true){
                    return i
                }
            }
            return undefined
        }

        /**
         * Groups the elements of the Iterator using as key the result of function f applied to every element.
         * Or, if you pass a String, groups by that property (in an Iterator of objects)
         */
        this.groupBy = function(f){
            var obj = {}
            this.forEach(e=>{
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
            return obj
        }

        /**
         * Partitions the elements of a Iterator 
         */
        this.partition = this.groupBy
        this.partitionBy = this.groupBy

        /**
         * Applies f on an accumulator (initiated with start) and every element of the Iterator.
         * Returns a single value
         */
        this.reduce = function(f,start){
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
        this.count = function(f){
            var acc = 0
            var p = f === undefined ? ()=>true: f
            for(var i of iterator){
                if(check(i,f))
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
            for(var i of iterator){
                return i
            }
        }

        /**
         * returns true if every element satisfies the predicate / matches a regexp / contains all the values specified by an object, false otherwise
         */
        this.every = function(p){
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
         this.some = function(p){
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
         this.includes = function(element){
             return self.some(x=>x===element)
         }

        /**
         * Returns the last element
         */
        this.last = function(){
            var l
            for(var i of iterator){
                l=i
            }
            return l
        }

        /**
         * Minimum numeric value of the Iterator (if empty = Number.MAX_VALUE)
         */
        this.min = function(){
            var m = Number.MAX_VALUE
            for(var i of iterator){
                m = m>i ? i : m
            }
            return m
        }

        /**
         * Maximum numeric value of the Iterator (if empty = Number.MAX_VALUE)
         */
        this.max = function(){
            var m = Number.MIN_VALUE
            for(var i of iterator){
                m = m<i ? i : m
            }
            return m
        }

        /**
         * Sums all the elements of the Iterator
         */
        this.sum = function(){
            var acc = 0
            for(var i of iterator){
                acc+=i
            }
            return acc
        }

        /**
         * Average
         */
        this.avg = function(){
            var array = self.toArray()
            var sum = array.reduce((a,b)=>a+b)
            var count = array.length
            return sum / count
        }

        /**
         * Creates a new array with the Iterator elements.
         * If you provide a parameter,
         * only n elements (or less) will be consumed and pushed into the array
         */
        this.toArray = function(n){
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
                return self.take(n).toArray()
            }
        }

        /**
         * Shortcut to toArray().join()
         */
        this.join = function(sep){
            return self.toArray().join(sep)
        }

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
        return new Iterator(ofGen())
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
        return new Iterator(lazyIterator())
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
        return new Iterator(tabGen())
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
        return new Iterator(ranGen())
    }

    /**
     * Like range, but the second parameter is included. The third parameter is NOT supported here
     */
    Iterator.rangeInclusive = function(startInclusive, endInclusive){
        return Iterator.range(startInclusive,endExclusive+1)
    }

    /**
     * infinite Iterator composed of the results of the function f
     */
    Iterator.generate = function(f){
        var genGen = function*(){
            while(true){
                yield f()
            }
        }
        return new Iterator(genGen())
    }

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
        return new Iterator(fillGen())
    }

    /**
     * An empty Iterator
     */
    Iterator.empty = function(){
        var emptyGen = function*(){}
        return new Iterator(emptyGen())
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
            return new Iterator(objGen())
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
            return s.map(e=>e.value)
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
        return new Iterator(cycleGen())
    }

    /**
     * Augments the Array prototype with the "iterator" function,
     * that returns a new Iterator over that array
     */
    Iterator.augmentArrays = function(){
        Array.prototype.iterator = function(){
            return new Iterator(this)
        }
    }

    /**
     * Remove the type augmentation
     */
    Iterator.removeArraysAugmentation = function(){
        if(Array.prototype.iterator!==undefined)
            delete Array.prototype.iterator
    }

    Iterator.noConflict = function() {
        root.Iterator = previous_Iterator
        return Iterator
    }

    function isIterator(i){
        return typeof i.next !== undefined
    }

    function isIterable(i){
        return i!==undefined && i[Symbol.iterator] !== undefined && isIterator(i[Symbol.iterator]())
    }

    Iterator.isIterable = i=>isIterable(i)

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
