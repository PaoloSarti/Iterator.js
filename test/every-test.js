QUnit.test( 'every predicate true', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(it.every(x=>x>0),'Passed!')
})

QUnit.test( 'every predicate false', assert => {
    var it = Iterator.of(3,1,2)
    assert.ok(!it.every(x=>x>2),'Passed!')
})

QUnit.test( 'every object true', assert => {
    var it = Iterator.of({a:1,b:2},{a:1,b:5},{a:1,b:9})
    assert.ok(it.every({a:1}))
})

QUnit.test( 'every object false', assert => {
    var it = Iterator.of({a:1,b:2},{a:3,b:5},{a:1,b:9})
    assert.ok(!it.every({b:1}))
})

QUnit.test('every regex', assert=>{
    var it = Iterator.of("ciao","miao","caio")
    assert.ok(!it.every(/c.*o/))
})
