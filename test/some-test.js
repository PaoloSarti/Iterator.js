QUnit.test( 'some predicate true', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(it.some(x=>x>2),'Passed!')
})

QUnit.test( 'some predicate false', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(!it.some(x=>x>3),'Passed!')
})

QUnit.test( 'some object true', assert => {
    var it = Iterator.of({a:1,b:2},{a:3,b:5},{a:1,b:9})
    assert.ok(it.some({a:1}))
})

QUnit.test( 'some object false', assert => {
    var it = Iterator.of({a:1,b:2},{a:3,b:5},{a:1,b:9})
    assert.ok(!it.some({b:1}))
})

QUnit.test('some regex', assert=>{
    var it = Iterator.of("ciao","miao","caio")
    assert.ok(it.some(/c.*o/))
})
