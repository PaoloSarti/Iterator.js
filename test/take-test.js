QUnit.test('take not everything', assert=>{
    var it = Iterator.of(1,3,2,3,5,21,54,12)
    var a = it.take(3).toArray()
    assert.equal(a[0],1)
    assert.equal(a[1],3)
    assert.equal(a[2],2)
    assert.equal(a.length,3)
})

QUnit.test('take more than everything', assert=>{
    var it = Iterator.of(1,3,2,3)
    var a = it.take(7).toArray()
    assert.equal(a[0],1)
    assert.equal(a[1],3)
    assert.equal(a[2],2)
    assert.equal(a[3],3)
    assert.equal(a.length,4)
})

QUnit.test('take nothing', assert=>{
    var it = Iterator.of(1,3,2,3)
    var a = it.take(0).toArray()
    assert.equal(a.length,0)
})