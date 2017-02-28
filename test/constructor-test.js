QUnit.test('constructor iterable', assert=>{
var a = [2,1,3,2]
    var it = Iterator(a)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),3)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),undefined)
})

QUnit.test('constructor iterator', assert=>{
    var a = [2,1,3,2]
    var it = Iterator(a[Symbol.iterator]())
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),3)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),undefined)
})

QUnit.test('constructor generator', assert=>{
    var fibs = function*(){
        var a = 0
        var b = 1
        while(true){
            yield b
            var c = a
            a = b
            b = b + c
        }
    }
    var it = Iterator(fibs())
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),3)
    assert.equal(it.nextValue(),5)
    //...
})