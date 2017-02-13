QUnit.test('dropWhile some', assert=>{
    var it = Iterator.of(1,0,-564,3,2,3,0)
    var a = it.dropWhile(i=>i<2).toArray()
    assert.equal(a[0],3)
    assert.equal(a[1],2)
    assert.equal(a[2],3)
    assert.equal(a[3],0)
    assert.equal(a.length,4)
})

QUnit.test('dropWhile all', assert=>{
    var it = Iterator.of(1,3,2,3)
    var a = it.dropWhile(i=>i<7438).toArray()
    assert.equal(a.length,0)
})

QUnit.test('dropWhile nothing', assert=>{
    var it = Iterator.of(1,3,2,3)
    var a = it.dropWhile(i=>false).toArray()
    assert.equal(a[0],1)
    assert.equal(a[1],3)
    assert.equal(a[2],2)
    assert.equal(a[3],3)
    assert.equal(a.length,4)
})