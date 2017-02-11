QUnit.test( 'some true', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(it.some(x=>x>2),'Passed!')
})

QUnit.test( 'every false', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(!it.some(x=>x>3),'Passed!')
})
