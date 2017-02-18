QUnit.test('cycle', assert=>{
var a = [2,1,3,2]
    var it = Iterator.cycle(a)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),3)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),3)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),2)
    assert.equal(it.nextValue(),1)
    assert.equal(it.nextValue(),3)
    //...
})