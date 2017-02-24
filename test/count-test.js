QUnit.test( 'count', assert => {
    var it = Iterator.from([1,2,3])
    assert.equal(3, it.count())
})

QUnit.test( 'count function', assert => {
    var it = Iterator.from([1,2,3])
    assert.equal(2, it.count(i=>i>1))
})