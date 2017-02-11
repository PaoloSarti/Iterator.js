QUnit.test( 'every true', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(it.every(x=>x>0),'Passed!')
})

QUnit.test( 'every false', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(!it.every(x=>x>2),'Passed!')
})
