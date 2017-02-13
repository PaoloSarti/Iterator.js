QUnit.test('skip some', assert=>{
    var it = Iterator.of(1,3,2,3,5,21,54,12)
    var a = it.skip(3).toArray()
    assert.equal(a[0],3)
    assert.equal(a[1],5)
    assert.equal(a[2],21)
    assert.equal(a[3],54)
    assert.equal(a[4],12)
    assert.equal(a.length,5)
})

QUnit.test('skip more than all', assert=>{
    var it = Iterator.of(1,3,2,3)
    var a = it.skip(7).toArray()
    assert.equal(a.length,0)
})

QUnit.test('skip nothing', assert=>{
    var it = Iterator.of(1,3,2,3)
    var a = it.skip(0).toArray()
    assert.equal(a[0],1)
    assert.equal(a[1],3)
    assert.equal(a[2],2)
    assert.equal(a[3],3)
    assert.equal(a.length,4)
})