QUnit.test( 'includes true', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(it.includes(2),'Passed!')
})

QUnit.test( 'includes false', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(!it.includes(9),'Passed!')
})

QUnit.test('includes no type coercion', assert=>{
    var it = Iterator.of(3,1,2)
    assert.ok(!it.includes("2"),'Passed!')
})