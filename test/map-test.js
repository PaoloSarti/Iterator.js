QUnit.test( 'map function', assert => {
    var it = Iterator.from([1,2,3])
    var a = it.map(i=>i+6).toArray()
    assert.equal(a[0],7)
    assert.equal(a[1],8)
    assert.equal(a[2],9)
})

QUnit.test( 'map property', assert => {
    var it = Iterator.of({a:1,b:2},{a:3,b:5},{a:6,b:9})
    var a = it.map('b').toArray()
    assert.equal(a[0],2)
    assert.equal(a[1],5)
    assert.equal(a[2],9)
})

QUnit.test('map index', assert=>{
    var it = Iterator.of([1,3,2],[3,5,21],[54,12,1])
    var a = it.map(1).toArray()
    assert.equal(a[0],3)
    assert.equal(a[1],5)
    assert.equal(a[2],12)
})