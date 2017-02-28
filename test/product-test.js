QUnit.test( 'product', assert => {
    var it = Iterator.from([1,2,3])
    assert.equal(6, it.product())
})

QUnit.test( 'product zero elements', assert => {
    var it = Iterator.empty()
    assert.equal(1, it.product())
})