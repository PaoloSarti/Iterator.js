QUnit.test( 'flatMap function', assert => {
    var it = Iterator.from([2,1,23])
    var a = it.flatMap(i=>[i,i+1]).toArray()
    assert.equal(a[0],2)
    assert.equal(a[1],3)
    assert.equal(a[2],1)
    assert.equal(a[3],2)
    assert.equal(a[4],23)
    assert.equal(a[5],24)
})

QUnit.test( 'flatMap property', assert => {
    var it = Iterator.of({a:1,b:[2,1]},{a:3,b:[5]},{a:6,b:[9,4]})
    var a = it.flatMap('b').toArray()
    assert.equal(a[0],2)
    assert.equal(a[1],1)
    assert.equal(a[2],5)
    assert.equal(a[3],9)
    assert.equal(a[4],4)
})

QUnit.test('flatMap index', assert=>{
    var it = Iterator.of([[1,5],3,2],[[3],5,21],[[54,5,1],12,1])
    var a = it.flatMap(0).toArray()
    assert.equal(a[0],1)
    assert.equal(a[1],5)
    assert.equal(a[2],3)
    assert.equal(a[3],54)
    assert.equal(a[4],5)
    assert.equal(a[5],1)
})